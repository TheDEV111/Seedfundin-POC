'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Home, MapPin, ExternalLink } from 'lucide-react';

export default function MyListingsPage() {
  return (
    <div className="flex-1 p-4 sm:p-8 bg-white/50">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B26]">My Listings</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your active and drafted properties.</p>
          </div>
          <Link href="/listings/new" className="w-full sm:w-auto bg-olive-DEFAULT text-white px-5 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-olive-deep transition-colors">
            <PlusCircle className="w-5 h-5" />
            Add New Property
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm group">
            <div className="h-48 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80" alt="Property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                Active
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-charcoal leading-tight">Luxury 2-Bed Apartment</h3>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" /> Lekki Phase 1, Lagos
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="font-black text-olive-DEFAULT">₦2.5m/yr</div>
                <button className="text-sm text-olive-deep font-semibold flex items-center gap-1 hover:underline">
                  Manage <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm group">
            <div className="h-48 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80" alt="Property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                Draft
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-charcoal leading-tight">Cozy Master Suite</h3>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" /> Yaba, Lagos
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="font-black text-olive-DEFAULT">₦800k/yr</div>
                <button className="text-sm text-olive-deep font-semibold flex items-center gap-1 hover:underline">
                  Edit <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
