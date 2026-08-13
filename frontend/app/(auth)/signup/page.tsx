'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Building } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AccountType } from '@/lib/api-client';
import { setStoredToken } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const fluidSpring: any = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };
const liquidTransition: any = { type: 'spring', stiffness: 200, damping: 15, mass: 0.8 };

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialEmail = searchParams.get('email') || '';
  const initialType = (searchParams.get('type') as AccountType) || null;

  const [accountType, setAccountType] = useState<AccountType | null>(initialType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  
  // If type is already passed in URL, jump to details. Else, show choice.
  const [step, setStep] = useState<'choice' | 'details' | 'otp'>(initialType ? 'details' : 'choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPath = (type: AccountType) => {
    setAccountType(type);
    setStep('details');
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError('Please fill in all required profile fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Create user or update existing one in Supabase
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            name,
            phone,
            account_type: accountType || 'tenant',
          },
        },
      });

      if (authError) {
        throw authError;
      }

      setLoading(false);
      setStep('otp');
      toast.success('Verification code sent to your email!');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An error occurred while sending the verification code.');
    }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit OTP code');
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

      if (data.session) {
        setStoredToken(data.session.access_token);
      }
      
      // Attempt to sync user with Go Backend (Optional: Can also happen on first request)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      fetch(`${apiUrl}/api/v1/me`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.session?.access_token}`
        },
        body: JSON.stringify({
          name,
          phone,
          account_type: accountType || 'tenant',
        })
      }).catch(console.error);

      setLoading(false);
      toast.success('Account created successfully!');
      if (accountType === 'landlord') {
        router.push('/listings/new');
      } else {
        router.push('/search');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Invalid verification code');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#F7F7F2] overflow-hidden">
      <motion.div layout transition={fluidSpring} className="w-full max-w-md">
        <Card className="p-6 sm:p-8 space-y-6 bg-white relative overflow-hidden shadow-xl rounded-3xl">
          
          <AnimatePresence mode="wait">
            {step === 'choice' && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95, filter: "blur(10px)" }}
                transition={liquidTransition}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-extrabold text-[#2B2B26] tracking-tight">Choose your path</h1>
                  <p className="text-sm text-gray-500">How would you like to use Seedfundin?</p>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectPath('tenant')}
                    className="relative p-6 bg-[#F7F7F2] hover:bg-[#6B7A3A]/5 border-2 border-transparent hover:border-[#6B7A3A]/30 rounded-2xl text-left transition-colors duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6B7A3A] group-hover:scale-110 transition-transform shrink-0">
                        <Search className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#2B2B26]">Find an apartment</h3>
                        <p className="text-xs text-gray-500 mt-1">Search, filter, and connect with verified landlords instantly. No hidden fees.</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectPath('landlord')}
                    className="relative p-6 bg-[#F7F7F2] hover:bg-[#6B7A3A]/5 border-2 border-transparent hover:border-[#6B7A3A]/30 rounded-2xl text-left transition-colors duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6B7A3A] group-hover:scale-110 transition-transform shrink-0">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#2B2B26]">List an apartment</h3>
                        <p className="text-xs text-gray-500 mt-1">Post your room or full apartment and find serious tenants fast.</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
                
                <div className="text-center pt-2 text-xs text-gray-500">
                  Already have an account?{' '}
                  <Link href="/" className="text-[#6B7A3A] font-bold hover:underline">
                    Log In
                  </Link>
                </div>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={liquidTransition}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#6B7A3A]/10 text-[#6B7A3A] flex items-center justify-center mx-auto mb-4">
                    {accountType === 'tenant' ? <Search className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                  </div>
                  <h1 className="text-2xl font-bold text-[#2B2B26]">Create {accountType === 'tenant' ? 'Tenant' : 'Landlord'} Profile</h1>
                  <p className="text-xs text-gray-600">Passwordless verification for fast access</p>
                </div>

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
                    label="Phone Number"
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
                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                  </Button>
                </form>

                <button
                  onClick={() => setStep('choice')}
                  className="text-xs text-gray-400 font-medium hover:text-[#6B7A3A] transition-colors w-full text-center mt-2"
                >
                  ← Back to choices
                </button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={liquidTransition}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#6B7A3A]/10 text-[#6B7A3A] flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2B2B26]">Verify Your Identity</h1>
                </div>

                <form onSubmit={handleVerifySignup} className="space-y-4">
                  <div className="p-3 bg-[#6B7A3A]/10 rounded-xl text-xs text-[#4A5A2A] font-medium text-center">
                    6-digit code sent to <strong>{email}</strong>
                  </div>

                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    error={error}
                    required
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Verifying...' : `Complete Signup`}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs text-gray-400 font-medium hover:text-[#6B7A3A] transition-colors w-full text-center mt-2"
                  >
                    ← Edit Profile Info
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
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
