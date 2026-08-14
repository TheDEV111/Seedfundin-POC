package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/handler"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type MockListingService struct {
	listings map[uuid.UUID]*domain.Listing
}

func (m *MockListingService) CreateListing(ctx context.Context, ownerID uuid.UUID, listing *domain.Listing) (*domain.Listing, error) {
	listing.ID = uuid.New()
	listing.OwnerID = ownerID
	m.listings[listing.ID] = listing
	return listing, nil
}

func (m *MockListingService) GetListingByID(ctx context.Context, id uuid.UUID) (*domain.Listing, error) {
	l, ok := m.listings[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return l, nil
}

func (m *MockListingService) UpdateListing(ctx context.Context, ownerID uuid.UUID, listingID uuid.UUID, update *domain.Listing) (*domain.Listing, error) {
	l, ok := m.listings[listingID]
	if !ok {
		return nil, domain.ErrNotFound
	}
	if l.OwnerID != ownerID {
		return nil, domain.ErrForbidden
	}
	return l, nil
}

type MockSearchService struct{}

func (m *MockSearchService) SearchListings(ctx context.Context, filter domain.ListingFilter) ([]*domain.Listing, error) {
	return []*domain.Listing{}, nil
}

type MockUserService struct {
	user *domain.User
}

func (m *MockUserService) GetCurrentUser(ctx context.Context, supabaseID string) (*domain.User, error) {
	return m.user, nil
}

func (m *MockUserService) SyncUser(ctx context.Context, supabaseID, email, name string) (*domain.User, error) {
	return m.user, nil
}

func (m *MockUserService) UpdateUser(ctx context.Context, supabaseID string, update *domain.User) (*domain.User, error) {
	return m.user, nil
}

func (m *MockUserService) CheckEmailExists(ctx context.Context, email string) (bool, error) {
	return false, nil
}

func TestListingHandler_GetListingByID_NotFound_ErrorShape(t *testing.T) {
	lService := &MockListingService{listings: make(map[uuid.UUID]*domain.Listing)}
	sService := &MockSearchService{}
	uService := &MockUserService{}

	h := handler.NewListingHandler(lService, sService, uService)

	r := chi.NewRouter()
	r.Get("/api/v1/listings/{id}", h.GetListingByID)

	nonExistentID := uuid.New()
	req := httptest.NewRequest("GET", "/api/v1/listings/"+nonExistentID.String(), nil)
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected status 404 Not Found, got %d", rec.Code)
	}

	var respBody response.ErrorResponseBody
	if err := json.Unmarshal(rec.Body.Bytes(), &respBody); err != nil {
		t.Fatalf("failed to parse error response JSON: %v", err)
	}

	if respBody.Error.Code != "NOT_FOUND" {
		t.Errorf("expected error code NOT_FOUND, got %s", respBody.Error.Code)
	}
}

func TestListingHandler_CreateListing_ValidationFailure(t *testing.T) {
	landlordID := uuid.New()
	lService := &MockListingService{listings: make(map[uuid.UUID]*domain.Listing)}
	sService := &MockSearchService{}
	uService := &MockUserService{user: &domain.User{ID: landlordID, AccountType: domain.AccountTypeLandlord}}

	h := handler.NewListingHandler(lService, sService, uService)

	// Create listing request with missing required price & address
	body := []byte(`{"property_type": "room"}`)
	req := httptest.NewRequest("POST", "/api/v1/listings", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	// Inject claims into context
	ctx := middleware.SetUserClaims(req.Context(), &middleware.UserClaims{Sub: "sub_123"})
	req = req.WithContext(ctx)

	rec := httptest.NewRecorder()
	h.CreateListing(rec, req)

	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected status 422 Unprocessable Entity, got %d", rec.Code)
	}

	var respBody response.ErrorResponseBody
	json.Unmarshal(rec.Body.Bytes(), &respBody)
	if respBody.Error.Code != "VALIDATION_FAILED" {
		t.Errorf("expected error code VALIDATION_FAILED, got %s", respBody.Error.Code)
	}
}
