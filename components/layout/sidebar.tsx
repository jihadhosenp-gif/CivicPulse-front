'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Home, MapPin, FileText, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  navItems?: NavItem[];
  onLogout?: () => void;
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'My Reports', href: '/reports', icon: FileText },
  { name: 'Profile', href: '/profile', icon: Users },
];

export function Sidebar({
  user,
  navItems = defaultNavItems,
  onLogout,
  className,
}: SidebarProps = {}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className={cn('relative', className)}>
      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button
            className="lg:hidden rounded-[9px] p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Open navigation</span>
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[260px] border-l border-input shadow-xl"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-elegant">
                <span className="text-sm font-bold tracking-tight">C</span>
              </div>
              CivicPulse<span className="text-accent">AI</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-[9px] px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-soft text-accent border-l-3 border-accent'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-[19px] w-[19px] flex-shrink-0', isActive ? 'text-accent' : 'text-muted-foreground')} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/60" />
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
              className="flex items-center gap-3 rounded-[9px] px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
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
          'hidden lg:flex left-0 top-0 bottom-0 z-40 border-r border-input bg-surface transition-all duration-300 flex flex-col',
          collapsed ? 'w-[80px]' : 'w-[260px]',
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[72px] items-center justify-between px-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-elegant">
                <span className="text-sm font-bold tracking-tight">C</span>
              </div>
              {!collapsed && (
                <span className="font-bold text-xl tracking-tight text-foreground">
                  CivicPulse<span className="text-accent">AI</span>
                </span>
              )}
            </Link>
            <button
              className={cn(
                'ml-2 p-1.5 rounded-[9px] hover:bg-accent/50 transition-colors',
                collapsed ? 'hidden' : ''
              )}
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Collapse sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-[9px] px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-soft text-accent border-l-3 border-accent'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <div className="flex h-[19px] w-[19px] flex-shrink-0 items-center justify-center">
                    <Icon className={cn('h-[19px] w-[19px]', isActive ? 'text-accent' : 'text-muted-foreground')} />
                  </div>
                  {!collapsed && <span>{item.name}</span>}
                  {!collapsed && isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/60" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 py-4 border-t border-input space-y-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 rounded-[9px] px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
            <ThemeToggle className="w-full" />
          </div>
        </div>
      </aside>
    </div>
  );
}
