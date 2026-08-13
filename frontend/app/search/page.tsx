'use client';

import React, { useState, useEffect } from 'react';
import { SearchFilters } from '@/components/features/SearchFilters';
import { ListingCard } from '@/components/features/ListingCard';
import { Listing, ListingFilter, apiClient } from '@/lib/api-client';
import posthog from 'posthog-js';

export default function SearchPage() {
  const [filter, setFilter] = useState<ListingFilter>({});
  const [listings, setListings] = useState<Listing[]>([]);
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
        setListings([]);
      }
      
      // Track search event
      posthog.capture('tenant_search', {
        type: filter.type,
        min_price: filter.min_price,
        max_price: filter.max_price,
        results_count: data.listings ? data.listings.length : 0,
      });
    } catch {
      setListings([]);
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
                fetchListings();
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
