package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/repository/db"
)

type UserRepo struct {
	q *db.Queries
}

func NewUserRepository(queries *db.Queries) domain.UserRepository {
	return &UserRepo{q: queries}
}

func (r *UserRepo) Create(ctx context.Context, u *domain.User) (*domain.User, error) {
	row, err := r.q.CreateUser(ctx, db.CreateUserParams{
		SupabaseID:  u.SupabaseID,
		Name:        u.Name,
		Phone:       u.Phone,
		Email:       u.Email,
		AccountType: db.AccountTypeEnum(u.AccountType),
		Verified:    u.Verified,
	})
	if err != nil {
		return nil, err
	}
	return mapDBUserToDomain(row), nil
}

func (r *UserRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	row, err := r.q.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return mapDBUserToDomain(row), nil
}

func (r *UserRepo) GetBySupabaseID(ctx context.Context, supabaseID string) (*domain.User, error) {
	row, err := r.q.GetUserBySupabaseID(ctx, supabaseID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return mapDBUserToDomain(row), nil
}

func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	row, err := r.q.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return mapDBUserToDomain(row), nil
}

func (r *UserRepo) Update(ctx context.Context, u *domain.User) (*domain.User, error) {
	row, err := r.q.UpdateUser(ctx, db.UpdateUserParams{
		ID:          u.ID,
		Name:        sql.NullString{String: u.Name, Valid: u.Name != ""},
		Phone:       sql.NullString{String: u.Phone, Valid: u.Phone != ""},
		AccountType: db.NullAccountTypeEnum{AccountTypeEnum: db.AccountTypeEnum(u.AccountType), Valid: u.AccountType != ""},
		Verified:    sql.NullBool{Bool: u.Verified, Valid: true},
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return mapDBUserToDomain(row), nil
}

func mapDBUserToDomain(u db.User) *domain.User {
	return &domain.User{
		ID:          u.ID,
		SupabaseID:  u.SupabaseID,
		Name:        u.Name,
		Phone:       u.Phone,
		Email:       u.Email,
		AccountType: domain.AccountType(u.AccountType),
		Verified:    u.Verified,
		CreatedAt:   u.CreatedAt,
		UpdatedAt:   u.UpdatedAt,
	}
}
