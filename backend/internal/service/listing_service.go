package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
)

type listingService struct {
	listingRepo domain.ListingRepository
	userRepo    domain.UserRepository
}

func NewListingService(lRepo domain.ListingRepository, uRepo domain.UserRepository) domain.ListingService {
	return &listingService{
		listingRepo: lRepo,
		userRepo:    uRepo,
	}
}

func (s *listingService) CreateListing(ctx context.Context, ownerID uuid.UUID, listing *domain.Listing) (*domain.Listing, error) {
	// 1. Verify owner exists and is a landlord
	owner, err := s.userRepo.GetByID(ctx, ownerID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user profile: %w", err)
	}

	if owner.AccountType != domain.AccountTypeLandlord {
		return nil, domain.ErrForbidden
	}

	// 1.5 Enforce Free Trial Limit (Max 3 listings per landlord)
	count, err := s.listingRepo.CountByOwnerID(ctx, ownerID)
	if err != nil {
		return nil, fmt.Errorf("failed to check listing limit: %w", err)
	}
	if count >= 3 {
		return nil, fmt.Errorf("%w: Free trial limit reached. You can only create up to 3 listings.", domain.ErrForbidden)
	}

	// 2. Validate property type specific rules
	if !listing.PropertyType.IsValid() {
		return nil, fmt.Errorf("%w: invalid property type", domain.ErrInvalidInput)
	}

	if listing.PropertyType == domain.PropertyTypeRoom {
		if listing.IsShared == nil {
			defaultShared := true
			listing.IsShared = &defaultShared
		}
	} else if listing.PropertyType == domain.PropertyTypeApartment {
		if listing.BedroomCount == nil || *listing.BedroomCount < 1 {
			return nil, fmt.Errorf("%w: apartment must specify bedroom count", domain.ErrInvalidInput)
		}
	}

	// Set defaults
	listing.OwnerID = ownerID
	if listing.Currency == "" {
		listing.Currency = "USD"
	}
	if listing.Status == "" {
		listing.Status = domain.ListingStatusLive
	}
	if listing.AvailabilityDate.IsZero() {
		listing.AvailabilityDate = time.Now()
	}

	return s.listingRepo.Create(ctx, listing)
}

func (s *listingService) GetListingByID(ctx context.Context, id uuid.UUID) (*domain.Listing, error) {
	return s.listingRepo.GetByID(ctx, id)
}

func (s *listingService) UpdateListing(ctx context.Context, ownerID uuid.UUID, listingID uuid.UUID, update *domain.Listing) (*domain.Listing, error) {
	// 1. Check if existing listing exists
	existing, err := s.listingRepo.GetByID(ctx, listingID)
	if err != nil {
		return nil, err
	}

	// 2. Enforce authorization: only owner can update
	if existing.OwnerID != ownerID {
		return nil, domain.ErrForbidden
	}

	update.ID = listingID
	update.OwnerID = ownerID

	return s.listingRepo.Update(ctx, update)
}
