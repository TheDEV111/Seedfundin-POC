package postgres

import (
	"context"
	"database/sql"
	"github.com/seedfundin/backend/internal/domain"
)

type favoriteRepo struct {
	db *sql.DB
}

func NewFavoriteRepository(db *sql.DB) domain.FavoriteRepository {
	return &favoriteRepo{db: db}
}

func (r *favoriteRepo) Add(ctx context.Context, tenantID, listingID string) error {
	query := `INSERT INTO favorites (tenant_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	_, err := r.db.ExecContext(ctx, query, tenantID, listingID)
	return err
}

func (r *favoriteRepo) Remove(ctx context.Context, tenantID, listingID string) error {
	query := `DELETE FROM favorites WHERE tenant_id = $1 AND listing_id = $2`
	_, err := r.db.ExecContext(ctx, query, tenantID, listingID)
	return err
}

func (r *favoriteRepo) GetByTenantID(ctx context.Context, tenantID string) ([]*domain.Listing, error) {
	// Joining favorites with listings table to return actual listing details
	query := `
		SELECT l.id, l.owner_id, l.property_type, l.price, l.currency, l.address,
		       l.photos, l.amenities, l.availability_date, l.description, l.status,
		       l.is_shared, l.housemate_count, l.bedroom_count, l.bathroom_count, l.self_contained,
		       l.created_at, l.updated_at
		FROM listings l
		JOIN favorites f ON l.id = f.listing_id
		WHERE f.tenant_id = $1
		ORDER BY f.created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query, tenantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var listings []*domain.Listing
	for rows.Next() {
		var l domain.Listing
		if err := rows.Scan(
			&l.ID, &l.OwnerID, &l.PropertyType, &l.Price, &l.Currency, &l.Address,
			&l.Photos, &l.Amenities, &l.AvailabilityDate, &l.Description, &l.Status,
			&l.IsShared, &l.HousemateCount, &l.BedroomCount, &l.BathroomCount, &l.SelfContained,
			&l.CreatedAt, &l.UpdatedAt,
		); err != nil {
			return nil, err
		}
		listings = append(listings, &l)
	}
	return listings, nil
}
