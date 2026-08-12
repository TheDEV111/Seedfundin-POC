'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Home, ShieldCheck, PhoneCall, CheckCircle, ArrowRight, Building, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative py-16 lg:py-24 bg-[#F7F7F2] border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6B7A3A]/10 border border-[#6B7A3A]/20">
                <ShieldCheck className="w-4 h-4 text-[#6B7A3A]" />
                <span className="text-xs font-bold text-[#4A5A2A]">Direct Landlord Marketplace • Verified Contacts</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2B2B26] leading-[1.15]">
                Rent <span className="text-[#6B7A3A]">Shared Rooms</span> or <span className="text-[#4A5A2A]">Full Apartments</span> Directly.
              </h1>

              <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                Connect directly with verified landlords without middleman markup fees. Browse curated single rooms and full self-contained apartments with transparent pricing.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/signup?type=tenant">
                  <Button variant="primary" size="lg" className="gap-2 shadow-md">
                    <Search className="w-5 h-5" />
                    Find a Place
                  </Button>
                </Link>
                <Link href="/signup?type=landlord">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Home className="w-5 h-5" />
                    List a Place
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-600 border-t border-[#E2E8F0]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A]" />
                  Zero Broker Markup
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A]" />
                  Verified Identity Badges
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A]" />
                  PostGIS Location Search
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <Card className="p-3 shadow-lg bg-white relative z-10">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
                    alt="Modern apartment interior"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#6B7A3A] flex items-center gap-1.5 shadow-sm">
                    <Building className="w-4 h-4" />
                    Featured Listing
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md text-white p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Sunlit Bedroom in Downtown</p>
                        <p className="text-xs text-gray-300">$850 / month • Shared Bath</p>
                      </div>
                      <Badge variant="verified">Verified</Badge>
                    </div>
                  </div>
                </div>
              </Card>
              {/* Decorative Background Blob */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#A8B589]/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* DUAL VALUE PROP SECTION */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-[#2B2B26] tracking-tight">
              Designed for Both Sides of the Rental Market
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Whether you are looking for an affordable room share or listing a multi-family apartment building, Seedfundin streamlines connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Tenants */}
            <Card className="p-8 space-y-6 hover:border-[#6B7A3A] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#6B7A3A]/10 flex items-center justify-center text-[#6B7A3A]">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2B2B26]">For Tenants</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Browse room shares and apartments by exact radius, price, and amenities without login barriers.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-[#2B2B26]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A] shrink-0 mt-0.5" />
                  <span><strong>Radius-based location search</strong> to find rentals near your university or job.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A] shrink-0 mt-0.5" />
                  <span><strong>One-click WhatsApp contact reveal</strong> with direct pre-filled messages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A] shrink-0 mt-0.5" />
                  <span><strong>Roommate & housemate counts</strong> clearly detailed upfront.</span>
                </li>
              </ul>

              <Link href="/search" className="block pt-2">
                <Button variant="outline" className="w-full justify-between">
                  Start Browsing Listings
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>

            {/* For Landlords */}
            <Card className="p-8 space-y-6 hover:border-[#6B7A3A] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#4A5A2A]/10 flex items-center justify-center text-[#4A5A2A]">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2B2B26]">For Landlords</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Fill vacant rooms and apartments quickly with high-intent, verified tenant leads.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-[#2B2B26]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A] shrink-0 mt-0.5" />
                  <span><strong>Free property publishing</strong> for both single rooms and full apartments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A] shrink-0 mt-0.5" />
                  <span><strong>Verified Landlord Badge</strong> increases tenant trust and inquiry rate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6B7A3A] shrink-0 mt-0.5" />
                  <span><strong>Analytics funnel tracking</strong> on contact reveal rates.</span>
                </li>
              </ul>

              <Link href="/signup?type=landlord" className="block pt-2">
                <Button variant="primary" className="w-full justify-between">
                  Post Your Listing
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-[#F7F7F2] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#2B2B26]">How Seedfundin Works</h2>
            <p className="text-gray-600 mt-2 text-sm">Three simple steps to secure your next room or tenant.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#6B7A3A] text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="font-bold text-lg text-[#2B2B26]">Sign Up in Seconds</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Create a free account as a tenant or landlord with passwordless OTP verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#6B7A3A] text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="font-bold text-lg text-[#2B2B26]">Search or List Places</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filter by PostGIS radius, room vs apartment type, price, and amenities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#6B7A3A] text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="font-bold text-lg text-[#2B2B26]">Connect Directly</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Reveal verified landlord contact details and start chatting directly on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS SECTION */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#6B7A3A]/5 border border-[#6B7A3A]/20 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-3 text-center md:text-left">
              <Badge variant="verified">Marketplace Trust Floor</Badge>
              <h3 className="text-2xl font-bold text-[#2B2B26]">Verified Profiles & Listing Reporting</h3>
              <p className="text-sm text-gray-600 max-w-xl">
                We enforce rate-limited contact reveals and require verified user identities to eliminate spam, fake listings, and broker fees.
              </p>
            </div>
            <Link href="/search">
              <Button variant="primary" size="lg" className="whitespace-nowrap">
                Explore Verified Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECONDARY CTA FOOTER BAND */}
      <section className="py-16 bg-[#4A5A2A] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Find or List Your Room?</h2>
          <p className="text-sm text-gray-200">
            Join hundreds of tenants and landlords connecting directly today.
          </p>
          <div>
            <Link href="/signup">
              <Button variant="secondary" size="lg" className="px-8 font-bold">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
