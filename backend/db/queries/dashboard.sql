-- name: GetLandlordDashboardStats :one
SELECT 
    (SELECT COUNT(*) FROM listings WHERE owner_id = $1 AND status = 'live') AS active_listings,
    (SELECT COUNT(DISTINCT a.tenant_id) FROM applications a JOIN listings l ON a.listing_id = l.id WHERE l.owner_id = $1 AND a.status = 'approved') AS total_tenants,
    (SELECT COALESCE(SUM(l.price), 0) FROM listings l WHERE l.owner_id = $1 AND EXISTS (SELECT 1 FROM applications a WHERE a.listing_id = l.id AND a.status = 'approved')) AS monthly_revenue;
