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
		subject := "Seedfundin - Someone is interested in your listing!"
		htmlBody := fmt.Sprintf(`
		<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2B2B26; background-color: #F7F7F2; border-radius: 12px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h1 style="font-size: 24px; font-weight: 800; margin: 0;">Seed<span style="color: #6B7A3A;">fundin</span></h1>
			</div>
			<div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
				<p style="font-size: 16px; line-height: 1.5; margin-top: 0;">Hello %s,</p>
				<p style="font-size: 16px; line-height: 1.5;">Great news! A tenant is interested in your property.</p>
				<div style="background-color: rgba(107, 122, 58, 0.1); border-left: 4px solid #6B7A3A; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
					<p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Tenant Details:</strong></p>
					<p style="margin: 0 0 5px 0; font-size: 15px;">Name: <strong>%s</strong></p>
					<p style="margin: 0; font-size: 15px;">Phone: <strong>%s</strong></p>
				</div>
				<p style="font-size: 15px; color: #666; margin-bottom: 0;">They viewed the contact information for your listing at <strong>%s</strong>.</p>
			</div>
			<div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
				<p>&copy; %d Seedfundin Marketplace. All rights reserved.</p>
			</div>
		</div>`, landlord.Name, tenant.Name, tenant.Phone, listing.Address, time.Now().Year())
		
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
