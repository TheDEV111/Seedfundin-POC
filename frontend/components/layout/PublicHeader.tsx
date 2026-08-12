'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Button } from '../ui/Button';
import { LoginModal } from '../features/LoginModal';

export const PublicHeader: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleListPlaceClick = () => {
    if (role) {
      router.push('/listings/new');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm px-6 h-[72px] flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-extrabold text-xl text-[#2B2B26] tracking-tight">
          Seedfundin<span className="text-[#6B7A3A]">.</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/search" className="text-sm font-medium text-gray-600 hover:text-olive-DEFAULT">Find a Place</Link>
          <button onClick={handleListPlaceClick} className="text-sm font-medium text-gray-600 hover:text-olive-DEFAULT">List a Place</button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {role ? (
          <Link href="/dashboard">
            <Button variant="primary" size="sm">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsLoginOpen(true)}>Log In</Button>
            <Button variant="primary" size="sm" onClick={() => setIsLoginOpen(true)}>Sign Up</Button>
          </>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSuccess={() => {
          setIsLoginOpen(false);
          router.push('/dashboard');
        }}
      />
    </header>
  );
};
