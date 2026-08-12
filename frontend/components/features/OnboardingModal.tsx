'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Home, Search } from 'lucide-react';
import { AccountType } from '@/lib/api-client';
import { useDispatch } from 'react-redux';
import { setUserRole } from '@/lib/features/authSlice';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (type: AccountType) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleContinue = () => {
    if (!selectedType) return;
    setLoading(true);
    // Simulate API call to update user profile
    setTimeout(() => {
      setLoading(false);
      dispatch(setUserRole(selectedType));
      onComplete(selectedType);
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Seedfundin">
      <div className="space-y-6">
        <p className="text-[#2B2B26] text-center text-sm mb-6">
          How would you like to use the platform?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedType('tenant')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
              selectedType === 'tenant'
                ? 'border-[#6B7A3A] bg-olive-DEFAULT/5 shadow-md'
                : 'border-[#E2E8F0] hover:border-[#6B7A3A]/50 bg-white'
            }`}
          >
            <div className={`p-4 rounded-full ${selectedType === 'tenant' ? 'bg-[#6B7A3A] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Search className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-[#2B2B26]">Find a Place</h3>
              <p className="text-xs text-gray-500 mt-1">I want to rent a room or apartment</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedType('landlord')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
              selectedType === 'landlord'
                ? 'border-[#6B7A3A] bg-olive-DEFAULT/5 shadow-md'
                : 'border-[#E2E8F0] hover:border-[#6B7A3A]/50 bg-white'
            }`}
          >
            <div className={`p-4 rounded-full ${selectedType === 'landlord' ? 'bg-[#6B7A3A] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Home className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-[#2B2B26]">List a Place</h3>
              <p className="text-xs text-gray-500 mt-1">I am a landlord or have a spare room</p>
            </div>
          </button>
        </div>
        <Button 
          className="w-full mt-8" 
          size="lg" 
          disabled={!selectedType || loading}
          onClick={handleContinue}
        >
          {loading ? 'Setting up your profile...' : 'Continue to Dashboard'}
        </Button>
      </div>
    </Modal>
  );
};
