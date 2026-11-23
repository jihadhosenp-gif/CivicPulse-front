
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Menu, Search, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { UserProfileDropdown } from '@/components/ui/user-profile-dropdown';
import { Input } from '@/components/ui/input';

interface AppHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onSidebarToggle?: () => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export function AppHeader({
  user,
  onLogout,
  onSidebarToggle,
  onSearch,
  className,
}: AppHeaderProps = {}) {
  const pathname = usePathname();
  const [search, setSearch] = React.useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(search);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between px-4 border-b border-input bg-card/80 backdrop-blur-md shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-4">

        {/* Sidebar toggle */}
        {onSidebarToggle && (
          <button
            type="button"
            onClick={onSidebarToggle}
            aria-label="Toggle navigation"
            aria-expanded={false}
            className="rounded-lg p-1.5 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 md:hidden"
          >
            <span className="sr-only">Toggle navigation</span>
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elegant">
            <span className="text-sm font-bold tracking-tight">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            CivicPulse<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden sm:flex w-[320px] items-center rounded-lg border border-input bg-background px-3 py-2"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search reports, users, locations…"
            className="flex h-8 w-full rounded-lg bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
            aria-label="Search reports, users, and locations"
          />
        </form>
      </div>

      <div className="flex items-center gap-2">

        {/* Mobile search */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen((open) => !open)}
          aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
          aria-expanded={mobileSearchOpen}
          className="rounded-lg p-1.5 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:hidden"
        >
          <span className="sr-only">{mobileSearchOpen ? 'Close search' : 'Open search'}</span>
          {mobileSearchOpen ? <HelpCircle className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>

        {/* Theme toggle */}
        <ThemeToggle showLabel={false} className="hidden sm:block" />

        {/* Notifications */}
        <NotificationDropdown />

        {/* Help — links to the existing design-system documentation page */}
        <Link
          href="/design-system"
          aria-label="Help and documentation"
          className="hidden rounded-lg p-1.5 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:flex"
        >
          <HelpCircle className="h-5 w-5" />
        </Link>

        {/* User profile dropdown — displays name, email, role, and avatar */}
        <UserProfileDropdown user={user} onLogout={onLogout} />
      </div>

      {/* Mobile search input */}
      {mobileSearchOpen && (
        <div className="border-t border-input p-3 sm:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-xl border border-input bg-background px-3"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search reports, users, locations…"
              className="h-9 w-full rounded-lg bg-transparent px-3 py-2 pl-8 text-sm outline-none transition-all placeholder:text-muted-foreground"
              aria-label="Search reports, users, and locations"
            />
          </form>
        </div>
      )}
    </header>
  );
}

/** Backward-compatible alias. */
export const Navbar = AppHeader;
