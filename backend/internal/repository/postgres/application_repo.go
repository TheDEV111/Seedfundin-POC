package postgres

import (
	"context"
	"database/sql"
	"github.com/seedfundin/backend/internal/domain"
)

type applicationRepo struct {
	db *sql.DB
}

func NewApplicationRepository(db *sql.DB) domain.ApplicationRepository {
	return &applicationRepo{db: db}
}

func (r *applicationRepo) Create(ctx context.Context, app *domain.Application) error {
	query := `
		INSERT INTO applications (listing_id, tenant_id, status, message)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRowContext(ctx, query, app.ListingID, app.TenantID, app.Status, app.Message).
		Scan(&app.ID, &app.CreatedAt, &app.UpdatedAt)
}

func (r *applicationRepo) GetByID(ctx context.Context, id string) (*domain.Application, error) {
	app := &domain.Application{}
	query := `SELECT id, listing_id, tenant_id, status, message, created_at, updated_at FROM applications WHERE id = $1`
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&app.ID, &app.ListingID, &app.TenantID, &app.Status, &app.Message, &app.CreatedAt, &app.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return app, nil
}

func (r *applicationRepo) GetByListingID(ctx context.Context, listingID string) ([]*domain.Application, error) {
	query := `SELECT id, listing_id, tenant_id, status, message, created_at, updated_at FROM applications WHERE listing_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.QueryContext(ctx, query, listingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apps []*domain.Application
	for rows.Next() {
		app := &domain.Application{}
		if err := rows.Scan(&app.ID, &app.ListingID, &app.TenantID, &app.Status, &app.Message, &app.CreatedAt, &app.UpdatedAt); err != nil {
			return nil, err
		}
		apps = append(apps, app)
	}
	return apps, nil
}

func (r *applicationRepo) GetByTenantID(ctx context.Context, tenantID string) ([]*domain.Application, error) {
	query := `SELECT id, listing_id, tenant_id, status, message, created_at, updated_at FROM applications WHERE tenant_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.QueryContext(ctx, query, tenantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apps []*domain.Application
	for rows.Next() {
		app := &domain.Application{}
		if err := rows.Scan(&app.ID, &app.ListingID, &app.TenantID, &app.Status, &app.Message, &app.CreatedAt, &app.UpdatedAt); err != nil {
			return nil, err
		}
		apps = append(apps, app)
	}
	return apps, nil
}

func (r *applicationRepo) UpdateStatus(ctx context.Context, id string, status domain.ApplicationStatus) error {
	query := `UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, status, id)
	return err
}
