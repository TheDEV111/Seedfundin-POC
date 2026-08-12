package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type ApplicationHandler struct {
	repo        domain.ApplicationRepository
	userService domain.UserService
}

func NewApplicationHandler(repo domain.ApplicationRepository, uService domain.UserService) *ApplicationHandler {
	return &ApplicationHandler{
		repo:        repo,
		userService: uService,
	}
}

type CreateAppRequest struct {
	ListingID string `json:"listing_id"`
	Message   string `json:"message"`
}

func (h *ApplicationHandler) CreateApplication(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authentication claims")
		return
	}

	user, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User profile not found")
		return
	}

	if user.AccountType != domain.AccountTypeTenant {
		response.Error(w, http.StatusForbidden, "FORBIDDEN", "Only tenants can apply for properties")
		return
	}

	var req CreateAppRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid JSON payload")
		return
	}

	app := &domain.Application{
		ListingID: req.ListingID,
		TenantID:  user.ID.String(),
		Status:    domain.ApplicationStatusPending,
		Message:   req.Message,
	}

	if err := h.repo.Create(r.Context(), app); err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to submit application")
		return
	}

	response.JSON(w, http.StatusCreated, app)
}

func (h *ApplicationHandler) ListApplications(w http.ResponseWriter, r *http.Request) {
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

	if user.AccountType == domain.AccountTypeTenant {
		apps, err := h.repo.GetByTenantID(r.Context(), user.ID.String())
		if err != nil {
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch applications")
			return
		}
		response.JSON(w, http.StatusOK, apps)
		return
	}

	// For landlord, we would list by listingID (via query param)
	listingID := r.URL.Query().Get("listing_id")
	if listingID == "" {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "listing_id query param required for landlords")
		return
	}
	apps, err := h.repo.GetByListingID(r.Context(), listingID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch applications")
		return
	}
	response.JSON(w, http.StatusOK, apps)
}

type UpdateStatusRequest struct {
	Status string `json:"status"`
}

func (h *ApplicationHandler) UpdateApplicationStatus(w http.ResponseWriter, r *http.Request) {
	appID := chi.URLParam(r, "id")
	
	var req UpdateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid JSON payload")
		return
	}

	if err := h.repo.UpdateStatus(r.Context(), appID, domain.ApplicationStatus(req.Status)); err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to update status")
		return
	}
	
	response.JSON(w, http.StatusOK, map[string]string{"status": "updated"})
}
