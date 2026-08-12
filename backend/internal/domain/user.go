package domain

import (
	"time"

	"github.com/google/uuid"
)

type AccountType string

const (
	AccountTypeLandlord AccountType = "landlord"
	AccountTypeTenant   AccountType = "tenant"
)

func (a AccountType) IsValid() bool {
	return a == AccountTypeLandlord || a == AccountTypeTenant
}

type User struct {
	ID          uuid.UUID   `json:"id"`
	SupabaseID  string      `json:"supabase_id"`
	Name        string      `json:"name"`
	Phone       string      `json:"phone"`
	Email       string      `json:"email"`
	AccountType AccountType `json:"account_type"`
	Verified    bool        `json:"verified"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}
