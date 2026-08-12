package domain

import (
	"context"
	"time"
)

type ApplicationStatus string

const (
	ApplicationStatusPending   ApplicationStatus = "pending"
	ApplicationStatusApproved  ApplicationStatus = "approved"
	ApplicationStatusRejected  ApplicationStatus = "rejected"
	ApplicationStatusWithdrawn ApplicationStatus = "withdrawn"
)

type Application struct {
	ID        string            `json:"id"`
	ListingID string            `json:"listing_id"`
	TenantID  string            `json:"tenant_id"`
	Status    ApplicationStatus `json:"status"`
	Message   string            `json:"message"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}

type ApplicationRepository interface {
	Create(ctx context.Context, app *Application) error
	GetByID(ctx context.Context, id string) (*Application, error)
	GetByListingID(ctx context.Context, listingID string) ([]*Application, error)
	GetByTenantID(ctx context.Context, tenantID string) ([]*Application, error)
	UpdateStatus(ctx context.Context, id string, status ApplicationStatus) error
}
