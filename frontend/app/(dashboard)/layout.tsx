'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { getStoredToken, parseStoredToken } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { setUserRole } from '@/lib/features/authSlice';

import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/');
      return;
    }

    // Try to decode the token to rehydrate Redux state if missing
    const payload = parseStoredToken(token);
    if (payload?.user_metadata?.account_type) {
      dispatch(setUserRole(payload.user_metadata.account_type));
    }
    
    setIsAuthorized(true);
  }, [router, dispatch]);

  if (!isAuthorized) {
    return (
      <div className="flex w-full min-h-[calc(100vh-64px)] bg-[#F7F7F2] items-center justify-center">
        <div className="animate-pulse text-olive-DEFAULT font-bold">Verifying Session...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-[#F7F7F2]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
