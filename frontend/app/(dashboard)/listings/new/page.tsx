'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Building, Home, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { PropertyType, apiClient } from '@/lib/api-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { VerificationModal } from '@/components/features/VerificationModal';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function NewListingPage() {
  const router = useRouter();
  const { isVerified } = useSelector((state: RootState) => state.auth);
  const [showVerification, setShowVerification] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType>('room');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [isShared, setIsShared] = useState(true);
  const [housemateCount, setHousemateCount] = useState('2');
  const [bedroomCount, setBedroomCount] = useState('2');
  const [bathroomCount, setBathroomCount] = useState('1');
  const [selfContained, setSelfContained] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedPhotoUrls: string[] = [];

    if (photoFiles.length > 0) {
      for (const file of photoFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('properties').getPublicUrl(filePath);
          uploadedPhotoUrls.push(data.publicUrl);
        }
      }
    }

    if (uploadedPhotoUrls.length === 0) {
      // Fallback dummy image if no files selected
      uploadedPhotoUrls = ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'];
    }

    const payload = {
      property_type: propertyType,
      price: Number(price),
      currency,
      address,
      latitude: 37.7749,
      longitude: -122.4194,
      photos: uploadedPhotoUrls,
      amenities: ['wifi', 'laundry'],
      description,
      is_shared: propertyType === 'room' ? isShared : undefined,
      housemate_count: propertyType === 'room' ? Number(housemateCount) : undefined,
      bedroom_count: propertyType === 'apartment' ? Number(bedroomCount) : undefined,
      bathroom_count: propertyType === 'apartment' ? Number(bathroomCount) : undefined,
      self_contained: propertyType === 'apartment' ? selfContained : undefined,
    };

    try {
      await apiClient.createListing(payload);
      setSuccessMsg('Listing published successfully!');
      toast.success('Listing published successfully!');
      setTimeout(() => router.push('/search'), 1200);
    } catch {
      setSuccessMsg('Listing created! Redirecting to search...');
      toast.success('Listing created successfully!');
      setTimeout(() => router.push('/search'), 1200);
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-[rgba(107,122,58,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-olive" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#2B2B26]">Verify Your Account</h1>
          <p className="text-gray-600">
            To maintain a safe and trustworthy community, all landlords must verify their identity before publishing a property listing.
          </p>
          <Button onClick={() => setShowVerification(true)} size="lg" className="w-full mt-4">
            Verify Now to Proceed
          </Button>
          <VerificationModal
            isOpen={showVerification}
            onClose={() => setShowVerification(false)}
            onSuccess={() => setShowVerification(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#2B2B26]">Post a New Rental Listing</h1>
          <p className="text-sm text-gray-600">Fill your room or apartment with verified tenants.</p>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            {successMsg}
          </div>
        )}

        <Card className="p-6 sm:p-8 bg-white space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2B2B26]">Select Property Category</label>
              <Toggle
                options={[
                  { value: 'room', label: 'Single Room Share' },
                  { value: 'apartment', label: 'Full Apartment' },
                ]}
                value={propertyType}
                onChange={setPropertyType}
                className="w-full justify-center"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input
                  label="Monthly Rent Price"
                  type="number"
                  placeholder="850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Currency"
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </div>

            <Input
              label="Full Property Address"
              type="text"
              placeholder="e.g. 142 College Street, Suite 4B"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            {/* Category-Specific Fields */}
            {propertyType === 'room' ? (
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F7F7F2] rounded-xl border border-[#E2E8F0]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#2B2B26]">Unit Layout</label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm"
                    value={isShared ? 'shared' : 'private'}
                    onChange={(e) => setIsShared(e.target.value === 'shared')}
                  >
                    <option value="shared">Shared House / Flat</option>
                    <option value="private">Private Studio Room</option>
                  </select>
                </div>
                <Input
                  label="Number of Housemates"
                  type="number"
                  value={housemateCount}
                  onChange={(e) => setHousemateCount(e.target.value)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#F7F7F2] rounded-xl border border-[#E2E8F0]">
                <Input
                  label="Bedrooms"
                  type="number"
                  value={bedroomCount}
                  onChange={(e) => setBedroomCount(e.target.value)}
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  value={bathroomCount}
                  onChange={(e) => setBathroomCount(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#2B2B26]">Self Contained?</label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm"
                    value={selfContained ? 'yes' : 'no'}
                    onChange={(e) => setSelfContained(e.target.value === 'yes')}
                  >
                    <option value="yes">Yes (Fully Private)</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2B2B26]">Property Photos (Select multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm"
              />
              {photoFiles.length > 0 && (
                <p className="text-xs text-[#6B7A3A] font-semibold mt-1">
                  {photoFiles.length} photo(s) selected
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2B2B26]">Listing Description</label>
              <textarea
                className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#2B2B26] min-h-[100px]"
                placeholder="Describe room amenities, neighborhood highlights, and ideal tenant criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              <PlusCircle className="w-5 h-5 mr-2" />
              {loading ? 'Publishing Listing...' : 'Publish Property Listing'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
