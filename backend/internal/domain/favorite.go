package domain

import (
	"context"
	"time"
)

type Favorite struct {
	TenantID  string    `json:"tenant_id"`
	ListingID string    `json:"listing_id"`
	CreatedAt time.Time `json:"created_at"`
}

type FavoriteRepository interface {
	Add(ctx context.Context, tenantID, listingID string) error
	Remove(ctx context.Context, tenantID, listingID string) error
	GetByTenantID(ctx context.Context, tenantID string) ([]*Listing, error)
}
