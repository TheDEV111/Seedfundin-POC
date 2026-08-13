'use client';

import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Simple Admin Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-charcoal rounded flex items-center justify-center font-extrabold text-white">
            SF
          </div>
          <span className="font-extrabold text-charcoal text-lg">Admin Portal</span>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
