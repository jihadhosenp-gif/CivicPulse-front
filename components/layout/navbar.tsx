'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  MessageCircle,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';

interface NavbarProps {
  onSidebarToggle?: () => void;
  userName?: string;
  userRole?: string;
  userImage?: string;
  onLogout?: () => void;
  onSearch?: (value: string) => void;
  notificationCount?: number;
  messageCount?: number;
}

export function Navbar({
  onSidebarToggle,
  userName = 'Admin',
  userRole = 'Administrator',
  userImage,
  onLogout,
  onSearch,
  messageCount = 0,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/90 shadow-sm backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">

        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">

          <button
            type="button"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
            className="rounded-xl p-2 transition-colors hover:bg-accent"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>

          <div className="hidden w-[280px] items-center gap-2 rounded-xl border border-border bg-background px-3 sm:flex">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search reports, users..."
              className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search reports and users"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Mobile Search */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="rounded-xl p-2 transition-colors hover:bg-accent sm:hidden"
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>

          {/* Theme Toggle — uses the shared ThemeProvider-backed toggle */}
          <ThemeToggle showLabel={false} />

          {/* Notifications — in-app dropdown (no external route) */}
          <NotificationDropdown />

          {/* Messages */}
          {messageCount > 0 && (
            <button
              type="button"
              aria-label="Messages"
              className="relative rounded-xl p-2 transition-colors hover:bg-accent"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {messageCount > 99 ? '99+' : messageCount}
              </span>
            </button>
          )}

          {/* Help — links to the existing design-system documentation page */}
          <Link
            href="/design-system"
            aria-label="Help and documentation"
            className="hidden rounded-xl p-2 transition-colors hover:bg-accent sm:flex"
          >
            <HelpCircle className="h-5 w-5" />
          </Link>

          {/* Profile */}
          <div className="relative ml-2 border-l border-border pl-3">

            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-accent"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userRole}
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 z-50 w-52 rounded-xl border border-border bg-card p-2 shadow-xl">
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>

                <div className="my-1 border-t border-border" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {mobileSearchOpen && (
        <div className="border-t border-border p-3 sm:hidden">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search reports, users..."
              className="h-10 w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}