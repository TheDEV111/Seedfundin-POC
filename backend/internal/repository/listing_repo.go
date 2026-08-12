package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/repository/db"
)

type ListingRepo struct {
	q *db.Queries
}

func NewListingRepository(queries *db.Queries) domain.ListingRepository {
	return &ListingRepo{q: queries}
}

func (r *ListingRepo) Create(ctx context.Context, l *domain.Listing) (*domain.Listing, error) {
	var isShared sql.NullBool
	if l.IsShared != nil {
		isShared = sql.NullBool{Bool: *l.IsShared, Valid: true}
	}
	var housemateCount sql.NullInt32
	if l.HousemateCount != nil {
		housemateCount = sql.NullInt32{Int32: int32(*l.HousemateCount), Valid: true}
	}
	var bedroomCount sql.NullInt32
	if l.BedroomCount != nil {
		bedroomCount = sql.NullInt32{Int32: int32(*l.BedroomCount), Valid: true}
	}
	var bathroomCount sql.NullInt32
	if l.BathroomCount != nil {
		bathroomCount = sql.NullInt32{Int32: int32(*l.BathroomCount), Valid: true}
	}
	var selfContained sql.NullBool
	if l.SelfContained != nil {
		selfContained = sql.NullBool{Bool: *l.SelfContained, Valid: true}
	}

	priceStr := fmt.Sprintf("%.2f", l.Price)

	row, err := r.q.CreateListing(ctx, db.CreateListingParams{
		OwnerID:          l.OwnerID,
		PropertyType:     db.PropertyTypeEnum(l.PropertyType),
		Price:            priceStr,
		Currency:         l.Currency,
		Address:          l.Address,
		Column6:          l.Longitude,
		Column7:          l.Latitude,
		Photos:           l.Photos,
		Amenities:        l.Amenities,
		AvailabilityDate: l.AvailabilityDate,
		Description:      l.Description,
		Status:           db.ListingStatusEnum(l.Status),
		IsShared:         isShared,
		HousemateCount:   housemateCount,
		BedroomCount:     bedroomCount,
		BathroomCount:    bathroomCount,
		SelfContained:    selfContained,
	})
	if err != nil {
		return nil, err
	}

	return mapCreateRowToDomain(row), nil
}

func (r *ListingRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Listing, error) {
	row, err := r.q.GetListingByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return mapGetByIDRowToDomain(row), nil
}

func (r *ListingRepo) Update(ctx context.Context, l *domain.Listing) (*domain.Listing, error) {
	var propType db.NullPropertyTypeEnum
	if l.PropertyType != "" {
		propType = db.NullPropertyTypeEnum{PropertyTypeEnum: db.PropertyTypeEnum(l.PropertyType), Valid: true}
	}
	var priceStr sql.NullString
	if l.Price > 0 {
		priceStr = sql.NullString{String: fmt.Sprintf("%.2f", l.Price), Valid: true}
	}
	var status db.NullListingStatusEnum
	if l.Status != "" {
		status = db.NullListingStatusEnum{ListingStatusEnum: db.ListingStatusEnum(l.Status), Valid: true}
	}
	var isShared sql.NullBool
	if l.IsShared != nil {
		isShared = sql.NullBool{Bool: *l.IsShared, Valid: true}
	}
	var housemateCount sql.NullInt32
	if l.HousemateCount != nil {
		housemateCount = sql.NullInt32{Int32: int32(*l.HousemateCount), Valid: true}
	}
	var bedroomCount sql.NullInt32
	if l.BedroomCount != nil {
		bedroomCount = sql.NullInt32{Int32: int32(*l.BedroomCount), Valid: true}
	}
	var bathroomCount sql.NullInt32
	if l.BathroomCount != nil {
		bathroomCount = sql.NullInt32{Int32: int32(*l.BathroomCount), Valid: true}
	}
	var selfContained sql.NullBool
	if l.SelfContained != nil {
		selfContained = sql.NullBool{Bool: *l.SelfContained, Valid: true}
	}

	var lat sql.NullFloat64
	if l.Latitude != 0 {
		lat = sql.NullFloat64{Float64: l.Latitude, Valid: true}
	}
	var lng sql.NullFloat64
	if l.Longitude != 0 {
		lng = sql.NullFloat64{Float64: l.Longitude, Valid: true}
	}

	var availDate pq.NullTime
	if !l.AvailabilityDate.IsZero() {
		availDate = pq.NullTime{Time: l.AvailabilityDate, Valid: true}
	}

	row, err := r.q.UpdateListing(ctx, db.UpdateListingParams{
		ID:               l.ID,
		OwnerID:          l.OwnerID,
		PropertyType:     propType,
		Price:            priceStr,
		Currency:         sql.NullString{String: l.Currency, Valid: l.Currency != ""},
		Address:          sql.NullString{String: l.Address, Valid: l.Address != ""},
		Latitude:         lat,
		Longitude:        lng,
		Photos:           l.Photos,
		Amenities:        l.Amenities,
		AvailabilityDate: availDate,
		Description:      sql.NullString{String: l.Description, Valid: l.Description != ""},
		Status:           status,
		IsShared:         isShared,
		HousemateCount:   housemateCount,
		BedroomCount:     bedroomCount,
		BathroomCount:    bathroomCount,
		SelfContained:    selfContained,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}

	return mapUpdateRowToDomain(row), nil
}

func (r *ListingRepo) Search(ctx context.Context, filter domain.ListingFilter) ([]*domain.Listing, error) {
	var propType db.NullPropertyTypeEnum
	if filter.PropertyType != nil {
		propType = db.NullPropertyTypeEnum{PropertyTypeEnum: db.PropertyTypeEnum(*filter.PropertyType), Valid: true}
	}
	var minPrice sql.NullString
	if filter.MinPrice != nil {
		minPrice = sql.NullString{String: fmt.Sprintf("%.2f", *filter.MinPrice), Valid: true}
	}
	var maxPrice sql.NullString
	if filter.MaxPrice != nil {
		maxPrice = sql.NullString{String: fmt.Sprintf("%.2f", *filter.MaxPrice), Valid: true}
	}
	var status db.NullListingStatusEnum
	if filter.Status != nil {
		status = db.NullListingStatusEnum{ListingStatusEnum: db.ListingStatusEnum(*filter.Status), Valid: true}
	} else {
		// Default search to live listings if not specified
		status = db.NullListingStatusEnum{ListingStatusEnum: db.ListingStatusEnumLive, Valid: true}
	}

	var lat, lng, radiusKM sql.NullFloat64
	if filter.Latitude != nil {
		lat = sql.NullFloat64{Float64: *filter.Latitude, Valid: true}
	}
	if filter.Longitude != nil {
		lng = sql.NullFloat64{Float64: *filter.Longitude, Valid: true}
	}
	if filter.RadiusKM != nil {
		radiusKM = sql.NullFloat64{Float64: *filter.RadiusKM, Valid: true}
	}

	params := db.SearchListingsParams{
		PropertyType: propType,
		MinPrice:     minPrice,
		MaxPrice:     maxPrice,
		Status:       status,
		Latitude:     lat,
		Longitude:    lng,
		RadiusKm:     radiusKM,
		Amenities:    filter.Amenities,
	}
	if params.Amenities == nil {
		params.Amenities = []string{}
	}

	rows, err := r.q.SearchListings(ctx, params)
	if err != nil {
		return nil, err
	}

	listings := make([]*domain.Listing, len(rows))
	for i, row := range rows {
		listings[i] = mapSearchRowToDomain(row)
	}

	return listings, nil
}

// Helpers to map sqlc generated rows to domain models

func parsePrice(priceStr string) float64 {
	var val float64
	fmt.Sscanf(priceStr, "%f", &val)
	return val
}

func mapCreateRowToDomain(row db.CreateListingRow) *domain.Listing {
	l := &domain.Listing{
		ID:               row.ID,
		OwnerID:          row.OwnerID,
		PropertyType:     domain.PropertyType(row.PropertyType),
		Price:            parsePrice(row.Price),
		Currency:         row.Currency,
		Address:          row.Address,
		Latitude:         row.Latitude,
		Longitude:        row.Longitude,
		Photos:           row.Photos,
		Amenities:        row.Amenities,
		AvailabilityDate: row.AvailabilityDate,
		Description:      row.Description,
		Status:           domain.ListingStatus(row.Status),
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
	}

	if row.IsShared.Valid {
		b := row.IsShared.Bool
		l.IsShared = &b
	}
	if row.HousemateCount.Valid {
		n := int(row.HousemateCount.Int32)
		l.HousemateCount = &n
	}
	if row.BedroomCount.Valid {
		n := int(row.BedroomCount.Int32)
		l.BedroomCount = &n
	}
	if row.BathroomCount.Valid {
		n := int(row.BathroomCount.Int32)
		l.BathroomCount = &n
	}
	if row.SelfContained.Valid {
		b := row.SelfContained.Bool
		l.SelfContained = &b
	}

	return l
}

func mapGetByIDRowToDomain(row db.GetListingByIDRow) *domain.Listing {
	l := &domain.Listing{
		ID:               row.ID,
		OwnerID:          row.OwnerID,
		PropertyType:     domain.PropertyType(row.PropertyType),
		Price:            parsePrice(row.Price),
		Currency:         row.Currency,
		Address:          row.Address,
		Latitude:         row.Latitude,
		Longitude:        row.Longitude,
		Photos:           row.Photos,
		Amenities:        row.Amenities,
		AvailabilityDate: row.AvailabilityDate,
		Description:      row.Description,
		Status:           domain.ListingStatus(row.Status),
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
	}

	if row.IsShared.Valid {
		b := row.IsShared.Bool
		l.IsShared = &b
	}
	if row.HousemateCount.Valid {
		n := int(row.HousemateCount.Int32)
		l.HousemateCount = &n
	}
	if row.BedroomCount.Valid {
		n := int(row.BedroomCount.Int32)
		l.BedroomCount = &n
	}
	if row.BathroomCount.Valid {
		n := int(row.BathroomCount.Int32)
		l.BathroomCount = &n
	}
	if row.SelfContained.Valid {
		b := row.SelfContained.Bool
		l.SelfContained = &b
	}

	return l
}

func mapUpdateRowToDomain(row db.UpdateListingRow) *domain.Listing {
	l := &domain.Listing{
		ID:               row.ID,
		OwnerID:          row.OwnerID,
		PropertyType:     domain.PropertyType(row.PropertyType),
		Price:            parsePrice(row.Price),
		Currency:         row.Currency,
		Address:          row.Address,
		Latitude:         row.Latitude,
		Longitude:        row.Longitude,
		Photos:           row.Photos,
		Amenities:        row.Amenities,
		AvailabilityDate: row.AvailabilityDate,
		Description:      row.Description,
		Status:           domain.ListingStatus(row.Status),
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
	}

	if row.IsShared.Valid {
		b := row.IsShared.Bool
		l.IsShared = &b
	}
	if row.HousemateCount.Valid {
		n := int(row.HousemateCount.Int32)
		l.HousemateCount = &n
	}
	if row.BedroomCount.Valid {
		n := int(row.BedroomCount.Int32)
		l.BedroomCount = &n
	}
	if row.BathroomCount.Valid {
		n := int(row.BathroomCount.Int32)
		l.BathroomCount = &n
	}
	if row.SelfContained.Valid {
		b := row.SelfContained.Bool
		l.SelfContained = &b
	}

	return l
}

func mapSearchRowToDomain(row db.SearchListingsRow) *domain.Listing {
	l := &domain.Listing{
		ID:               row.ID,
		OwnerID:          row.OwnerID,
		PropertyType:     domain.PropertyType(row.PropertyType),
		Price:            parsePrice(row.Price),
		Currency:         row.Currency,
		Address:          row.Address,
		Latitude:         row.Latitude,
		Longitude:        row.Longitude,
		Photos:           row.Photos,
		Amenities:        row.Amenities,
		AvailabilityDate: row.AvailabilityDate,
		Description:      row.Description,
		Status:           domain.ListingStatus(row.Status),
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
		DistanceKM:       &row.DistanceKm,
	}

	if row.IsShared.Valid {
		b := row.IsShared.Bool
		l.IsShared = &b
	}
	if row.HousemateCount.Valid {
		n := int(row.HousemateCount.Int32)
		l.HousemateCount = &n
	}
	if row.BedroomCount.Valid {
		n := int(row.BedroomCount.Int32)
		l.BedroomCount = &n
	}
	if row.BathroomCount.Valid {
		n := int(row.BathroomCount.Int32)
		l.BathroomCount = &n
	}
	if row.SelfContained.Valid {
		b := row.SelfContained.Bool
		l.SelfContained = &b
	}

	return l
}
