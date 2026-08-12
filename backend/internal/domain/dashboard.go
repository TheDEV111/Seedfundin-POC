package domain

import (
	"context"
)

type DashboardStats struct {
	ActiveListings int     `json:"active_listings"`
	TotalTenants   int     `json:"total_tenants"`
	MonthlyRevenue float64 `json:"monthly_revenue"`
}

type DashboardRepository interface {
	GetLandlordStats(ctx context.Context, landlordID string) (*DashboardStats, error)
}
