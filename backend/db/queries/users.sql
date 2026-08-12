-- name: CreateUser :one
INSERT INTO users (
    supabase_id, name, phone, email, account_type, verified
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1 LIMIT 1;

-- name: GetUserBySupabaseID :one
SELECT * FROM users WHERE supabase_id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1;

-- name: UpdateUser :one
UPDATE users
SET
    name = COALESCE(sqlc.narg('name'), name),
    phone = COALESCE(sqlc.narg('phone'), phone),
    account_type = COALESCE(sqlc.narg('account_type')::account_type_enum, account_type),
    verified = COALESCE(sqlc.narg('verified'), verified),
    updated_at = NOW()
WHERE id = $1
RETURNING *;
