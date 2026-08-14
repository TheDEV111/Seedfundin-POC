package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/service"
)

// MockUserRepository implements domain.UserRepository for unit testing
type MockUserRepository struct {
	users map[uuid.UUID]*domain.User
}

func NewMockUserRepository() *MockUserRepository {
	return &MockUserRepository{users: make(map[uuid.UUID]*domain.User)}
}

func (m *MockUserRepository) Create(ctx context.Context, u *domain.User) (*domain.User, error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	m.users[u.ID] = u
	return u, nil
}

func (m *MockUserRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	u, ok := m.users[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return u, nil
}

func (m *MockUserRepository) GetBySupabaseID(ctx context.Context, supabaseID string) (*domain.User, error) {
	for _, u := range m.users {
		if u.SupabaseID == supabaseID {
			return u, nil
		}
	}
	return nil, domain.ErrNotFound
}

func (m *MockUserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, domain.ErrNotFound
}

func (m *MockUserRepository) Update(ctx context.Context, u *domain.User) (*domain.User, error) {
	m.users[u.ID] = u
	return u, nil
}

// MockListingRepository implements domain.ListingRepository for unit testing
type MockListingRepository struct {
	listings map[uuid.UUID]*domain.Listing
}

func NewMockListingRepository() *MockListingRepository {
	return &MockListingRepository{listings: make(map[uuid.UUID]*domain.Listing)}
}

func (m *MockListingRepository) Create(ctx context.Context, l *domain.Listing) (*domain.Listing, error) {
	if l.ID == uuid.Nil {
		l.ID = uuid.New()
	}
	m.listings[l.ID] = l
	return l, nil
}

func (m *MockListingRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Listing, error) {
	l, ok := m.listings[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return l, nil
}

func (m *MockListingRepository) Update(ctx context.Context, l *domain.Listing) (*domain.Listing, error) {
	existing, ok := m.listings[l.ID]
	if !ok {
		return nil, domain.ErrNotFound
	}
	if l.Price > 0 {
		existing.Price = l.Price
	}
	if l.Description != "" {
		existing.Description = l.Description
	}
	return existing, nil
}

func (m *MockListingRepository) Search(ctx context.Context, filter domain.ListingFilter) ([]*domain.Listing, error) {
	var results []*domain.Listing
	for _, l := range m.listings {
		if filter.PropertyType != nil && l.PropertyType != *filter.PropertyType {
			continue
		}
		results = append(results, l)
	}
	return results, nil
}

func (m *MockListingRepository) CountByOwnerID(ctx context.Context, ownerID uuid.UUID) (int, error) {
	count := 0
	for _, l := range m.listings {
		if l.OwnerID == ownerID {
			count++
		}
	}
	return count, nil
}

func TestListingService_CreateListing_LandlordOnly(t *testing.T) {
	uRepo := NewMockUserRepository()
	lRepo := NewMockListingRepository()
	svc := service.NewListingService(lRepo, uRepo)

	ctx := context.Background()

	// 1. Create a tenant user
	tenant, _ := uRepo.Create(ctx, &domain.User{
		Name:        "Tenant Tom",
		Email:       "tom@tenant.com",
		AccountType: domain.AccountTypeTenant,
	})

	// 2. Attempt to create listing as tenant (should fail with ErrForbidden)
	bdCount := 2
	_, err := svc.CreateListing(ctx, tenant.ID, &domain.Listing{
		PropertyType: domain.PropertyTypeApartment,
		Price:        1200,
		Address:      "123 Main St",
		BedroomCount: &bdCount,
	})
	if err == nil || err != domain.ErrForbidden {
		t.Fatalf("expected ErrForbidden when tenant creates listing, got: %v", err)
	}

	// 3. Create a landlord user
	landlord, _ := uRepo.Create(ctx, &domain.User{
		Name:        "Landlord Lucy",
		Email:       "lucy@landlord.com",
		AccountType: domain.AccountTypeLandlord,
	})

	// 4. Create listing as landlord (should succeed)
	created, err := svc.CreateListing(ctx, landlord.ID, &domain.Listing{
		PropertyType: domain.PropertyTypeApartment,
		Price:        1500,
		Currency:     "USD",
		Address:      "456 Park Ave",
		BedroomCount: &bdCount,
	})
	if err != nil {
		t.Fatalf("expected success for landlord, got: %v", err)
	}
	if created.OwnerID != landlord.ID {
		t.Errorf("expected owner_id %v, got %v", landlord.ID, created.OwnerID)
	}
	if created.Status != domain.ListingStatusLive {
		t.Errorf("expected status 'live', got %v", created.Status)
	}
}

func TestListingService_UpdateListing_OwnerOnly(t *testing.T) {
	uRepo := NewMockUserRepository()
	lRepo := NewMockListingRepository()
	svc := service.NewListingService(lRepo, uRepo)

	ctx := context.Background()

	landlord1, _ := uRepo.Create(ctx, &domain.User{Name: "L1", AccountType: domain.AccountTypeLandlord})
	landlord2, _ := uRepo.Create(ctx, &domain.User{Name: "L2", AccountType: domain.AccountTypeLandlord})

	bdCount := 1
	listing, _ := svc.CreateListing(ctx, landlord1.ID, &domain.Listing{
		PropertyType: domain.PropertyTypeApartment,
		Price:        1000,
		Address:      "789 Oak Rd",
		BedroomCount: &bdCount,
	})

	// Attempt update by landlord2 (should fail with ErrForbidden)
	_, err := svc.UpdateListing(ctx, landlord2.ID, listing.ID, &domain.Listing{Price: 1100})
	if err != domain.ErrForbidden {
		t.Fatalf("expected ErrForbidden when non-owner updates listing, got: %v", err)
	}

	// Update by landlord1 (should succeed)
	updated, err := svc.UpdateListing(ctx, landlord1.ID, listing.ID, &domain.Listing{Price: 1100})
	if err != nil {
		t.Fatalf("expected update success, got: %v", err)
	}
	if updated.Price != 1100 {
		t.Errorf("expected price 1100, got %f", updated.Price)
	}
}
