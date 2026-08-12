'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CheckCircle2, Bed, Bath, Users, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Listing } from '@/lib/api-client';

export interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const defaultImage = listing.property_type === 'room'
    ? 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';

  const photoUrl = listing.photos && listing.photos.length > 0 ? listing.photos[0] : defaultImage;

  return (
    <Link href={`/search/${listing.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] rounded-xl">
      <Card hoverable className="h-full flex flex-col group">
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full bg-[#F7F7F2] overflow-hidden">
          <Image
            src={photoUrl}
            alt={listing.address}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="olive">
              {listing.property_type === 'room' ? 'Single Room' : 'Full Apartment'}
            </Badge>
            {listing.is_shared && (
              <Badge variant="muted">Shared</Badge>
            )}
          </div>
          {listing.distance_km !== undefined && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {listing.distance_km.toFixed(1)} km away
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-xl font-extrabold text-[#6B7A3A]">
                ${listing.price.toLocaleString()}
                <span className="text-xs font-normal text-gray-500"> / month</span>
              </span>
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6B7A3A]" />
                Verified
              </Badge>
            </div>

            <p className="text-sm font-semibold text-[#2B2B26] line-clamp-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6B7A3A] shrink-0" />
              {listing.address}
            </p>
          </div>

          {/* Property Specific Meta */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 pt-2 border-t border-[#E2E8F0]">
            {listing.property_type === 'apartment' ? (
              <>
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-[#6B7A3A]" />
                  {listing.bedroom_count || 1} Bed
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4 text-[#6B7A3A]" />
                  {listing.bathroom_count || 1} Bath
                </span>
                {listing.self_contained && (
                  <span className="flex items-center gap-1 text-[#6B7A3A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Self-Contained
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#6B7A3A]" />
                  {listing.housemate_count ? `${listing.housemate_count} Housemates` : 'Private Room'}
                </span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
