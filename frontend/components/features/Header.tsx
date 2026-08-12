'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, PlusCircle, Search, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoginModal } from './LoginModal';
import { OnboardingModal } from './OnboardingModal';
import { getStoredToken, clearStoredToken } from '@/lib/auth';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/lib/features/authSlice';

export const Header: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoggedIn(!!getStoredToken());
  }, []);

  const handleLogout = () => {
    clearStoredToken();
    setIsLoggedIn(false);
    dispatch(clearAuth());
    router.push('/');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    // In dev, automatically trigger onboarding to show the flow
    setIsOnboardingOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] rounded-lg">
            <div className="w-9 h-9 rounded-xl bg-[#6B7A3A] flex items-center justify-center text-white shadow-sm group-hover:bg-[#4A5A2A] transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#2B2B26]">
              Seed<span className="text-[#6B7A3A]">fundin</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#2B2B26] hover:text-[#6B7A3A] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] rounded-md"
            >
              <Search className="w-4 h-4 text-[#6B7A3A]" />
              Browse Listings
            </Link>
            <Link
              href="/listings/new"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#2B2B26] hover:text-[#6B7A3A] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] rounded-md"
            >
              <PlusCircle className="w-4 h-4 text-[#6B7A3A]" />
              List a Place
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/search">
                  <Button variant="outline" size="sm">
                    <UserIcon className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
                  <LogIn className="w-4 h-4 mr-1.5 text-[#6B7A3A]" />
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsLoginOpen(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(type) => {
          setIsOnboardingOpen(false);
          // Recreate the token with the correct type so it persists on reload
          import('@/lib/auth').then(({ createDemoJWT, setStoredToken }) => {
            const token = createDemoJWT('test@example.com', type, 'Test User');
            setStoredToken(token);
            window.location.href = type === 'landlord' ? '/dashboard' : '/search';
          });
        }}
      />
    </>
  );
};
