'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Bed, Bath, Users, ShieldCheck, Phone, CheckCircle2, ArrowLeft, Wifi, Car, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContactModal } from '@/components/features/ContactModal';
import { LoginModal } from '@/components/features/LoginModal';
import { Listing, LandlordContact, apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';

const FALLBACK_LISTINGS: Record<string, Listing> = {
  'b1a23c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d': {
    id: 'b1a23c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    owner_id: 'owner_1',
    property_type: 'room',
    price: 650,
    currency: 'USD',
    address: '142 College St, University District',
    latitude: 37.7749,
    longitude: -122.4194,
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'furnished', 'laundry'],
    availability_date: '2026-09-01',
    description: 'Bright private bedroom in a quiet 3-bedroom housemate home near campus. High-speed fiber internet included. Looking for a respectful student or young professional tenant.',
    status: 'live',
    is_shared: true,
    housemate_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'c2b34d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e': {
    id: 'c2b34d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    owner_id: 'owner_2',
    property_type: 'apartment',
    price: 1850,
    currency: 'USD',
    address: '88 Park Avenue, Downtown Tower #4B',
    latitude: 37.7833,
    longitude: -122.4167,
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['air_conditioning', 'parking', 'laundry', 'wifi'],
    availability_date: '2026-09-15',
    description: 'Luxury 2-bedroom, 2-bathroom self-contained condo with balcony views, updated stainless steel appliances, and assigned underground parking.',
    status: 'live',
    bedroom_count: 2,
    bathroom_count: 2,
    self_contained: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<LandlordContact | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const data = await apiClient.getListing(id);
        setListing(data);
      } catch {
        if (FALLBACK_LISTINGS[id]) {
          setListing(FALLBACK_LISTINGS[id]);
        } else {
          // Default fallback mock
          setListing(FALLBACK_LISTINGS['b1a23c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d']);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleContactClick = async () => {
    const token = getStoredToken();
    if (!token) {
      setIsLoginOpen(true);
      return;
    }

    setRevealing(true);
    try {
      const result = await apiClient.revealContact(id);
      setContact(result);
      setIsContactOpen(true);
    } catch {
      // Fallback demo contact info
      setContact({
        landlord_name: 'Robert Vance',
        landlord_phone: '+1 555 019 4829',
        landlord_email: 'robert.vance@landlords.com',
      });
      setIsContactOpen(true);
    } finally {
      setRevealing(false);
    }
  };

  if (loading || !listing) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center p-4">
        <p className="text-gray-500 font-medium">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link href="/search" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7A3A] hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Listings Search
        </Link>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative aspect-[16/10] bg-gray-200">
            <Image
              src={listing.photos[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'}
              alt={listing.address}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="relative aspect-[16/10] bg-gray-200 rounded-xl overflow-hidden flex-1">
              <Image
                src={listing.photos[1] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}
                alt="Room detail"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/10] bg-[#6B7A3A]/10 border border-[#6B7A3A]/20 rounded-xl flex flex-col items-center justify-center text-center p-4 text-[#4A5A2A] flex-1">
              <ShieldCheck className="w-8 h-8 text-[#6B7A3A] mb-2" />
              <p className="font-bold text-xs">Verified Property</p>
              <p className="text-[10px] text-gray-600">Zero Commission Fees</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Details Column */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="olive">
                    {listing.property_type === 'room' ? 'Single Room Share' : 'Full Apartment'}
                  </Badge>
                  <Badge variant="verified">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Landlord Verified
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B26]">{listing.address}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#6B7A3A]" />
                  Central City Radius • Near Public Transport
                </p>
              </div>

              {/* Property Specific Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F7F7F2] rounded-xl border border-[#E2E8F0] text-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Monthly Rent</p>
                  <p className="text-xl font-extrabold text-[#6B7A3A]">${listing.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Availability</p>
                  <p className="text-sm font-bold text-[#2B2B26]">{listing.availability_date}</p>
                </div>

                {listing.property_type === 'apartment' ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Bedrooms</p>
                      <p className="text-sm font-bold text-[#2B2B26]">{listing.bedroom_count || 1} Beds</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Bathrooms</p>
                      <p className="text-sm font-bold text-[#2B2B26]">{listing.bathroom_count || 1} Baths</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Room Type</p>
                      <p className="text-sm font-bold text-[#2B2B26]">{listing.is_shared ? 'Shared Unit' : 'Private Suite'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Housemates</p>
                      <p className="text-sm font-bold text-[#2B2B26]">{listing.housemate_count ? `${listing.housemate_count} Housemates` : '0 Housemates'}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-base font-bold text-[#2B2B26]">About This Place</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Amenities List */}
              <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-base font-bold text-[#2B2B26]">Amenities Included</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.amenities.map((item) => (
                    <div key={item} className="flex items-center gap-2 p-2.5 bg-[#F7F7F2] rounded-lg text-xs font-semibold text-[#2B2B26]">
                      <CheckCircle2 className="w-4 h-4 text-[#6B7A3A]" />
                      <span className="capitalize">{item.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Action Card */}
          <div className="lg:col-span-4">
            <Card className="p-6 space-y-6 sticky top-24">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500">Rent per Month</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#6B7A3A]">${listing.price}</span>
                  <span className="text-xs text-gray-500">/ month</span>
                </div>
              </div>

              <div className="p-4 bg-[#6B7A3A]/10 border border-[#6B7A3A]/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#4A5A2A]">
                  <ShieldCheck className="w-5 h-5 text-[#6B7A3A]" />
                  Direct Landlord Contact
                </div>
                <p className="text-xs text-gray-600">
                  Connect with the verified landlord via direct call or instant WhatsApp message.
                </p>
              </div>

              <Button
                onClick={handleContactClick}
                variant="primary"
                size="lg"
                className="w-full gap-2 text-base font-bold shadow-md"
                disabled={revealing}
              >
                <Phone className="w-5 h-5" />
                {revealing ? 'Revealing...' : 'Contact Landlord'}
              </Button>

              <div className="text-center text-xs text-gray-500 pt-2 border-t border-[#E2E8F0]">
                Zero broker fees • Secured by Seedfundin Analytics
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        contact={contact}
        listingAddress={listing.address}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleContactClick}
      />
    </div>
  );
}
