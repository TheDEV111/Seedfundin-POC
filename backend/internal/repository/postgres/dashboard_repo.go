package postgres

import (
	"context"
	"database/sql"
	"github.com/seedfundin/backend/internal/domain"
)

type dashboardRepo struct {
	db *sql.DB
}

func NewDashboardRepository(db *sql.DB) domain.DashboardRepository {
	return &dashboardRepo{db: db}
}

func (r *dashboardRepo) GetLandlordStats(ctx context.Context, landlordID string) (*domain.DashboardStats, error) {
	stats := &domain.DashboardStats{}

	// Active Listings count
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM listings WHERE owner_id = $1 AND status = 'live'", landlordID).Scan(&stats.ActiveListings)
	if err != nil {
		return nil, err
	}

	// Total Tenants (Approved applications for landlord's listings)
	err = r.db.QueryRowContext(ctx, `
		SELECT COUNT(DISTINCT a.tenant_id) 
		FROM applications a
		JOIN listings l ON a.listing_id = l.id
		WHERE l.owner_id = $1 AND a.status = 'approved'
	`, landlordID).Scan(&stats.TotalTenants)
	if err != nil {
		return nil, err
	}

	// Monthly Revenue (Sum of prices of listings with approved tenants)
	err = r.db.QueryRowContext(ctx, `
		SELECT COALESCE(SUM(l.price), 0)
		FROM listings l
		WHERE l.owner_id = $1 AND EXISTS (
			SELECT 1 FROM applications a WHERE a.listing_id = l.id AND a.status = 'approved'
		)
	`, landlordID).Scan(&stats.MonthlyRevenue)
	if err != nil {
		return nil, err
	}

	return stats, nil
}
