package domain

import (
	"context"

	"github.com/google/uuid"
)

// UserRepository defines the persistence interface for User entity.
type UserRepository interface {
	Create(ctx context.Context, user *User) (*User, error)
	GetByID(ctx context.Context, id uuid.UUID) (*User, error)
	GetBySupabaseID(ctx context.Context, supabaseID string) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	Update(ctx context.Context, user *User) (*User, error)
}

// ListingRepository defines the persistence interface for Listing entity.
type ListingRepository interface {
	Create(ctx context.Context, listing *Listing) (*Listing, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Listing, error)
	Update(ctx context.Context, listing *Listing) (*Listing, error)
	Search(ctx context.Context, filter ListingFilter) ([]*Listing, error)
	CountByOwnerID(ctx context.Context, ownerID uuid.UUID) (int, error)
}

// ContactRepository defines the persistence interface for ContactEvent entity.
type ContactRepository interface {
	CreateEvent(ctx context.Context, event *ContactEvent) (*ContactEvent, error)
	GetEvent(ctx context.Context, listingID, tenantID uuid.UUID) (*ContactEvent, error)
}

// Service interfaces
type ListingService interface {
	CreateListing(ctx context.Context, ownerID uuid.UUID, listing *Listing) (*Listing, error)
	GetListingByID(ctx context.Context, id uuid.UUID) (*Listing, error)
	UpdateListing(ctx context.Context, ownerID uuid.UUID, listingID uuid.UUID, update *Listing) (*Listing, error)
}

type SearchService interface {
	SearchListings(ctx context.Context, filter ListingFilter) ([]*Listing, error)
}

type MailerService interface {
	SendEmail(ctx context.Context, toEmail, toName, subject, htmlContent string) error
}

type ContactService interface {
	RevealContact(ctx context.Context, listingID, tenantID uuid.UUID) (*LandlordContact, error)
}

type UserService interface {
	GetCurrentUser(ctx context.Context, supabaseID string) (*User, error)
	SyncUser(ctx context.Context, supabaseID, email, name string) (*User, error)
	UpdateUser(ctx context.Context, supabaseID string, update *User) (*User, error)
	CheckEmailExists(ctx context.Context, email string) (bool, error)
}
