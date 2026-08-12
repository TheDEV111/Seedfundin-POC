'use client';

import React, { useState, useEffect } from 'react';
import { SearchFilters } from '@/components/features/SearchFilters';
import { ListingCard } from '@/components/features/ListingCard';
import { Listing, ListingFilter, apiClient } from '@/lib/api-client';

const DEMO_LISTINGS: Listing[] = [
  {
    id: 'b1a23c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    owner_id: 'owner_1',
    property_type: 'room',
    price: 650,
    currency: 'USD',
    address: '142 College St, University District',
    latitude: 37.7749,
    longitude: -122.4194,
    photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
    amenities: ['wifi', 'furnished', 'laundry'],
    availability_date: '2026-09-01',
    description: 'Bright private bedroom in a quiet 3-bedroom housemate home near campus. High-speed fiber internet included.',
    status: 'live',
    is_shared: true,
    housemate_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    distance_km: 1.2,
  },
  {
    id: 'c2b34d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    owner_id: 'owner_2',
    property_type: 'apartment',
    price: 1850,
    currency: 'USD',
    address: '88 Park Avenue, Downtown Tower #4B',
    latitude: 37.7833,
    longitude: -122.4167,
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    amenities: ['air_conditioning', 'parking', 'laundry', 'wifi'],
    availability_date: '2026-09-15',
    description: 'Luxury 2-bedroom, 2-bathroom self-contained condo with balcony views, updated stainless steel appliances.',
    status: 'live',
    bedroom_count: 2,
    bathroom_count: 2,
    self_contained: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    distance_km: 3.5,
  },
  {
    id: 'd3c45e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    owner_id: 'owner_3',
    property_type: 'room',
    price: 520,
    currency: 'USD',
    address: '504 Oakwood Lane, Westside',
    latitude: 37.769,
    longitude: -122.448,
    photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'],
    amenities: ['wifi', 'parking'],
    availability_date: '2026-08-20',
    description: 'Cozy master suite room with private entrance and dedicated driveway parking spot.',
    status: 'live',
    is_shared: true,
    housemate_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    distance_km: 4.8,
  },
  {
    id: 'e4d56f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    owner_id: 'owner_4',
    property_type: 'apartment',
    price: 1400,
    currency: 'USD',
    address: '312 Elm Boulevard, Garden Flats #2',
    latitude: 37.755,
    longitude: -122.422,
    photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    amenities: ['furnished', 'laundry'],
    availability_date: '2026-09-01',
    description: 'Spacious 1-bedroom flat with hardwood floors, private patio, and updated kitchen.',
    status: 'live',
    bedroom_count: 1,
    bathroom_count: 1,
    self_contained: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    distance_km: 2.1,
  },
];

const EXTENDED_DEMO_LISTINGS: Listing[] = [
  ...DEMO_LISTINGS,
  ...DEMO_LISTINGS.map(l => ({ ...l, id: l.id + '-2', address: l.address + ' (Unit 2)' })),
  ...DEMO_LISTINGS.map(l => ({ ...l, id: l.id + '-3', address: l.address + ' (Unit 3)' })),
];

import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const [filter, setFilter] = useState<ListingFilter>({});
  const [listings, setListings] = useState<Listing[]>(EXTENDED_DEMO_LISTINGS);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(listings.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentListings = listings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const fetchListings = async () => {
    setLoading(true);
    setCurrentPage(0); // Reset page on new search
    try {
      const data = await apiClient.getListings(filter);
      if (data.listings && data.listings.length > 0) {
        setListings(data.listings);
      } else {
        // Fallback filter over client side demo listings if backend has no records yet
        let filtered = [...EXTENDED_DEMO_LISTINGS];
        if (filter.type) {
          filtered = filtered.filter((l) => l.property_type === filter.type);
        }
        if (filter.min_price !== undefined) {
          filtered = filtered.filter((l) => l.price >= filter.min_price!);
        }
        if (filter.max_price !== undefined) {
          filtered = filtered.filter((l) => l.price <= filter.max_price!);
        }
        setListings(filtered);
      }
    } catch {
      // Client side filter fallback
      let filtered = [...EXTENDED_DEMO_LISTINGS];
      if (filter.type) {
        filtered = filtered.filter((l) => l.property_type === filter.type);
      }
      if (filter.min_price !== undefined) {
        filtered = filtered.filter((l) => l.price >= filter.min_price!);
      }
      if (filter.max_price !== undefined) {
        filtered = filtered.filter((l) => l.price <= filter.max_price!);
      }
      setListings(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filter.type]);

  return (
    <div className="flex-1 bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#2B2B26]">Marketplace</h1>
          <p className="text-sm text-gray-600">Browse verified listings or manage your saved properties.</p>
        </div>

        {/* Filter Bar */}
        <SearchFilters
          filter={filter}
          onChange={setFilter}
          onSearch={fetchListings}
        />

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
          <span>Showing <strong>{currentListings.length}</strong> of <strong>{listings.length}</strong> places</span>
          <span>Sorted by: <strong>Newest First</strong></span>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12 text-center text-gray-500">
            Loading listings...
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
            
            {/* React Paginate */}
            {pageCount > 1 && (
              <div className="mt-12 flex justify-center">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel={<ChevronRight className="w-5 h-5" />}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  pageCount={pageCount}
                  previousLabel={<ChevronLeft className="w-5 h-5" />}
                  renderOnZeroPageCount={null}
                  containerClassName="flex items-center gap-2"
                  pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  activeLinkClassName="bg-olive-DEFAULT text-white border-olive-DEFAULT hover:bg-olive-deep"
                  previousLinkClassName="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  nextLinkClassName="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
                  breakLinkClassName="w-10 h-10 flex items-center justify-center text-gray-500"
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-[#2B2B26]">No places match your search criteria</h3>
            <p className="text-xs text-gray-500">Try widening your price range or clearing amenity filters.</p>
            <button
              onClick={() => {
                setFilter({});
                setListings(EXTENDED_DEMO_LISTINGS);
              }}
              className="text-xs font-bold text-[#6B7A3A] underline"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
