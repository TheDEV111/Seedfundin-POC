'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { AccountType } from '@/lib/api-client';
import { setStoredToken } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('tenant');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      setLoading(false);
      setStep('otp');
      toast.success('Login code sent to your email!');
    } catch (error: any) {
      setLoading(false);
      if (error.message.includes('Signups not allowed')) {
        toast.error('Account not found. Please sign up first!');
      } else {
        toast.error(error.message || 'Failed to send login code');
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      if (data.session) {
        setStoredToken(data.session.access_token);
        
        try {
          // Fetch user profile from Go backend to determine account type
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
          const res = await fetch(`${apiUrl}/api/v1/me`, {
            headers: { 'Authorization': `Bearer ${data.session.access_token}` }
          });
          
          if (res.ok) {
            const userProfile = await res.json();
            toast.success('Successfully logged in!');
            router.push(userProfile.account_type === 'landlord' ? '/listings/new' : '/search');
            return;
          }
        } catch (err) {
          console.error("Failed to fetch profile during login", err);
        }
      }

      toast.success('Successfully logged in!');
      // Fallback if backend fetch fails
      router.push(accountType === 'landlord' ? '/listings/new' : '/search');
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || 'Invalid verification code');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F7F7F2]">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-xl rounded-3xl">
        <h1 className="text-2xl font-bold text-center text-[#2B2B26]">Welcome Back to Seedfundin</h1>
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
              {loading ? 'Sending Code...' : 'Send Login Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3 bg-[#6B7A3A]/10 rounded-xl text-xs text-[#4A5A2A] font-medium text-center">
              6-digit code sent to <strong>{email}</strong>
            </div>
            <Input
              label="Verification Code"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </Button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-xs text-gray-400 font-medium hover:text-[#6B7A3A] transition-colors w-full text-center mt-2"
            >
              ← Go back
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
