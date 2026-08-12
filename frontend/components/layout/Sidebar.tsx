'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleSidebar } from '@/lib/features/uiSlice';
import { 
  Search, 
  MessageSquare, 
  User, 
  Settings, 
  Heart, 
  FileText, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const role = useSelector((state: RootState) => state.auth.role) || 'tenant'; // Fallback to tenant

  const tenantLinks = [
    { name: 'Marketplace', href: '/search', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 2 },
    { name: 'Saved Places', href: '/saved', icon: Heart },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Profile & Verifications', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const landlordLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Listings', href: '/listings', icon: Home },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 5 },
    { name: 'Tenants & Leases', href: '/applications', icon: FileText },
    { name: 'Profile & Verifications', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const links = role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <div 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out hidden md:flex flex-col relative sticky top-16
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
      style={{ height: 'calc(100vh - 64px)' }} // Fixed height matching viewport minus header
    >
      <button 
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-charcoal shadow-sm z-10"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="flex-1 py-6 px-3 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center rounded-xl p-3 transition-colors ${
                isActive 
                  ? 'bg-olive-DEFAULT/10 text-olive-deep font-bold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal font-medium'
              }`}
              title={!sidebarOpen ? link.name : undefined}
            >
              <div className="relative flex-shrink-0">
                <Icon size={22} className={isActive ? 'text-olive-deep' : 'text-gray-400'} />
                {!sidebarOpen && link.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </div>
              
              {sidebarOpen && (
                <div className="ml-3 flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* User Mini Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="h-10 w-10 rounded-full bg-charcoal flex items-center justify-center text-white font-bold flex-shrink-0">
            {role === 'landlord' ? 'L' : 'T'}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-charcoal truncate">My Account</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
