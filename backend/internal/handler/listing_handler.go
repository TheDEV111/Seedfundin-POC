package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type ListingHandler struct {
	listingService domain.ListingService
	searchService  domain.SearchService
	userService    domain.UserService
}

func NewListingHandler(lService domain.ListingService, sService domain.SearchService, uService domain.UserService) *ListingHandler {
	return &ListingHandler{
		listingService: lService,
		searchService:  sService,
		userService:    uService,
	}
}

type CreateListingRequest struct {
	PropertyType     string    `json:"property_type"`
	Price            float64   `json:"price"`
	Currency         string    `json:"currency"`
	Address          string    `json:"address"`
	Latitude         float64   `json:"latitude"`
	Longitude        float64   `json:"longitude"`
	Photos           []string  `json:"photos"`
	Amenities        []string  `json:"amenities"`
	AvailabilityDate string    `json:"availability_date"`
	Description      string    `json:"description"`
	IsShared         *bool     `json:"is_shared,omitempty"`
	HousemateCount   *int      `json:"housemate_count,omitempty"`
	BedroomCount     *int      `json:"bedroom_count,omitempty"`
	BathroomCount    *int      `json:"bathroom_count,omitempty"`
	SelfContained    *bool     `json:"self_contained,omitempty"`
}

func (h *ListingHandler) CreateListing(w http.ResponseWriter, r *http.Request) {
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

	var req CreateListingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid JSON payload")
		return
	}

	// Validate input shape
	if req.PropertyType == "" || req.Price <= 0 || req.Address == "" {
		response.Error(w, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "property_type, price, and address are required")
		return
	}

	if req.Latitude < -90 || req.Latitude > 90 || req.Longitude < -180 || req.Longitude > 180 {
		response.Error(w, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "invalid latitude/longitude coordinates")
		return
	}

	var availDate time.Time
	if req.AvailabilityDate != "" {
		parsedDate, err := time.Parse("2006-01-02", req.AvailabilityDate)
		if err != nil {
			response.Error(w, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "availability_date must be in YYYY-MM-DD format")
			return
		}
		availDate = parsedDate
	}

	listing := &domain.Listing{
		PropertyType:     domain.PropertyType(req.PropertyType),
		Price:            req.Price,
		Currency:         req.Currency,
		Address:          req.Address,
		Latitude:         req.Latitude,
		Longitude:        req.Longitude,
		Photos:           req.Photos,
		Amenities:        req.Amenities,
		AvailabilityDate: availDate,
		Description:      req.Description,
		IsShared:         req.IsShared,
		HousemateCount:   req.HousemateCount,
		BedroomCount:     req.BedroomCount,
		BathroomCount:    req.BathroomCount,
		SelfContained:    req.SelfContained,
	}

	created, err := h.listingService.CreateListing(r.Context(), user.ID, listing)
	if err != nil {
		if errors.Is(err, domain.ErrForbidden) {
			// Extract the custom message or fallback
			msg := err.Error()
			if msg == domain.ErrForbidden.Error() {
				msg = "Only landlords can create listings"
			}
			response.Error(w, http.StatusForbidden, "FORBIDDEN", msg)
			return
		}
		if errors.Is(err, domain.ErrInvalidInput) {
			response.Error(w, http.StatusUnprocessableEntity, "VALIDATION_FAILED", err.Error())
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to create listing")
		return
	}

	response.JSON(w, http.StatusCreated, created)
}

func (h *ListingHandler) GetListingByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid listing ID format")
		return
	}

	listing, err := h.listingService.GetListingByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Listing not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch listing")
		return
	}

	response.JSON(w, http.StatusOK, listing)
}

func (h *ListingHandler) SearchListings(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := domain.ListingFilter{}

	if propTypeStr := q.Get("type"); propTypeStr != "" {
		pType := domain.PropertyType(propTypeStr)
		if pType.IsValid() {
			filter.PropertyType = &pType
		}
	}

	if minPriceStr := q.Get("min_price"); minPriceStr != "" {
		if val, err := strconv.ParseFloat(minPriceStr, 64); err == nil {
			filter.MinPrice = &val
		}
	}

	if maxPriceStr := q.Get("max_price"); maxPriceStr != "" {
		if val, err := strconv.ParseFloat(maxPriceStr, 64); err == nil {
			filter.MaxPrice = &val
		}
	}

	if latStr := q.Get("lat"); latStr != "" {
		if val, err := strconv.ParseFloat(latStr, 64); err == nil {
			filter.Latitude = &val
		}
	}

	if lngStr := q.Get("lng"); lngStr != "" {
		if val, err := strconv.ParseFloat(lngStr, 64); err == nil {
			filter.Longitude = &val
		}
	}

	if radiusStr := q.Get("radius_km"); radiusStr != "" {
		if val, err := strconv.ParseFloat(radiusStr, 64); err == nil {
			filter.RadiusKM = &val
		}
	}

	if amenitiesStr := q.Get("amenities"); amenitiesStr != "" {
		filter.Amenities = strings.Split(amenitiesStr, ",")
	}

	results, err := h.searchService.SearchListings(r.Context(), filter)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	if results == nil {
		results = []*domain.Listing{}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"listings": results,
		"count":    len(results),
	})
}

type UpdateListingRequest struct {
	PropertyType   *string  `json:"property_type,omitempty"`
	Price          *float64 `json:"price,omitempty"`
	Currency       *string  `json:"currency,omitempty"`
	Address        *string  `json:"address,omitempty"`
	Latitude       *float64 `json:"latitude,omitempty"`
	Longitude      *float64 `json:"longitude,omitempty"`
	Photos         []string `json:"photos,omitempty"`
	Amenities      []string `json:"amenities,omitempty"`
	Description    *string  `json:"description,omitempty"`
	Status         *string  `json:"status,omitempty"`
	IsShared       *bool    `json:"is_shared,omitempty"`
	HousemateCount *int     `json:"housemate_count,omitempty"`
	BedroomCount   *int     `json:"bedroom_count,omitempty"`
	BathroomCount  *int     `json:"bathroom_count,omitempty"`
	SelfContained  *bool    `json:"self_contained,omitempty"`
}

func (h *ListingHandler) UpdateListing(w http.ResponseWriter, r *http.Request) {
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

	idStr := chi.URLParam(r, "id")
	listingID, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid listing ID format")
		return
	}

	var req UpdateListingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_JSON", "Invalid JSON body")
		return
	}

	update := &domain.Listing{}
	if req.PropertyType != nil {
		update.PropertyType = domain.PropertyType(*req.PropertyType)
	}
	if req.Price != nil {
		update.Price = *req.Price
	}
	if req.Currency != nil {
		update.Currency = *req.Currency
	}
	if req.Address != nil {
		update.Address = *req.Address
	}
	if req.Latitude != nil {
		update.Latitude = *req.Latitude
	}
	if req.Longitude != nil {
		update.Longitude = *req.Longitude
	}
	if req.Photos != nil {
		update.Photos = req.Photos
	}
	if req.Amenities != nil {
		update.Amenities = req.Amenities
	}
	if req.Description != nil {
		update.Description = *req.Description
	}
	if req.Status != nil {
		update.Status = domain.ListingStatus(*req.Status)
	}
	update.IsShared = req.IsShared
	update.HousemateCount = req.HousemateCount
	update.BedroomCount = req.BedroomCount
	update.BathroomCount = req.BathroomCount
	update.SelfContained = req.SelfContained

	updated, err := h.listingService.UpdateListing(r.Context(), user.ID, listingID, update)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Listing not found")
			return
		}
		if errors.Is(err, domain.ErrForbidden) {
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You can only update your own listings")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to update listing")
		return
	}

	response.JSON(w, http.StatusOK, updated)
}
