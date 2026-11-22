'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import {
  Search,
  Bell,
  MessageCircle,
  HelpCircle,
  Menu,
  MapPin,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { UserProfileDropdown } from '@/components/ui/user-profile-dropdown';

interface AppHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onSidebarToggle?: () => void;
  className?: string;
}

export function AppHeader({
  user,
  onLogout,
  onSidebarToggle,
  className,
}: AppHeaderProps = {}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between px-4 border-b border-input bg-card/80 backdrop-blur-md shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {onSidebarToggle && (
          <button
            className="rounded-lg p-1.5 hover:bg-accent transition-colors"
            onClick={onSidebarToggle}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-elegant">
            <span className="text-sm font-bold tracking-tight">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            CivicPulse<span className="text-primary">AI</span>
          </span>
        </Link>
        <div className="relative hidden sm:flex w-[320px] items-center rounded-lg border border-input bg-background px-3 py-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search reports, locations…"
            className="flex h-8 w-full rounded-lg bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative rounded-lg p-1.5 hover:bg-accent transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-danger px-[6px] py-[2px] text-[10px] text-white border-2 border-background">
            <span className="px-[0.5px]">9+</span>
          </span>
        </button>
        <button
          className="relative rounded-lg p-1.5 hover:bg-accent transition-colors"
          aria-label="Messages"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <button
          className="relative rounded-lg p-1.5 hover:bg-accent transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <ThemeToggle className="px-4" />
        <UserProfileDropdown user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
