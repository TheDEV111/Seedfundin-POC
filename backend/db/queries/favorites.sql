-- name: AddFavorite :exec
INSERT INTO favorites (tenant_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;

-- name: RemoveFavorite :exec
DELETE FROM favorites WHERE tenant_id = $1 AND listing_id = $2;

-- name: ListFavoritesByTenant :many
SELECT l.* 
FROM listings l
JOIN favorites f ON l.id = f.listing_id
WHERE f.tenant_id = $1
ORDER BY f.created_at DESC;
