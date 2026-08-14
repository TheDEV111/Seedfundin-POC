'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, PlusCircle, Search, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

import { getStoredToken, clearStoredToken } from '@/lib/auth';

import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { clearAuth } from '@/lib/features/authSlice';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    // Re-evaluate login status whenever the route changes
    setIsLoggedIn(!!getStoredToken());
  }, [pathname]);

  const handleLogout = () => {
    clearStoredToken();
    setIsLoggedIn(false);
    dispatch(clearAuth());
    router.push('/');
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
              Single<span className="text-[#6B7A3A]">Rent</span>
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
            {(!isLoggedIn || role === 'landlord') && (
              <Link
                href={isLoggedIn ? "/listings/new" : "/signup?type=landlord"}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#2B2B26] hover:text-[#6B7A3A] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] rounded-md"
              >
                <PlusCircle className="w-4 h-4 text-[#6B7A3A]" />
                List a Place
              </Link>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/dashboard" className="hidden sm:block">
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
                  <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
