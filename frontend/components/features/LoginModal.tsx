'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { createDemoJWT, setStoredToken } from '@/lib/auth';
import { AccountType } from '@/lib/api-client';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const token = createDemoJWT(email, 'tenant', email.split('@')[0]);
      setStoredToken(token);
      if (onSuccess) onSuccess();
      onClose();
      // Reset
      setStep('email');
      setEmail('');
      setOtp('');
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 'email' ? 'Log In / Sign Up' : 'Enter Verification Code'}>
      {step === 'email' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Enter your email to continue. If you don't have an account, we'll seamlessly create one for you.
          </p>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Sending Code...' : 'Continue'}
          </Button>

          <p className="text-xs text-center text-gray-400 pt-2">
            Passwordless & secure. Powered by Supabase Auth JWT verification.
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="bg-olive-DEFAULT/10 border border-olive-DEFAULT/20 p-3 rounded-lg mb-4 text-sm text-olive-deep">
            <strong>Development Mode:</strong> The email system is currently disabled. You can enter ANY 6-digit code (e.g. 123456) to bypass this step and test the app.
          </div>
          <p className="text-sm text-[#2B2B26]">
            We sent a verification code to <strong className="text-[#6B7A3A]">{email}</strong>
          </p>

          <Input
            label="6-Digit Verification Code"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={error}
            maxLength={6}
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Log In'}
          </Button>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="text-xs text-[#6B7A3A] font-semibold hover:underline w-full text-center"
          >
            ← Back to email
          </button>
        </form>
      )}
    </Modal>
  );
};
