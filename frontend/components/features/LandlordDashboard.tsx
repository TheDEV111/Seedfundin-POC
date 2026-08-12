'use client';

import React from 'react';
import { Home, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LandlordDashboard = () => {
  return (
    <div className="flex-1 p-8 bg-white/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2B2B26]">Landlord Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your properties and tenant applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Active Listings</p>
                <h3 className="text-3xl font-black text-charcoal">3</h3>
              </div>
              <div className="bg-olive-DEFAULT/10 p-3 rounded-xl text-olive-deep">
                <Home className="w-6 h-6" />
              </div>
            </div>
            <Link href="/listings" className="text-xs font-bold text-olive-DEFAULT flex items-center mt-4 group">
              Manage listings <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Tenants</p>
                <h3 className="text-3xl font-black text-charcoal">8</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <Link href="/applications" className="text-xs font-bold text-blue-600 flex items-center mt-4 group">
              View tenants <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Monthly Revenue</p>
                <h3 className="text-3xl font-black text-charcoal">₦1.2m</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="text-xs font-bold text-green-600 flex items-center mt-4">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% from last month
            </div>
          </div>
          
          <div className="bg-charcoal p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center text-white cursor-pointer hover:bg-olive-deep transition-colors">
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Add New Property</h3>
            <p className="text-xs text-gray-400 mt-1">List a room or apartment</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg">Recent Applications</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">JD</div>
                <div>
                  <p className="font-bold text-charcoal">John Doe</p>
                  <p className="text-xs text-gray-500">Applied for: Luxury 2-Bed Apartment</p>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">Pending Review</span>
            </div>
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">AS</div>
                <div>
                  <p className="font-bold text-charcoal">Alice Smith</p>
                  <p className="text-xs text-gray-500">Applied for: Cozy Master Suite</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
