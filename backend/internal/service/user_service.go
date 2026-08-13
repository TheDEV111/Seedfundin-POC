package service

import (
	"context"
	"errors"

	"github.com/seedfundin/backend/internal/domain"
)

type userService struct {
	userRepo domain.UserRepository
}

func NewUserService(uRepo domain.UserRepository) domain.UserService {
	return &userService{
		userRepo: uRepo,
	}
}

func (s *userService) GetCurrentUser(ctx context.Context, supabaseID string) (*domain.User, error) {
	return s.userRepo.GetBySupabaseID(ctx, supabaseID)
}

func (s *userService) SyncUser(ctx context.Context, supabaseID, email, name string) (*domain.User, error) {
	user, err := s.userRepo.GetBySupabaseID(ctx, supabaseID)
	if err == nil {
		return user, nil
	}

	if errors.Is(err, domain.ErrNotFound) {
		// Create new user profile linked to Supabase Auth
		newUser := &domain.User{
			SupabaseID:  supabaseID,
			Email:       email,
			Name:        name,
			AccountType: domain.AccountTypeTenant, // default to tenant until upgraded
			Verified:    false,
		}
		return s.userRepo.Create(ctx, newUser)
	}

	return nil, err
}

func (s *userService) UpdateUser(ctx context.Context, supabaseID string, update *domain.User) (*domain.User, error) {
	// First, fetch the existing user
	existing, err := s.userRepo.GetBySupabaseID(ctx, supabaseID)
	if err != nil {
		return nil, err
	}

	// Update only allowed fields
	if update.Name != "" {
		existing.Name = update.Name
	}
	if update.Phone != "" {
		existing.Phone = update.Phone
	}
	if update.AccountType != "" && update.AccountType.IsValid() {
		existing.AccountType = update.AccountType
	}

	return s.userRepo.Update(ctx, existing)
}

func (s *userService) CheckEmailExists(ctx context.Context, email string) (bool, error) {
	_, err := s.userRepo.GetByEmail(ctx, email)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, domain.ErrNotFound) {
		return false, nil
	}
	return false, err
}
