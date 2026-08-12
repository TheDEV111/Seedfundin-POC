import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <PublicHeader />
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
}
