'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  Home,
  MapPin,
  FileText,
  Users,
  Shield,
  BarChart3,
  Settings,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { UserProfileDropdown } from '@/components/ui/user-profile-dropdown';
import { Sidebar } from './sidebar';

interface AdminLayoutProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
  children: React.ReactNode;
}

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Issues', href: '/admin/issues', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Map', href: '/admin/map', icon: MapPin },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({
  user,
  onLogout,
  className,
  children,
}: AdminLayoutProps) {
  const [search, setSearch] = React.useState('');

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <Sidebar user={user} onLogout={onLogout} navItems={adminNavigation} />

      <div className="flex flex-1 md:ml-[260px]">
        <header
          className="sticky top-0 z-30 flex h-[72px] items-center justify-between px-4 border-b border-input bg-surface/95 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-elegant">
                <span className="text-sm font-bold tracking-tight">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                CivicPulse<span className="text-accent">AI</span>
              </span>
            </Link>
          </div>

          <div className="relative hidden sm:flex w-[320px] items-center rounded-[9px] border border-input bg-background px-3 py-2">
            <input
              type="search"
              placeholder="Search issues, users, locations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-8 w-full rounded-[9px] bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
              aria-label="Search issues, users, and locations"
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle showLabel={false} className="hidden sm:block" />
            <NotificationDropdown />
            <UserProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </header>

        <main className="flex-1 pt-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <footer className="border-t border-input bg-background px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground text-center">
            {'© '} {new Date().getFullYear()} CivicPulse AI. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
