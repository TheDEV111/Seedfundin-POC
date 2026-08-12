'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { AccountType } from '@/lib/api-client';
import { createDemoJWT, setStoredToken } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('tenant');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const token = createDemoJWT(email, accountType, email.split('@')[0]);
      setStoredToken(token);
      router.push(accountType === 'landlord' ? '/listings/new' : '/search');
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F7F7F2]">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-xl font-bold text-center text-[#2B2B26]">Log In to Seedfundin</h1>
        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Toggle
              options={[
                { value: 'tenant', label: 'Tenant' },
                { value: 'landlord', label: 'Landlord' },
              ]}
              value={accountType}
              onChange={setAccountType}
              className="w-full justify-center"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Magic OTP Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              label="Verification Code"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging In...' : 'Verify & Enter'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
