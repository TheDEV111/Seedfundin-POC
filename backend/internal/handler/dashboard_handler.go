package handler

import (
	"net/http"

	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type DashboardHandler struct {
	repo        domain.DashboardRepository
	userService domain.UserService
}

func NewDashboardHandler(repo domain.DashboardRepository, uService domain.UserService) *DashboardHandler {
	return &DashboardHandler{
		repo:        repo,
		userService: uService,
	}
}

func (h *DashboardHandler) GetStats(w http.ResponseWriter, r *http.Request) {
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

	if user.AccountType != domain.AccountTypeLandlord {
		response.Error(w, http.StatusForbidden, "FORBIDDEN", "Only landlords have access to dashboard analytics")
		return
	}

	stats, err := h.repo.GetLandlordStats(r.Context(), user.ID.String())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch dashboard stats")
		return
	}

	response.JSON(w, http.StatusOK, stats)
}
