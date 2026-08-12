'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { verifyUser } from '@/lib/features/authSlice';
import { CheckCircle2, Phone, ShieldCheck } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Phone, 2: OTP, 3: Success
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(verifyUser());
      setStep(3);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Verification">
      <div className="space-y-6">
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-olive-DEFAULT/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-olive-DEFAULT" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verify your Phone Number</h3>
              <p className="text-sm text-gray-500">
                To list a property and build trust in our community, please verify your phone number.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-DEFAULT/50"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || !phone}>
              {loading ? 'Sending code...' : 'Send Verification Code'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-olive-DEFAULT/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-olive-DEFAULT" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Enter Verification Code</h3>
              <p className="text-sm text-gray-500">
                We sent a 6-digit code to {phone}. <br/> (For dev, enter any 4+ digits)
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 text-center tracking-widest text-2xl font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-DEFAULT/50"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || otp.length < 4}>
              {loading ? 'Verifying...' : 'Verify My Account'}
            </Button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-olive-DEFAULT">
              Use a different number
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Account Verified!</h3>
            <p className="text-gray-500">
              Thank you for verifying your identity. You can now create your property listing.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
