package handler

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type ContactHandler struct {
	contactService domain.ContactService
	userService    domain.UserService
}

func NewContactHandler(cService domain.ContactService, uService domain.UserService) *ContactHandler {
	return &ContactHandler{
		contactService: cService,
		userService:    uService,
	}
}

func (h *ContactHandler) RevealContact(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	tenantUser, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Tenant user record not found")
		return
	}

	idStr := chi.URLParam(r, "id")
	listingID, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid listing ID format")
		return
	}

	contact, err := h.contactService.RevealContact(r.Context(), listingID, tenantUser.ID)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Listing or contact details not found")
			return
		}
		if errors.Is(err, domain.ErrForbidden) {
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "Only tenants can reveal contact details")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to reveal contact details")
		return
	}

	response.JSON(w, http.StatusOK, contact)
}
