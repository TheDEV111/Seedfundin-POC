package db

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createContactEvent = `-- name: CreateContactEvent :one
INSERT INTO contact_events (listing_id, tenant_id)
VALUES ($1, $2)
RETURNING id, listing_id, tenant_id, revealed_at
`

type CreateContactEventParams struct {
	ListingID uuid.UUID `json:"listing_id"`
	TenantID  uuid.UUID `json:"tenant_id"`
}

func (q *Queries) CreateContactEvent(ctx context.Context, arg CreateContactEventParams) (ContactEvent, error) {
	row := q.db.QueryRowContext(ctx, createContactEvent, arg.ListingID, arg.TenantID)
	var i ContactEvent
	err := row.Scan(
		&i.ID,
		&i.ListingID,
		&i.TenantID,
		&i.RevealedAt,
	)
	return i, err
}

const getContactEvent = `-- name: GetContactEvent :one
SELECT id, listing_id, tenant_id, revealed_at
FROM contact_events
WHERE listing_id = $1 AND tenant_id = $2
LIMIT 1
`

type GetContactEventParams struct {
	ListingID uuid.UUID `json:"listing_id"`
	TenantID  uuid.UUID `json:"tenant_id"`
}

func (q *Queries) GetContactEvent(ctx context.Context, arg GetContactEventParams) (ContactEvent, error) {
	row := q.db.QueryRowContext(ctx, getContactEvent, arg.ListingID, arg.TenantID)
	var i ContactEvent
	err := row.Scan(
		&i.ID,
		&i.ListingID,
		&i.TenantID,
		&i.RevealedAt,
	)
	return i, err
}

const countContactEventsByTenant = `-- name: CountContactEventsByTenant :one
SELECT COUNT(*) FROM contact_events
WHERE tenant_id = $1 AND revealed_at >= $2::timestamptz
`

type CountContactEventsByTenantParams struct {
	TenantID uuid.UUID `json:"tenant_id"`
	Since    time.Time `json:"since"`
}

func (q *Queries) CountContactEventsByTenant(ctx context.Context, arg CountContactEventsByTenantParams) (int64, error) {
	row := q.db.QueryRowContext(ctx, countContactEventsByTenant, arg.TenantID, arg.Since)
	var count int64
	err := row.Scan(&count)
	return count, err
}
