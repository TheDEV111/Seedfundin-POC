package db

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type AccountTypeEnum string

const (
	AccountTypeEnumLandlord AccountTypeEnum = "landlord"
	AccountTypeEnumTenant   AccountTypeEnum = "tenant"
)

func (e *AccountTypeEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = AccountTypeEnum(s)
	case string:
		*e = AccountTypeEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for AccountTypeEnum: %T", src)
	}
	return nil
}

type NullAccountTypeEnum struct {
	AccountTypeEnum AccountTypeEnum
	Valid           bool
}

type PropertyTypeEnum string

const (
	PropertyTypeEnumRoom      PropertyTypeEnum = "room"
	PropertyTypeEnumApartment PropertyTypeEnum = "apartment"
)

func (e *PropertyTypeEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = PropertyTypeEnum(s)
	case string:
		*e = PropertyTypeEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for PropertyTypeEnum: %T", src)
	}
	return nil
}

type NullPropertyTypeEnum struct {
	PropertyTypeEnum PropertyTypeEnum
	Valid            bool
}

func (e NullPropertyTypeEnum) Value() (driver.Value, error) {
	if !e.Valid {
		return nil, nil
	}
	return string(e.PropertyTypeEnum), nil
}

type ListingStatusEnum string

const (
	ListingStatusEnumDraft   ListingStatusEnum = "draft"
	ListingStatusEnumLive    ListingStatusEnum = "live"
	ListingStatusEnumFilled  ListingStatusEnum = "filled"
	ListingStatusEnumExpired ListingStatusEnum = "expired"
)

func (e *ListingStatusEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ListingStatusEnum(s)
	case string:
		*e = ListingStatusEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for ListingStatusEnum: %T", src)
	}
	return nil
}

type NullListingStatusEnum struct {
	ListingStatusEnum ListingStatusEnum
	Valid             bool
}

func (e NullListingStatusEnum) Value() (driver.Value, error) {
	if !e.Valid {
		return nil, nil
	}
	return string(e.ListingStatusEnum), nil
}

type User struct {
	ID          uuid.UUID       `json:"id"`
	SupabaseID  string          `json:"supabase_id"`
	Name        string          `json:"name"`
	Phone       string          `json:"phone"`
	Email       string          `json:"email"`
	AccountType AccountTypeEnum `json:"account_type"`
	Verified    bool            `json:"verified"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

type Listing struct {
	ID               uuid.UUID         `json:"id"`
	OwnerID          uuid.UUID         `json:"owner_id"`
	PropertyType     PropertyTypeEnum  `json:"property_type"`
	Price            string            `json:"price"`
	Currency         string            `json:"currency"`
	Address          string            `json:"address"`
	Location         interface{}       `json:"location"`
	Photos           []string          `json:"photos"`
	Amenities        []string          `json:"amenities"`
	AvailabilityDate time.Time         `json:"availability_date"`
	Description      string            `json:"description"`
	Status           ListingStatusEnum `json:"status"`
	IsShared         sql.NullBool      `json:"is_shared"`
	HousemateCount   sql.NullInt32     `json:"housemate_count"`
	BedroomCount     sql.NullInt32     `json:"bedroom_count"`
	BathroomCount    sql.NullInt32     `json:"bathroom_count"`
	SelfContained    sql.NullBool      `json:"self_contained"`
	CreatedAt        time.Time         `json:"created_at"`
	UpdatedAt        time.Time         `json:"updated_at"`
}

type ContactEvent struct {
	ID         uuid.UUID `json:"id"`
	ListingID  uuid.UUID `json:"listing_id"`
	TenantID   uuid.UUID `json:"tenant_id"`
	RevealedAt time.Time `json:"revealed_at"`
}
