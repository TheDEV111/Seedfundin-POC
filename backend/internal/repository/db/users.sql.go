package db

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (
    supabase_id, name, phone, email, account_type, verified
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING id, supabase_id, name, phone, email, account_type, verified, created_at, updated_at
`

type CreateUserParams struct {
	SupabaseID  string          `json:"supabase_id"`
	Name        string          `json:"name"`
	Phone       string          `json:"phone"`
	Email       string          `json:"email"`
	AccountType AccountTypeEnum `json:"account_type"`
	Verified    bool            `json:"verified"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.SupabaseID,
		arg.Name,
		arg.Phone,
		arg.Email,
		arg.AccountType,
		arg.Verified,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.SupabaseID,
		&i.Name,
		&i.Phone,
		&i.Email,
		&i.AccountType,
		&i.Verified,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, supabase_id, name, phone, email, account_type, verified, created_at, updated_at FROM users WHERE email = $1 LIMIT 1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.SupabaseID,
		&i.Name,
		&i.Phone,
		&i.Email,
		&i.AccountType,
		&i.Verified,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, supabase_id, name, phone, email, account_type, verified, created_at, updated_at FROM users WHERE id = $1 LIMIT 1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.SupabaseID,
		&i.Name,
		&i.Phone,
		&i.Email,
		&i.AccountType,
		&i.Verified,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserBySupabaseID = `-- name: GetUserBySupabaseID :one
SELECT id, supabase_id, name, phone, email, account_type, verified, created_at, updated_at FROM users WHERE supabase_id = $1 LIMIT 1
`

func (q *Queries) GetUserBySupabaseID(ctx context.Context, supabaseID string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserBySupabaseID, supabaseID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.SupabaseID,
		&i.Name,
		&i.Phone,
		&i.Email,
		&i.AccountType,
		&i.Verified,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateUser = `-- name: UpdateUser :one
UPDATE users
SET
    name = COALESCE($2, name),
    phone = COALESCE($3, phone),
    account_type = COALESCE($4::account_type_enum, account_type),
    verified = COALESCE($5, verified),
    updated_at = NOW()
WHERE id = $1
RETURNING id, supabase_id, name, phone, email, account_type, verified, created_at, updated_at
`

type UpdateUserParams struct {
	ID          uuid.UUID           `json:"id"`
	Name        sql.NullString      `json:"name"`
	Phone       sql.NullString      `json:"phone"`
	AccountType NullAccountTypeEnum `json:"account_type"`
	Verified    sql.NullBool        `json:"verified"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUser,
		arg.ID,
		arg.Name,
		arg.Phone,
		arg.AccountType,
		arg.Verified,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.SupabaseID,
		&i.Name,
		&i.Phone,
		&i.Email,
		&i.AccountType,
		&i.Verified,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
