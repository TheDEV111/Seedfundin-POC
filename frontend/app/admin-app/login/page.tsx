'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toast.success('Admin login successful!');
        // Redirect to admin root, wait a bit for cookie to be read
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl bg-white/70 backdrop-blur-xl border border-white/20">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-charcoal text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage Seedfundin listings and user data.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-charcoal px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-DEFAULT/20 focus:border-olive-DEFAULT transition-all"
                placeholder="admin@seedfundin.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-charcoal px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-DEFAULT/20 focus:border-olive-DEFAULT transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 text-base shadow-md group relative overflow-hidden flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Secure Login
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">
            This area is restricted to authorized personnel only. All access is logged and monitored.
          </p>
        </div>
      </Card>
    </div>
  );
}
