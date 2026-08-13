package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
	"github.com/seedfundin/backend/internal/config"
	"github.com/seedfundin/backend/internal/handler"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/internal/repository"
	"github.com/seedfundin/backend/internal/repository/db"
	"github.com/seedfundin/backend/internal/repository/postgres"
	"github.com/seedfundin/backend/internal/service"
)

func main() {
	// 1. Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// 2. Connect to database
	dbConn, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	if err := dbConn.Ping(); err != nil {
		log.Printf("Warning: Database ping failed (will retry on requests): %v", err)
	}

	// 3. Initialize sqlc Queries
	queries := db.New(dbConn)

	// 4. Initialize Repositories (Repository Layer)
	userRepo := repository.NewUserRepository(queries)
	listingRepo := repository.NewListingRepository(queries)
	contactRepo := repository.NewContactRepository(queries)
	
	// Postgres DB explicitly passed for new repos
	appRepo := postgres.NewApplicationRepository(dbConn)
	msgRepo := postgres.NewMessageRepository(dbConn)
	favRepo := postgres.NewFavoriteRepository(dbConn)
	dashRepo := postgres.NewDashboardRepository(dbConn)

	mailerService := service.NewBrevoMailer(cfg.BrevoAPIKey, cfg.BrevoFromEmail, cfg.BrevoFromName)

	// 5. Initialize Services (Service Layer)
	userService := service.NewUserService(userRepo)
	listingService := service.NewListingService(listingRepo, userRepo)
	searchService := service.NewSearchService(listingRepo)
	contactService := service.NewContactService(contactRepo, listingRepo, userRepo, mailerService)

	// 6. Initialize Handlers (Handler/Transport Layer)
	listingHandler := handler.NewListingHandler(listingService, searchService, userService)
	contactHandler := handler.NewContactHandler(contactService, userService)
	authHandler := handler.NewAuthHandler(userService)
	
	appHandler := handler.NewApplicationHandler(appRepo, userService)
	msgHandler := handler.NewMessageHandler(msgRepo, userService)
	favHandler := handler.NewFavoriteHandler(favRepo, userService)
	dashHandler := handler.NewDashboardHandler(dashRepo, userService)

	// 7. Setup Router & Middleware
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.CORS())

	// Swagger UI and OpenAPI Spec
	r.Get("/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "docs/api/openapi.yaml")
	})
	r.Get("/swagger", func(w http.ResponseWriter, r *http.Request) {
		html := `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(html))
	})

	// Rate limiter for high-abuse surface endpoints (5 requests per minute per IP)
	contactRateLimiter := middleware.NewRateLimiter(5, 1*time.Minute)

	// API Routes v1
	r.Route("/api/v1", func(r chi.Router) {
		// Whitelisted public routes
		r.Get("/listings", listingHandler.SearchListings)
		r.Get("/listings/{id}", listingHandler.GetListingByID)
		r.Post("/auth/check-email", authHandler.CheckEmail)

		// Protected routes requiring JWT authentication
		r.Group(func(r chi.Router) {
			r.Use(middleware.JWTAuth(cfg.JWTSecret))

			r.Post("/listings", listingHandler.CreateListing)
			r.Patch("/listings/{id}", listingHandler.UpdateListing)
			r.Get("/me", authHandler.GetMe)
			r.Patch("/me", authHandler.UpdateProfile)

			// Protected + Rate Limited contact reveal endpoint
			r.With(contactRateLimiter.Middleware).Post("/listings/{id}/contact", contactHandler.RevealContact)

			// Dashboard Features
			r.Get("/dashboard/stats", dashHandler.GetStats)

			// Applications
			r.Post("/applications", appHandler.CreateApplication)
			r.Get("/applications", appHandler.ListApplications)
			r.Patch("/applications/{id}/status", appHandler.UpdateApplicationStatus)

			// Favorites
			r.Post("/favorites", favHandler.AddFavorite)
			r.Delete("/favorites/{id}", favHandler.RemoveFavorite)
			r.Get("/favorites", favHandler.ListFavorites)

			// Messages
			r.Get("/conversations", msgHandler.ListConversations)
			r.Post("/conversations/{id}/messages", msgHandler.SendMessage)
			r.Get("/conversations/{id}/messages", msgHandler.ListMessages)
		})
	})

	// 8. Start HTTP Server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Starting Seedfundin marketplace API server on %s (env: %s)", addr, cfg.Environment)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Server terminated: %v", err)
	}
}
