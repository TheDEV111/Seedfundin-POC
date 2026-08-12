package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
)

type contactService struct {
	contactRepo domain.ContactRepository
	listingRepo domain.ListingRepository
	userRepo    domain.UserRepository
	mailer      domain.MailerService
}

func NewContactService(cRepo domain.ContactRepository, lRepo domain.ListingRepository, uRepo domain.UserRepository, mailer domain.MailerService) domain.ContactService {
	return &contactService{
		contactRepo: cRepo,
		listingRepo: lRepo,
		userRepo:    uRepo,
		mailer:      mailer,
	}
}

func (s *contactService) RevealContact(ctx context.Context, listingID, tenantID uuid.UUID) (*domain.LandlordContact, error) {
	// 1. Verify tenant exists and is a tenant
	tenant, err := s.userRepo.GetByID(ctx, tenantID)
	if err != nil {
		return nil, fmt.Errorf("tenant record not found: %w", err)
	}

	if tenant.AccountType != domain.AccountTypeTenant {
		return nil, fmt.Errorf("%w: only tenants can request contact info", domain.ErrForbidden)
	}

	// 2. Verify listing exists
	listing, err := s.listingRepo.GetByID(ctx, listingID)
	if err != nil {
		return nil, fmt.Errorf("listing not found: %w", err)
	}

	// 3. Fetch landlord contact info
	landlord, err := s.userRepo.GetByID(ctx, listing.OwnerID)
	if err != nil {
		return nil, fmt.Errorf("landlord record not found: %w", err)
	}

	// 4. Log ContactEvent for analytics (funnel conversion tracking)
	event := &domain.ContactEvent{
		ListingID:  listingID,
		TenantID:   tenantID,
		RevealedAt: time.Now(),
	}
	_, err = s.contactRepo.CreateEvent(ctx, event)
	if err != nil {
		// Log error, but proceed returning contact if already logged or created
	}

	// 5. Send notification email to the landlord using Brevo API
	go func() {
		subject := "Someone is interested in your listing!"
		htmlBody := fmt.Sprintf("<p>Hello %s,</p><p>Tenant <strong>%s</strong> (Phone: %s) just viewed your contact info for your listing at <strong>%s</strong>.</p>", landlord.Name, tenant.Name, tenant.Phone, listing.Address)
		
		err := s.mailer.SendEmail(context.Background(), landlord.Email, landlord.Name, subject, htmlBody)
		if err != nil {
			fmt.Printf("Failed to send email to landlord %s: %v\n", landlord.Email, err)
		}
	}()

	return &domain.LandlordContact{
		LandlordName:  landlord.Name,
		LandlordPhone: landlord.Phone,
		LandlordEmail: landlord.Email,
	}, nil
}
