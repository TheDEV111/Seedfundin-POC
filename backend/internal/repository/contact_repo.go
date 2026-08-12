package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/repository/db"
)

type ContactRepo struct {
	q *db.Queries
}

func NewContactRepository(queries *db.Queries) domain.ContactRepository {
	return &ContactRepo{q: queries}
}

func (r *ContactRepo) CreateEvent(ctx context.Context, event *domain.ContactEvent) (*domain.ContactEvent, error) {
	row, err := r.q.CreateContactEvent(ctx, db.CreateContactEventParams{
		ListingID: event.ListingID,
		TenantID:  event.TenantID,
	})
	if err != nil {
		return nil, err
	}

	return &domain.ContactEvent{
		ID:         row.ID,
		ListingID:  row.ListingID,
		TenantID:   row.TenantID,
		RevealedAt: row.RevealedAt,
	}, nil
}

func (r *ContactRepo) GetEvent(ctx context.Context, listingID, tenantID uuid.UUID) (*domain.ContactEvent, error) {
	row, err := r.q.GetContactEvent(ctx, db.GetContactEventParams{
		ListingID: listingID,
		TenantID:  tenantID,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}

	return &domain.ContactEvent{
		ID:         row.ID,
		ListingID:  row.ListingID,
		TenantID:   row.TenantID,
		RevealedAt: row.RevealedAt,
	}, nil
}
