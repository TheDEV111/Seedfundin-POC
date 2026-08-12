'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export const ApplicationsView = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <div className="flex-1 p-8 bg-white/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-[#2B2B26]">
          {role === 'landlord' ? 'Tenants & Leases' : 'My Applications'}
        </h1>
        
        {role === 'tenant' ? (
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Luxury 2-Bed Apartment</h3>
                  <p className="text-gray-500 text-sm">Status: Pending Landlord Review</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-olive-DEFAULT hover:underline">View Details</button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Cozy Master Suite</h3>
                  <p className="text-gray-500 text-sm">Status: Approved - Sign Lease</p>
                </div>
              </div>
              <button className="text-sm font-bold bg-olive-DEFAULT text-white px-4 py-2 rounded-lg">Sign Lease</button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">New Application for "Luxury 2-Bed Apartment"</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">New</span>
              </div>
              <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                <div className="h-10 w-10 bg-charcoal text-white rounded-full flex items-center justify-center font-bold">JD</div>
                <div className="flex-1">
                  <p className="font-semibold">Jane Doe</p>
                  <p className="text-xs text-gray-500">Verified Tenant • Credit Score: 720+</p>
                </div>
                <button className="text-sm font-bold bg-charcoal text-white px-4 py-2 rounded-lg">Review Applicant</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
