package service

import (
	"context"

	"github.com/seedfundin/backend/internal/domain"
)

type searchService struct {
	listingRepo domain.ListingRepository
}

func NewSearchService(lRepo domain.ListingRepository) domain.SearchService {
	return &searchService{
		listingRepo: lRepo,
	}
}

func (s *searchService) SearchListings(ctx context.Context, filter domain.ListingFilter) ([]*domain.Listing, error) {
	// Set default status to live if not specified
	if filter.Status == nil {
		liveStatus := domain.ListingStatusLive
		filter.Status = &liveStatus
	}

	return s.listingRepo.Search(ctx, filter)
}
