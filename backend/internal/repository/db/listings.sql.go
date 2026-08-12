package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

const createListing = `-- name: CreateListing :one
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
    created_at, updated_at
`

type CreateListingParams struct {
	OwnerID          uuid.UUID        `json:"owner_id"`
	PropertyType     PropertyTypeEnum `json:"property_type"`
	Price            string           `json:"price"`
	Currency         string           `json:"currency"`
	Address          string           `json:"address"`
	Column6          float64          `json:"column_6"`
	Column7          float64          `json:"column_7"`
	Photos           []string         `json:"photos"`
	Amenities        []string         `json:"amenities"`
	AvailabilityDate time.Time        `json:"availability_date"`
	Description      string           `json:"description"`
	Status           ListingStatusEnum`json:"status"`
	IsShared         sql.NullBool     `json:"is_shared"`
	HousemateCount   sql.NullInt32    `json:"housemate_count"`
	BedroomCount     sql.NullInt32    `json:"bedroom_count"`
	BathroomCount    sql.NullInt32    `json:"bathroom_count"`
	SelfContained    sql.NullBool     `json:"self_contained"`
}

type CreateListingRow struct {
	ID               uuid.UUID        `json:"id"`
	OwnerID          uuid.UUID        `json:"owner_id"`
	PropertyType     PropertyTypeEnum `json:"property_type"`
	Price            string           `json:"price"`
	Currency         string           `json:"currency"`
	Address          string           `json:"address"`
	Latitude         float64          `json:"latitude"`
	Longitude        float64          `json:"longitude"`
	Photos           []string         `json:"photos"`
	Amenities        []string         `json:"amenities"`
	AvailabilityDate time.Time        `json:"availability_date"`
	Description      string           `json:"description"`
	Status           ListingStatusEnum`json:"status"`
	IsShared         sql.NullBool     `json:"is_shared"`
	HousemateCount   sql.NullInt32    `json:"housemate_count"`
	BedroomCount     sql.NullInt32    `json:"bedroom_count"`
	BathroomCount    sql.NullInt32    `json:"bathroom_count"`
	SelfContained    sql.NullBool     `json:"self_contained"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
}

func (q *Queries) CreateListing(ctx context.Context, arg CreateListingParams) (CreateListingRow, error) {
	row := q.db.QueryRowContext(ctx, createListing,
		arg.OwnerID,
		arg.PropertyType,
		arg.Price,
		arg.Currency,
		arg.Address,
		arg.Column6,
		arg.Column7,
		pq.Array(arg.Photos),
		pq.Array(arg.Amenities),
		arg.AvailabilityDate,
		arg.Description,
		arg.Status,
		arg.IsShared,
		arg.HousemateCount,
		arg.BedroomCount,
		arg.BathroomCount,
		arg.SelfContained,
	)
	var i CreateListingRow
	err := row.Scan(
		&i.ID,
		&i.OwnerID,
		&i.PropertyType,
		&i.Price,
		&i.Currency,
		&i.Address,
		&i.Latitude,
		&i.Longitude,
		pq.Array(&i.Photos),
		pq.Array(&i.Amenities),
		&i.AvailabilityDate,
		&i.Description,
		&i.Status,
		&i.IsShared,
		&i.HousemateCount,
		&i.BedroomCount,
		&i.BathroomCount,
		&i.SelfContained,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getListingByID = `-- name: GetListingByID :one
SELECT
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at
FROM listings
WHERE id = $1 LIMIT 1
`

type GetListingByIDRow struct {
	ID               uuid.UUID        `json:"id"`
	OwnerID          uuid.UUID        `json:"owner_id"`
	PropertyType     PropertyTypeEnum `json:"property_type"`
	Price            string           `json:"price"`
	Currency         string           `json:"currency"`
	Address          string           `json:"address"`
	Latitude         float64          `json:"latitude"`
	Longitude        float64          `json:"longitude"`
	Photos           []string         `json:"photos"`
	Amenities        []string         `json:"amenities"`
	AvailabilityDate time.Time        `json:"availability_date"`
	Description      string           `json:"description"`
	Status           ListingStatusEnum`json:"status"`
	IsShared         sql.NullBool     `json:"is_shared"`
	HousemateCount   sql.NullInt32    `json:"housemate_count"`
	BedroomCount     sql.NullInt32    `json:"bedroom_count"`
	BathroomCount    sql.NullInt32    `json:"bathroom_count"`
	SelfContained    sql.NullBool     `json:"self_contained"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
}

func (q *Queries) GetListingByID(ctx context.Context, id uuid.UUID) (GetListingByIDRow, error) {
	row := q.db.QueryRowContext(ctx, getListingByID, id)
	var i GetListingByIDRow
	err := row.Scan(
		&i.ID,
		&i.OwnerID,
		&i.PropertyType,
		&i.Price,
		&i.Currency,
		&i.Address,
		&i.Latitude,
		&i.Longitude,
		pq.Array(&i.Photos),
		pq.Array(&i.Amenities),
		&i.AvailabilityDate,
		&i.Description,
		&i.Status,
		&i.IsShared,
		&i.HousemateCount,
		&i.BedroomCount,
		&i.BathroomCount,
		&i.SelfContained,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateListing = `-- name: UpdateListing :one
UPDATE listings
SET
    property_type = COALESCE($3::property_type_enum, property_type),
    price = COALESCE($4, price),
    currency = COALESCE($5, currency),
    address = COALESCE($6, address),
    location = CASE
        WHEN $7::float8 IS NOT NULL AND $8::float8 IS NOT NULL
        THEN ST_SetSRID(ST_MakePoint($8::float8, $7::float8), 4326)
        ELSE location
    END,
    photos = COALESCE($9, photos),
    amenities = COALESCE($10, amenities),
    availability_date = COALESCE($11, availability_date),
    description = COALESCE($12, description),
    status = COALESCE($13::listing_status_enum, status),
    is_shared = COALESCE($14, is_shared),
    housemate_count = COALESCE($15, housemate_count),
    bedroom_count = COALESCE($16, bedroom_count),
    bathroom_count = COALESCE($17, bathroom_count),
    self_contained = COALESCE($18, self_contained),
    updated_at = NOW()
WHERE id = $1 AND owner_id = $2
RETURNING
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at
`

type UpdateListingParams struct {
	ID               uuid.UUID            `json:"id"`
	OwnerID          uuid.UUID            `json:"owner_id"`
	PropertyType     NullPropertyTypeEnum `json:"property_type"`
	Price            sql.NullString       `json:"price"`
	Currency         sql.NullString       `json:"currency"`
	Address          sql.NullString       `json:"address"`
	Latitude         sql.NullFloat64      `json:"latitude"`
	Longitude        sql.NullFloat64      `json:"longitude"`
	Photos           []string             `json:"photos"`
	Amenities        []string             `json:"amenities"`
	AvailabilityDate pq.NullTime          `json:"availability_date"`
	Description      sql.NullString       `json:"description"`
	Status           NullListingStatusEnum`json:"status"`
	IsShared         sql.NullBool         `json:"is_shared"`
	HousemateCount   sql.NullInt32        `json:"housemate_count"`
	BedroomCount     sql.NullInt32        `json:"bedroom_count"`
	BathroomCount    sql.NullInt32        `json:"bathroom_count"`
	SelfContained    sql.NullBool         `json:"self_contained"`
}

type UpdateListingRow struct {
	ID               uuid.UUID        `json:"id"`
	OwnerID          uuid.UUID        `json:"owner_id"`
	PropertyType     PropertyTypeEnum `json:"property_type"`
	Price            string           `json:"price"`
	Currency         string           `json:"currency"`
	Address          string           `json:"address"`
	Latitude         float64          `json:"latitude"`
	Longitude        float64          `json:"longitude"`
	Photos           []string         `json:"photos"`
	Amenities        []string         `json:"amenities"`
	AvailabilityDate time.Time        `json:"availability_date"`
	Description      string           `json:"description"`
	Status           ListingStatusEnum`json:"status"`
	IsShared         sql.NullBool     `json:"is_shared"`
	HousemateCount   sql.NullInt32    `json:"housemate_count"`
	BedroomCount     sql.NullInt32    `json:"bedroom_count"`
	BathroomCount    sql.NullInt32    `json:"bathroom_count"`
	SelfContained    sql.NullBool     `json:"self_contained"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
}

func (q *Queries) UpdateListing(ctx context.Context, arg UpdateListingParams) (UpdateListingRow, error) {
	row := q.db.QueryRowContext(ctx, updateListing,
		arg.ID,
		arg.OwnerID,
		arg.PropertyType,
		arg.Price,
		arg.Currency,
		arg.Address,
		arg.Latitude,
		arg.Longitude,
		pq.Array(arg.Photos),
		pq.Array(arg.Amenities),
		arg.AvailabilityDate,
		arg.Description,
		arg.Status,
		arg.IsShared,
		arg.HousemateCount,
		arg.BedroomCount,
		arg.BathroomCount,
		arg.SelfContained,
	)
	var i UpdateListingRow
	err := row.Scan(
		&i.ID,
		&i.OwnerID,
		&i.PropertyType,
		&i.Price,
		&i.Currency,
		&i.Address,
		&i.Latitude,
		&i.Longitude,
		pq.Array(&i.Photos),
		pq.Array(&i.Amenities),
		&i.AvailabilityDate,
		&i.Description,
		&i.Status,
		&i.IsShared,
		&i.HousemateCount,
		&i.BedroomCount,
		&i.BathroomCount,
		&i.SelfContained,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const searchListings = `-- name: SearchListings :many
SELECT
    id, owner_id, property_type, price, currency, address,
    ST_Y(location::geometry)::float8 AS latitude,
    ST_X(location::geometry)::float8 AS longitude,
    photos, amenities, availability_date, description, status,
    is_shared, housemate_count, bedroom_count, bathroom_count, self_contained,
    created_at, updated_at,
    CASE
        WHEN $5::float8 IS NOT NULL AND $6::float8 IS NOT NULL THEN
            ST_Distance(
                location::geography,
                ST_SetSRID(ST_MakePoint($6::float8, $5::float8), 4326)::geography
            ) / 1000.0
        ELSE 0.0
    END::float8 AS distance_km
FROM listings
WHERE
    ($1::property_type_enum IS NULL OR property_type = $1::property_type_enum)
    AND ($2::numeric IS NULL OR price >= $2::numeric)
    AND ($3::numeric IS NULL OR price <= $3::numeric)
    AND ($4::listing_status_enum IS NULL OR status = $4::listing_status_enum)
    AND (
        $5::float8 IS NULL OR $6::float8 IS NULL OR $7::float8 IS NULL OR
        ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint($6::float8, $5::float8), 4326)::geography,
            ($7::float8 * 1000.0)
        )
    )
    AND ($8::text[] IS NULL OR amenities @> $8::text[])
ORDER BY created_at DESC
`

type SearchListingsParams struct {
	PropertyType NullPropertyTypeEnum `json:"property_type"`
	MinPrice     sql.NullString       `json:"min_price"`
	MaxPrice     sql.NullString       `json:"max_price"`
	Status       NullListingStatusEnum`json:"status"`
	Latitude     sql.NullFloat64      `json:"latitude"`
	Longitude    sql.NullFloat64      `json:"longitude"`
	RadiusKm     sql.NullFloat64      `json:"radius_km"`
	Amenities    []string             `json:"amenities"`
}

type SearchListingsRow struct {
	ID               uuid.UUID        `json:"id"`
	OwnerID          uuid.UUID        `json:"owner_id"`
	PropertyType     PropertyTypeEnum `json:"property_type"`
	Price            string           `json:"price"`
	Currency         string           `json:"currency"`
	Address          string           `json:"address"`
	Latitude         float64          `json:"latitude"`
	Longitude        float64          `json:"longitude"`
	Photos           []string         `json:"photos"`
	Amenities        []string         `json:"amenities"`
	AvailabilityDate time.Time        `json:"availability_date"`
	Description      string           `json:"description"`
	Status           ListingStatusEnum`json:"status"`
	IsShared         sql.NullBool     `json:"is_shared"`
	HousemateCount   sql.NullInt32    `json:"housemate_count"`
	BedroomCount     sql.NullInt32    `json:"bedroom_count"`
	BathroomCount    sql.NullInt32    `json:"bathroom_count"`
	SelfContained    sql.NullBool     `json:"self_contained"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
	DistanceKm       float64          `json:"distance_km"`
}

func (q *Queries) SearchListings(ctx context.Context, arg SearchListingsParams) ([]SearchListingsRow, error) {
	rows, err := q.db.QueryContext(ctx, searchListings,
		arg.PropertyType,
		arg.MinPrice,
		arg.MaxPrice,
		arg.Status,
		arg.Latitude,
		arg.Longitude,
		arg.RadiusKm,
		pq.Array(arg.Amenities),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []SearchListingsRow
	for rows.Next() {
		var i SearchListingsRow
		if err := rows.Scan(
			&i.ID,
			&i.OwnerID,
			&i.PropertyType,
			&i.Price,
			&i.Currency,
			&i.Address,
			&i.Latitude,
			&i.Longitude,
			pq.Array(&i.Photos),
			pq.Array(&i.Amenities),
			&i.AvailabilityDate,
			&i.Description,
			&i.Status,
			&i.IsShared,
			&i.HousemateCount,
			&i.BedroomCount,
			&i.BathroomCount,
			&i.SelfContained,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.DistanceKm,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
