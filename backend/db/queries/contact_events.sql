-- name: CreateContactEvent :one
INSERT INTO contact_events (listing_id, tenant_id)
VALUES ($1, $2)
RETURNING id, listing_id, tenant_id, revealed_at;

-- name: GetContactEvent :one
SELECT id, listing_id, tenant_id, revealed_at
FROM contact_events
WHERE listing_id = $1 AND tenant_id = $2
LIMIT 1;

-- name: CountContactEventsByTenant :one
SELECT COUNT(*) FROM contact_events
WHERE tenant_id = $1 AND revealed_at >= sqlc.arg('since')::timestamptz;
