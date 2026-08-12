# Seedfundin Rental Marketplace Backend MVP

A high-performance Go backend service for a room & apartment rental marketplace MVP built using clean layered architecture.

## Tech Stack & Architecture

- **Language**: Go 1.18+
- **Router**: `chi` (`github.com/go-chi/chi/v5`)
- **Database**: PostgreSQL with PostGIS extension for spatial radius search
- **DB Access**: `sqlc` for type-safe raw SQL queries
- **Migrations**: `golang-migrate` versioned SQL files
- **Auth**: JWT verification (tokens issued externally by Supabase Auth)
- **Logging**: Structured JSON logging with request ID tracing
- **Config**: Single typed `Config` struct loaded once at startup

### Layer Structure (Enforced 4-Layer Clean Architecture)

1. **Handler Layer (`internal/handler`)**: Parses HTTP requests, validates input shape, writes HTTP responses. Zero business logic.
2. **Service Layer (`internal/service`)**: Owns business rules and workflows. Calls repositories. Zero HTTP or SQL dependencies.
3. **Repository Layer (`internal/repository`)**: Talks to Postgres via `sqlc` queries. Maps DB rows to domain structs.
4. **Domain Layer (`internal/domain`)**: Plain Go structs and interfaces. Zero framework or infrastructure dependencies.

---

## Directory Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go             # composition root
├── internal/
│   ├── domain/                 # Listing, User, ContactEvent structs + interfaces
│   ├── handler/                # listing, auth, and contact HTTP handlers
│   ├── service/                # listing, search, contact, and user services
│   ├── repository/             # listing, user, contact repos + sqlc db package
│   ├── middleware/             # JWT auth, structured logging, rate limiter, CORS
│   └── config/                 # typed environment config loader
├── migrations/                 # 000001_init_schema.up.sql & down.sql
├── db/
│   ├── queries/                # raw .sql files compiled by sqlc
│   └── sqlc.yaml
├── pkg/
│   └── response/               # JSON error & success response helpers
├── go.mod
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## API Endpoints (v1)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/listings` | Public | Search listings (`?type=room\|apartment&min_price=&max_price=&lat=&lng=&radius_km=&amenities=`) |
| `GET` | `/api/v1/listings/:id` | Public | Get listing details |
| `POST` | `/api/v1/listings` | Landlord | Create listing |
| `PATCH` | `/api/v1/listings/:id` | Owner | Update listing details |
| `POST` | `/api/v1/listings/:id/contact` | Tenant | Reveal landlord contact details (Rate limited: 5 req/min) |
| `GET` | `/api/v1/me` | Authenticated | Get current authenticated user profile |

---

## Running Locally

### Option 1: Quickstart with Docker Compose

Run the API service alongside Postgres + PostGIS:

```bash
docker-compose up --build
```

### Option 2: Running Go Service Locally

1. Start PostgreSQL with PostGIS:
```bash
docker run -d --name seedfundin_pg \
  -e POSTGRES_DB=marketplace \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -p 5432:5432 \
  postgis/postgis:15-3.3
```

2. Run Migrations:
```bash
migrate -path migrations -database "postgres://postgres:postgrespassword@localhost:5432/marketplace?sslmode=disable" up
```

3. Generate sqlc Code:
```bash
sqlc generate --config db/sqlc.yaml
```

4. Run the API:
```bash
export DATABASE_URL="postgres://postgres:postgrespassword@localhost:5432/marketplace?sslmode=disable"
export JWT_SECRET="your-supabase-jwt-secret-key"
export PORT=8080

go run cmd/api/main.go
```

---

## Running Tests

Run all unit and integration tests:

```bash
go test -v ./...
```
