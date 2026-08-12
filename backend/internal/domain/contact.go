package domain

import (
	"time"

	"github.com/google/uuid"
)

type ContactEvent struct {
	ID         uuid.UUID `json:"id"`
	ListingID  uuid.UUID `json:"listing_id"`
	TenantID   uuid.UUID `json:"tenant_id"`
	RevealedAt time.Time `json:"revealed_at"`
}

type LandlordContact struct {
	LandlordName  string `json:"landlord_name"`
	LandlordPhone string `json:"landlord_phone"`
	LandlordEmail string `json:"landlord_email"`
}
