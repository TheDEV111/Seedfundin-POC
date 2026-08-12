package domain

import (
	"time"

	"github.com/google/uuid"
)

type PropertyType string

const (
	PropertyTypeRoom      PropertyType = "room"
	PropertyTypeApartment PropertyType = "apartment"
)

func (p PropertyType) IsValid() bool {
	return p == PropertyTypeRoom || p == PropertyTypeApartment
}

type ListingStatus string

const (
	ListingStatusDraft   ListingStatus = "draft"
	ListingStatusLive    ListingStatus = "live"
	ListingStatusFilled  ListingStatus = "filled"
	ListingStatusExpired ListingStatus = "expired"
)

func (s ListingStatus) IsValid() bool {
	switch s {
	case ListingStatusDraft, ListingStatusLive, ListingStatusFilled, ListingStatusExpired:
		return true
	default:
		return false
	}
}

type Listing struct {
	ID               uuid.UUID     `json:"id"`
	OwnerID          uuid.UUID     `json:"owner_id"`
	PropertyType     PropertyType  `json:"property_type"`
	Price            float64       `json:"price"`
	Currency         string        `json:"currency"`
	Address          string        `json:"address"`
	Latitude         float64       `json:"latitude"`
	Longitude        float64       `json:"longitude"`
	Photos           []string      `json:"photos"`
	Amenities        []string      `json:"amenities"`
	AvailabilityDate time.Time     `json:"availability_date"`
	Description      string        `json:"description"`
	Status           ListingStatus `json:"status"`

	// Room specific fields
	IsShared       *bool `json:"is_shared,omitempty"`
	HousemateCount *int  `json:"housemate_count,omitempty"`

	// Apartment specific fields
	BedroomCount  *int  `json:"bedroom_count,omitempty"`
	BathroomCount *int  `json:"bathroom_count,omitempty"`
	SelfContained *bool `json:"self_contained,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Calculated field for search
	DistanceKM *float64 `json:"distance_km,omitempty"`
}

type ListingFilter struct {
	PropertyType *PropertyType  `json:"property_type,omitempty"`
	MinPrice     *float64       `json:"min_price,omitempty"`
	MaxPrice     *float64       `json:"max_price,omitempty"`
	Latitude     *float64       `json:"latitude,omitempty"`
	Longitude    *float64       `json:"longitude,omitempty"`
	RadiusKM     *float64       `json:"radius_km,omitempty"`
	Amenities    []string       `json:"amenities,omitempty"`
	Status       *ListingStatus `json:"status,omitempty"`
}
