-- Seed file for local development
-- Insert dummy landlord auth user (needed if they login, but not strictly required for public API)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'landlord@example.com', 'dummy', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert dummy landlord into our public.users table
INSERT INTO public.users (supabase_id, name, phone, email, account_type, verified)
VALUES
('00000000-0000-0000-0000-000000000001', 'John Landlord', '+2348012345678', 'landlord@example.com', 'landlord', true)
ON CONFLICT (email) DO NOTHING;

-- Insert the 3 original mock properties
INSERT INTO public.listings (
  owner_id, property_type, price, currency, address, location, 
  photos, amenities, availability_date, description, status,
  is_shared, housemate_count, bedroom_count, bathroom_count, self_contained
)
SELECT 
  id, 'apartment'::property_type_enum, 250000, 'NGN', 'Yaba, Lagos', ST_SetSRID(ST_MakePoint(3.3792, 6.5244), 4326),
  ARRAY['/mock-prop-1.jpg'], ARRAY['WiFi', 'AC', 'Backup Generator'], CURRENT_DATE, 'Beautiful, naturally lit 2-bedroom apartment in the heart of Yaba. Perfect for young professionals.', 'live'::listing_status_enum,
  false, 0, 2, 2, true
FROM public.users WHERE email = 'landlord@example.com'
UNION ALL
SELECT 
  id, 'room'::property_type_enum, 120000, 'NGN', 'Akoka, Lagos', ST_SetSRID(ST_MakePoint(3.3892, 6.5344), 4326),
  ARRAY['/mock-prop-2.jpg'], ARRAY['Shared Kitchen', 'Wardrobe'], CURRENT_DATE, 'Spacious ensuite room in a shared student flat near UNILAG. Quiet environment.', 'live'::listing_status_enum,
  true, 3, 1, 1, false
FROM public.users WHERE email = 'landlord@example.com'
UNION ALL
SELECT 
  id, 'apartment'::property_type_enum, 450000, 'NGN', 'Surulere, Lagos', ST_SetSRID(ST_MakePoint(3.3592, 6.4944), 4326),
  ARRAY['/mock-prop-3.jpg'], ARRAY['Parking', 'Security', 'Fenced'], CURRENT_DATE, 'Highly secure mini flat with ample parking space and steady power supply.', 'live'::listing_status_enum,
  false, 0, 1, 1, true
FROM public.users WHERE email = 'landlord@example.com';
