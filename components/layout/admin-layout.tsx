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
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { UserProfileDropdown } from '@/components/ui/user-profile-dropdown';

interface AdminLayoutProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
  className?: string;
  children: React.ReactNode;
}

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Admin', href: '/admin', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function AdminLayout({
  user,
  onLogout,
  className,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 border-b border-input bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-1.5 hover:bg-accent transition-colors md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <span className="sr-only">Open navigation</span>
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-elegant">
              <span className="text-sm font-bold tracking-tight">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              CivicPulse<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative hidden sm:flex w-[320px] items-center rounded-lg border border-input bg-background px-3 py-2">
          <input
            type="search"
            placeholder="Search reports, users, locations…"
            className="flex h-8 w-full rounded-lg bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
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
          <UserProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </header>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button className="hidden" aria-label="Close navigation" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-l border-input shadow-xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-elegant">
                <span className="text-sm font-bold tracking-tight">C</span>
              </div>
              CivicPulse<span className="text-primary">AI</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="px-4 py-4 space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-elegant'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 py-4 border-t border-input space-y-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                onLogout?.();
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Sign out</span>
            </button>
            <ThemeToggle className="w-full" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex left-0 top-0 bottom-0 z-40 border-r border-input bg-card/95 backdrop-blur-md transition-all duration-300 w-64',
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-elegant">
                <span className="text-sm font-bold tracking-tight">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                CivicPulse<span className="text-primary">AI</span>
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-elegant'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 py-4 border-t border-input space-y-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Sign out</span>
            </button>
            <ThemeToggle className="w-full" />
          </div>
        </div>
      </aside>

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
  );
}
