import React from 'react';
import Link from 'next/link';
import { Home, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#E2E8F0]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#6B7A3A] flex items-center justify-center text-white font-bold">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#2B2B26]">
                Single<span className="text-[#6B7A3A]">Rent</span>
              </span>
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct room and apartment rentals. Verified landlords, zero commission markups, transparent connections.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#2B2B26] tracking-wider uppercase mb-3">For Tenants</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?type=room" className="text-gray-600 hover:text-[#6B7A3A] transition-colors">
                  Find Single Rooms
                </Link>
              </li>
              <li>
                <Link href="/search?type=apartment" className="text-gray-600 hover:text-[#6B7A3A] transition-colors">
                  Full Apartments
                </Link>
              </li>
              <li>
                <Link href="/signup?type=tenant" className="text-gray-600 hover:text-[#6B7A3A] transition-colors">
                  Create Tenant Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#2B2B26] tracking-wider uppercase mb-3">For Landlords</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings/new" className="text-gray-600 hover:text-[#6B7A3A] transition-colors">
                  Post a Property
                </Link>
              </li>
              <li>
                <Link href="/signup?type=landlord" className="text-gray-600 hover:text-[#6B7A3A] transition-colors">
                  Landlord Verification
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#2B2B26] tracking-wider uppercase mb-3">Trust & Safety</h4>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A5A2A]">
                <ShieldCheck className="w-4 h-4 text-[#6B7A3A]" />
                Direct Landlord Contact
              </div>
              <p className="text-xs text-gray-600">
                Every contact reveal is verified to maintain high trust and eliminate broker spam.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} SingleRent Marketplace Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#6B7A3A]">Privacy Policy</a>
            <a href="#" className="hover:text-[#6B7A3A]">Terms of Service</a>
            <a href="#" className="hover:text-[#6B7A3A]">Report Listing</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
