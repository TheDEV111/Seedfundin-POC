'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Building } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AccountType } from '@/lib/api-client';
import { createDemoJWT, setStoredToken } from '@/lib/auth';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as AccountType) || 'tenant';

  const [accountType, setAccountType] = useState<AccountType>(initialType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError('Please fill in all required profile fields');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifySignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit OTP code sent to your phone');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const token = createDemoJWT(email, accountType, name);
      setStoredToken(token);

      if (accountType === 'landlord') {
        router.push('/listings/new');
      } else {
        router.push('/search');
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#F7F7F2]">
      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#6B7A3A]/10 text-[#6B7A3A] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#2B2B26]">Create Your Free Account</h1>
          <p className="text-xs text-gray-600">Passwordless OTP verification for fast, secure access</p>
        </div>

        {/* Account Type Segmented Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#2B2B26] text-center">I am joining as a:</label>
          <Toggle
            options={[
              { value: 'tenant', label: 'Tenant (Looking for place)' },
              { value: 'landlord', label: 'Landlord (Posting place)' },
            ]}
            value={accountType}
            onChange={setAccountType}
            className="w-full justify-between"
          />
        </div>

        {step === 'details' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Phone Number (for landlord contact & SMS OTP)"
              type="tel"
              placeholder="+1 555 019 2831"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifySignup} className="space-y-4">
            <div className="p-3 bg-[#6B7A3A]/10 rounded-xl text-xs text-[#4A5A2A] font-medium">
              OTP code sent to <strong>{phone}</strong> & <strong>{email}</strong>
            </div>

            <Input
              label="6-Digit Verification OTP"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              error={error}
              required
            />

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating Profile...' : `Complete Signup as ${accountType === 'landlord' ? 'Landlord' : 'Tenant'}`}
            </Button>

            <button
              type="button"
              onClick={() => setStep('details')}
              className="text-xs text-[#6B7A3A] font-semibold hover:underline w-full text-center"
            >
              ← Edit Profile Info
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#E2E8F0] text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/" className="text-[#6B7A3A] font-bold hover:underline">
            Log In via Header Modal
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#6B7A3A] font-medium">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
