import React from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col bg-[#F7F7F2]">
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
}
