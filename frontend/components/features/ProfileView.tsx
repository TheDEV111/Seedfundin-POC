'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ShieldCheck, User, MapPin, Building, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileView = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <div className="flex-1 p-4 sm:p-8 bg-white/50">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B26]">Profile & Verifications</h1>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold">Level 2 Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 bg-charcoal text-white rounded-full flex items-center justify-center text-3xl font-black shadow-lg mb-4">
                {role === 'landlord' ? 'L' : 'T'}
              </div>
              <h2 className="text-xl font-bold">Test User</h2>
              <p className="text-gray-500 capitalize">{role} Account</p>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="w-4 h-4" /> ID Verified
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4" /> Address Verified
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {role === 'tenant' ? (
              <>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard className="text-olive-DEFAULT" /> Tenant Profile</h3>
                  <p className="text-sm text-gray-600 mb-4">Your tenant profile is what landlords see when you apply for a property. A complete profile increases your chances of approval by 80%.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold">Employment History</p>
                        <p className="text-xs text-gray-500">Not provided</p>
                      </div>
                      <button onClick={() => toast.success('Employment history updated!')} className="text-sm text-olive-DEFAULT font-bold">Add</button>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold">Rental References</p>
                        <p className="text-xs text-gray-500">Not provided</p>
                      </div>
                      <button onClick={() => toast.success('Rental references updated!')} className="text-sm text-olive-DEFAULT font-bold">Add</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Building className="text-olive-DEFAULT" /> Landlord Verification</h3>
                  <p className="text-sm text-gray-600 mb-4">To list properties on Seedfundin, we require landlords to pass our strict KYC and property ownership verification.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                      <div>
                        <p className="font-semibold text-green-900">Government ID</p>
                        <p className="text-xs text-green-700">Verified on Aug 12, 2026</p>
                      </div>
                      <ShieldCheck className="text-green-600 w-5 h-5" />
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold">Property Deed / Proof of Ownership</p>
                        <p className="text-xs text-gray-500">Required for each listing</p>
                      </div>
                      <button onClick={() => toast.success('Document uploaded for verification!')} className="text-sm text-olive-DEFAULT font-bold">Upload</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
