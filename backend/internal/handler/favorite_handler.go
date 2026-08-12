package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type FavoriteHandler struct {
	repo        domain.FavoriteRepository
	userService domain.UserService
}

func NewFavoriteHandler(repo domain.FavoriteRepository, uService domain.UserService) *FavoriteHandler {
	return &FavoriteHandler{
		repo:        repo,
		userService: uService,
	}
}

type FavoriteRequest struct {
	ListingID string `json:"listing_id"`
}

func (h *FavoriteHandler) AddFavorite(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing claims")
		return
	}

	user, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User profile not found")
		return
	}

	var req FavoriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid JSON payload")
		return
	}

	if err := h.repo.Add(r.Context(), user.ID.String(), req.ListingID); err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to add favorite")
		return
	}

	response.JSON(w, http.StatusCreated, map[string]string{"status": "added"})
}

func (h *FavoriteHandler) RemoveFavorite(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing claims")
		return
	}

	user, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User profile not found")
		return
	}

	listingID := chi.URLParam(r, "id")

	if err := h.repo.Remove(r.Context(), user.ID.String(), listingID); err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to remove favorite")
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"status": "removed"})
}

func (h *FavoriteHandler) ListFavorites(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing claims")
		return
	}

	user, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User profile not found")
		return
	}

	listings, err := h.repo.GetByTenantID(r.Context(), user.ID.String())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch favorites")
		return
	}
	
	if listings == nil {
		listings = []*domain.Listing{}
	}
	response.JSON(w, http.StatusOK, listings)
}
