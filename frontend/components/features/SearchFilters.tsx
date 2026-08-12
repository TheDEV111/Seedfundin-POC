'use client';

import React from 'react';
import { Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import { Toggle } from '../ui/Toggle';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ListingFilter, PropertyType } from '@/lib/api-client';

export interface SearchFiltersProps {
  filter: ListingFilter;
  onChange: (newFilter: ListingFilter) => void;
  onSearch: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filter,
  onChange,
  onSearch,
}) => {
  const propertyType = filter.type || 'either';

  const handleTypeChange = (val: string) => {
    onChange({
      ...filter,
      type: val === 'either' ? undefined : (val as PropertyType),
    });
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2 font-bold text-sm text-[#2B2B26]">
          <SlidersHorizontal className="w-4 h-4 text-[#6B7A3A]" />
          Search & Radius Filters
        </div>
        <button
          onClick={() => onChange({})}
          className="text-xs font-semibold text-[#6B7A3A] hover:underline"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Property Type Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#2B2B26]">Property Type</label>
          <Toggle
            options={[
              { value: 'either', label: 'All Places' },
              { value: 'room', label: 'Rooms' },
              { value: 'apartment', label: 'Apartments' },
            ]}
            value={propertyType}
            onChange={handleTypeChange}
            className="w-full justify-between"
          />
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Min Price ($)"
            type="number"
            placeholder="0"
            value={filter.min_price || ''}
            onChange={(e) => onChange({ ...filter, min_price: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            label="Max Price ($)"
            type="number"
            placeholder="5000"
            value={filter.max_price || ''}
            onChange={(e) => onChange({ ...filter, max_price: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {/* Radius Search */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Radius (km)"
            type="number"
            placeholder="10"
            value={filter.radius_km || ''}
            onChange={(e) => onChange({ ...filter, radius_km: e.target.value ? Number(e.target.value) : undefined })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#2B2B26]">Amenities</label>
            <select
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#2B2B26]"
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                const existing = filter.amenities || [];
                if (!existing.includes(val)) {
                  onChange({ ...filter, amenities: [...existing, val] });
                }
              }}
            >
              <option value="">+ Add Amenity</option>
              <option value="wifi">Fast WiFi</option>
              <option value="air_conditioning">Air Conditioning</option>
              <option value="parking">Parking</option>
              <option value="laundry">In-unit Laundry</option>
              <option value="furnished">Furnished</option>
            </select>
          </div>
        </div>

        {/* Search Submit Button */}
        <div>
          <Button onClick={onSearch} className="w-full" size="md">
            <Filter className="w-4 h-4 mr-2" />
            Apply Search Filters
          </Button>
        </div>
      </div>

      {/* Selected Amenities Badges */}
      {filter.amenities && filter.amenities.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-gray-500 font-medium">Active Amenities:</span>
          {filter.amenities.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6B7A3A]/10 text-[#4A5A2A] text-xs font-semibold"
            >
              {item}
              <button
                onClick={() => onChange({ ...filter, amenities: filter.amenities?.filter((a) => a !== item) })}
                className="hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
