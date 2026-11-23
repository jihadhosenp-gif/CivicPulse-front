'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Home, MapPin, FileText, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';
import { Sidebar } from './sidebar';

interface CitizenLayoutProps {
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

const citizenNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'My Reports', href: '/reports', icon: FileText },
  { name: 'Profile', href: '/profile', icon: Users },
];

export function CitizenLayout({
  user,
  onLogout,
  className,
  children,
}: CitizenLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <Sidebar user={user} onLogout={onLogout} navItems={citizenNavigation} />

      <div className="flex flex-1 md:ml-[260px]">
        <header
          className="sticky top-0 z-30 flex h-[72px] items-center justify-between px-4 border-b border-input bg-surface/95 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
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
              placeholder="Search reports, locations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-8 w-full rounded-[9px] bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
              aria-label="Search reports and locations"
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle showLabel={false} className="hidden sm:block" />
            <Link href="/profile" className="hidden sm:flex items-center gap-3 border-l border-input pl-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{user?.name ?? 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.role ?? 'Citizen'}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <span className="text-xs font-bold">{user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
              </div>
            </Link>
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
