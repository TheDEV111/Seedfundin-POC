'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Search, MessageSquare, User, Heart, FileText, LayoutDashboard, Home } from 'lucide-react';

export const MobileNav = () => {
  const pathname = usePathname();
  const role = useSelector((state: RootState) => state.auth.role) || 'tenant';

  const tenantLinks = [
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Saved', href: '/saved', icon: Heart },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 2 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const landlordLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Listings', href: '/listings', icon: Home },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 5 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const links = role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-[#6B7A3A]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'text-[#6B7A3A] fill-current opacity-20' : ''} />
                <Icon size={20} className={`absolute inset-0 ${isActive ? 'text-[#4A5A2A]' : ''}`} />
                {link.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border-2 border-white">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
