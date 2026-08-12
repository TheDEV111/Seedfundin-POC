-- name: CreateListing :one
INSERT INTO listings (
    owner_id, property_type, price, currency, address, location,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained
) VALUES (
    $1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6::float8, $7::float8), 4326),
    $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17
)
RETURNING
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at;

-- name: GetListingByID :one
SELECT
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at
FROM listings
WHERE id = $1 LIMIT 1;

-- name: UpdateListing :one
UPDATE listings
SET
    property_type = COALESCE(sqlc.narg('property_type')::property_type_enum, property_type),
    price = COALESCE(sqlc.narg('price'), price),
    currency = COALESCE(sqlc.narg('currency'), currency),
    address = COALESCE(sqlc.narg('address'), address),
    location = CASE
        WHEN sqlc.narg('latitude')::float8 IS NOT NULL AND sqlc.narg('longitude')::float8 IS NOT NULL
        THEN ST_SetSRID(ST_MakePoint(sqlc.narg('longitude')::float8, sqlc.narg('latitude')::float8), 4326)
        ELSE location
    END,
    photos = COALESCE(sqlc.narg('photos'), photos),
    amenities = COALESCE(sqlc.narg('amenities'), amenities),
    availability_date = COALESCE(sqlc.narg('availability_date'), availability_date),
    description = COALESCE(sqlc.narg('description'), description),
    status = COALESCE(sqlc.narg('status')::listing_status_enum, status),
    is_shared = COALESCE(sqlc.narg('is_shared'), is_shared),
    housemate_count = COALESCE(sqlc.narg('housemate_count'), housemate_count),
    bedroom_count = COALESCE(sqlc.narg('bedroom_count'), bedroom_count),
    bathroom_count = COALESCE(sqlc.narg('bathroom_count'), bathroom_count),
    self_contained = COALESCE(sqlc.narg('self_contained'), self_contained),
    updated_at = NOW()
WHERE id = $1 AND owner_id = $2
RETURNING
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at;

-- name: SearchListings :many
SELECT
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at,
    CASE
        WHEN sqlc.narg('latitude')::float8 IS NOT NULL AND sqlc.narg('longitude')::float8 IS NOT NULL THEN
            ST_Distance(
                location::geography,
                ST_SetSRID(ST_MakePoint(sqlc.narg('longitude')::float8, sqlc.narg('latitude')::float8), 4326)::geography
            ) / 1000.0
        ELSE 0.0
    END::float8 AS distance_km
FROM listings
WHERE
    (sqlc.narg('property_type')::property_type_enum IS NULL OR property_type = sqlc.narg('property_type')::property_type_enum)
    AND (sqlc.narg('min_price')::numeric IS NULL OR price >= sqlc.narg('min_price')::numeric)
    AND (sqlc.narg('max_price')::numeric IS NULL OR price <= sqlc.narg('max_price')::numeric)
    AND (sqlc.narg('status')::listing_status_enum IS NULL OR status = sqlc.narg('status')::listing_status_enum)
    AND (
        sqlc.narg('latitude')::float8 IS NULL OR sqlc.narg('longitude')::float8 IS NULL OR sqlc.narg('radius_km')::float8 IS NULL OR
        ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint(sqlc.narg('longitude')::float8, sqlc.narg('latitude')::float8), 4326)::geography,
            (sqlc.narg('radius_km')::float8 * 1000.0)
        )
    )
    AND (sqlc.narg('amenities')::text[] IS NULL OR amenities @> sqlc.narg('amenities')::text[])
ORDER BY created_at DESC;
