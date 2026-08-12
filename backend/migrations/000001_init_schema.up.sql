-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enums
CREATE TYPE account_type_enum AS ENUM ('landlord', 'tenant');
CREATE TYPE property_type_enum AS ENUM ('room', 'apartment');
CREATE TYPE listing_status_enum AS ENUM ('draft', 'live', 'filled', 'expired');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL DEFAULT '',
    email VARCHAR(255) UNIQUE NOT NULL,
    account_type account_type_enum NOT NULL DEFAULT 'tenant',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_type property_type_enum NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    address TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    photos TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    availability_date DATE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status listing_status_enum NOT NULL DEFAULT 'draft',
    -- room specific
    is_shared BOOLEAN,
    housemate_count INT,
    -- apartment specific
    bedroom_count INT,
    bathroom_count INT,
    self_contained BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for listings
CREATE INDEX idx_listings_location ON listings USING GIST (location);
CREATE INDEX idx_listings_owner_id ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_price ON listings(price);

-- Contact Events table for funnel analytics (contact reveal rate)
CREATE TABLE contact_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    revealed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_events_listing_tenant ON contact_events(listing_id, tenant_id);
