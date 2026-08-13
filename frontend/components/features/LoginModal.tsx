'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { createDemoJWT, setStoredToken } from '@/lib/auth';
import { AccountType } from '@/lib/api-client';
import { supabase } from '@/lib/supabaseClient';

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: { account_type: 'tenant' },
        },
      });

      if (authError) {
        throw authError;
      }

      setLoading(false);
      setStep('otp');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An error occurred while sending the code. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    
    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (authError) {
        throw authError;
      }

      // Set the token from Supabase session
      if (data.session) {
        setStoredToken(data.session.access_token);
      }

      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
      // Reset
      setStep('email');
      setEmail('');
      setOtp('');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Invalid verification code');
    }
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
            <strong>Check your inbox:</strong> We've sent a real 6-digit verification code using Brevo!
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
