'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Home, MapPin, FileText, Users, LogOut, ChevronRight, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CitizenLayoutProps {
  user?: {
    name: string;
    email: string;
    role: string;
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
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 border-b border-input bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-1.5 hover:bg-accent transition-colors"
            onClick={() => setOpen(true)}
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
            placeholder="Search reports, locations…"
            className="flex h-8 w-full rounded-lg bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile" className="hidden sm:flex items-center gap-3 border-l border-input pl-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user?.name ?? 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.role ?? 'Citizen'}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-sm">
              <span className="text-xs font-bold">{user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
            </div>
          </Link>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
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
            {citizenNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
                setOpen(false);
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
