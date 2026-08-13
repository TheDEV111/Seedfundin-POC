package handler

import (
	"encoding/json"
	"net/http"

	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type AuthHandler struct {
	userService domain.UserService
}

func NewAuthHandler(uService domain.UserService) *AuthHandler {
	return &AuthHandler{
		userService: uService,
	}
}

func (h *AuthHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authentication claims")
		return
	}

	user, err := h.userService.SyncUser(r.Context(), claims.Sub, claims.Email, claims.Name)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve or sync user profile")
		return
	}

	response.JSON(w, http.StatusOK, user)
}

// UpdateProfileRequest represents the payload for onboarding/updating a profile
type UpdateProfileRequest struct {
	Name        string             `json:"name"`
	Phone       string             `json:"phone"`
	AccountType domain.AccountType `json:"account_type"`
}

func (h *AuthHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authentication claims")
		return
	}

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	update := &domain.User{
		Name:        req.Name,
		Phone:       req.Phone,
		AccountType: req.AccountType,
	}

	user, err := h.userService.UpdateUser(r.Context(), claims.Sub, update)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to update user profile")
		return
	}

	response.JSON(w, http.StatusOK, user)
}

type CheckEmailRequest struct {
	Email string `json:"email"`
}

func (h *AuthHandler) CheckEmail(w http.ResponseWriter, r *http.Request) {
	var req CheckEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}
	if req.Email == "" {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Email is required")
		return
	}

	exists, err := h.userService.CheckEmailExists(r.Context(), req.Email)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to check email")
		return
	}

	response.JSON(w, http.StatusOK, map[string]bool{"exists": exists})
}
