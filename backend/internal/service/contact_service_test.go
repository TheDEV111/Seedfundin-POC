package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/service"
)

type MockContactRepository struct {
	events []*domain.ContactEvent
}

func NewMockContactRepository() *MockContactRepository {
	return &MockContactRepository{}
}

func (m *MockContactRepository) CreateEvent(ctx context.Context, event *domain.ContactEvent) (*domain.ContactEvent, error) {
	if event.ID == uuid.Nil {
		event.ID = uuid.New()
	}
	event.RevealedAt = time.Now()
	m.events = append(m.events, event)
	return event, nil
}

func (m *MockContactRepository) GetEvent(ctx context.Context, listingID, tenantID uuid.UUID) (*domain.ContactEvent, error) {
	for _, e := range m.events {
		if e.ListingID == listingID && e.TenantID == tenantID {
			return e, nil
		}
	}
	return nil, domain.ErrNotFound
}

type MockMailerService struct{}

func (m *MockMailerService) SendEmail(ctx context.Context, toEmail, toName, subject, htmlContent string) error {
	return nil
}

func TestContactService_RevealContact_Success(t *testing.T) {
	uRepo := NewMockUserRepository()
	lRepo := NewMockListingRepository()
	cRepo := NewMockContactRepository()
	mailer := &MockMailerService{}

	svc := service.NewContactService(cRepo, lRepo, uRepo, mailer)
	ctx := context.Background()

	// Landlord
	landlord, _ := uRepo.Create(ctx, &domain.User{
		Name:        "Landlord Bob",
		Phone:       "+15550199",
		Email:       "bob@landlord.com",
		AccountType: domain.AccountTypeHost,
	})

	// Tenant
	tenant, _ := uRepo.Create(ctx, &domain.User{
		Name:        "Tenant Tim",
		Email:       "tim@tenant.com",
		AccountType: domain.AccountTypeTenant,
	})

	// Listing owned by landlord
	listing, _ := lRepo.Create(ctx, &domain.Listing{
		OwnerID:      landlord.ID,
		PropertyType: domain.PropertyTypeRoom,
		Price:        500,
		Address:      "Room 4B, College Row",
	})

	// Reveal contact
	contactInfo, err := svc.RevealContact(ctx, listing.ID, tenant.ID)
	if err != nil {
		t.Fatalf("expected contact reveal success, got error: %v", err)
	}

	if contactInfo.LandlordName != "Landlord Bob" {
		t.Errorf("expected landlord name 'Landlord Bob', got %s", contactInfo.LandlordName)
	}
	if contactInfo.LandlordPhone != "+15550199" {
		t.Errorf("expected landlord phone '+15550199', got %s", contactInfo.LandlordPhone)
	}

	// Verify ContactEvent was logged
	if len(cRepo.events) != 1 {
		t.Errorf("expected 1 contact event logged, got %d", len(cRepo.events))
	}
}
