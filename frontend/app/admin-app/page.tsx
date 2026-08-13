'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, EyeOff, Trash2, CheckCircle2, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/listings');
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      toast.success(`Listing status updated to ${status}`);
      fetchListings();
    } catch (e) {
      console.error(e);
      toast.error('Failed to update listing status');
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this listing?')) return;
    try {
      await fetch(`/api/admin/listings/${id}`, {
        method: 'DELETE',
      });
      toast.success('Listing permanently deleted');
      fetchListings();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    const matchesSearch = listing.address?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B26]">Moderation Center</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-md">
            Review and moderate marketplace listings to ensure safety and compliance with Seedfundin guidelines.
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search address or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-olive-DEFAULT"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto hide-scrollbar">
        <Filter className="w-4 h-4 text-gray-400 mr-2" />
        {['all', 'live', 'draft', 'filled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${
              filterStatus === status 
                ? 'bg-charcoal text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-DEFAULT"></div>
          <p className="text-sm text-gray-500 font-medium">Loading network data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No listings match your criteria.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Property</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListings.map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {listing.photos && listing.photos[0] ? (
                                <img src={listing.photos[0]} alt="Property" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-200" />
                              )}
                            </div>
                            <div className="max-w-[200px] sm:max-w-[300px]">
                              <p className="font-bold text-charcoal truncate">{listing.address}</p>
                              <p className="text-xs text-gray-500 capitalize mt-0.5">{listing.property_type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-charcoal">
                          {listing.currency} {Number(listing.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            listing.status === 'live' ? 'bg-green-100 text-green-700' :
                            listing.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {listing.status !== 'live' && (
                              <button 
                                onClick={() => updateStatus(listing.id, 'live')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors group relative"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Approve</span>
                              </button>
                            )}
                            {listing.status === 'live' && (
                              <button 
                                onClick={() => updateStatus(listing.id, 'draft')}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors group relative"
                              >
                                <EyeOff className="w-4 h-4" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Hide</span>
                              </button>
                            )}
                            <button 
                              onClick={() => deleteListing(listing.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group relative"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
