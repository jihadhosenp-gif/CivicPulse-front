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
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ResponsiveSidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Admin', href: '/admin', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function ResponsiveSidebar({
  user,
  onLogout,
  className,
}: ResponsiveSidebarProps = {}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className={cn('relative', className)}>
      {/* Mobile trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <span className="sr-only">Open navigation</span>
            <Menu className="h-5 w-5" />
          </button>
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
            {navigation.map((item) => {
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
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Sign out</span>
            </Link>
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
            {navigation.map((item) => {
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
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Sign out</span>
            </Link>
            <ThemeToggle className="w-full" />
          </div>
        </div>
      </aside>
    </div>
  );
}
