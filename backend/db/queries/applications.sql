-- name: CreateApplication :one
INSERT INTO applications (listing_id, tenant_id, status, message)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetApplication :one
SELECT * FROM applications WHERE id = $1;

-- name: ListApplicationsByListing :many
SELECT * FROM applications WHERE listing_id = $1 ORDER BY created_at DESC;

-- name: ListApplicationsByTenant :many
SELECT * FROM applications WHERE tenant_id = $1 ORDER BY created_at DESC;

-- name: UpdateApplicationStatus :exec
UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2;
