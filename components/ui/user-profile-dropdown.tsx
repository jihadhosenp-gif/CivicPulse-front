'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/utils/cn';
import {
  User,
  Settings,
  LogOut,
  Shield,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = DialogPrimitive.Content;

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}

interface UserProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  menuItems?: MenuItem[];
  onLogout?: () => void;
  className?: string;
  trigger?: React.ReactNode;
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Profile', icon: <User className="h-4 w-4" />, href: '/profile' },
  { label: 'Settings', icon: <Settings className="h-4 w-4" />, href: '/settings' },
  { label: 'Admin Panel', icon: <Shield className="h-4 w-4" />, href: '/admin' },
  { label: 'Activity', icon: <Clock className="h-4 w-4" />, href: '/activity' },
  { label: 'Sign out', icon: <LogOut className="h-4 w-4" />, destructive: true },
];

export function UserProfileDropdown({
  user,
  menuItems = defaultMenuItems,
  onLogout,
  className,
  trigger,
}: UserProfileDropdownProps = {}) {
  const [open, setOpen] = React.useState(false);

  const handleMenuItem = (item: MenuItem) => {
    if (item.label === 'Sign out') {
      onLogout?.();
      return;
    }
    setOpen(false);
    if (item.onClick) item.onClick();
  };

  const avatar = user?.avatar ? (
    <img src={user.avatar} alt={user.name} className="aspect-square h-full w-full rounded-full object-cover" />
  ) : (
    <span className="flex h-full w-full items-center justify-center rounded-full text-xs font-bold">
      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
    </span>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'relative inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground shadow-elegant hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            className
          )}
          aria-label="User profile"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm text-xs font-bold">
            {avatar}
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">
              {user?.name ?? 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user?.role ?? 'User'}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'w-64 border border-input bg-popover shadow-lg rounded-xl p-0',
          open ? 'animate-in fade-in slide-in-from-top-2 z-50' : 'hidden'
        )}
      >
        <div className="px-4 py-3 border-b border-input">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">{user?.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ''}</p>
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-tighter border',
              user?.role === 'admin'
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-success/10 text-success border-success/20'
            )}>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
              {user?.role ?? 'user'}
            </span>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleMenuItem(item)}
              disabled={item.label === 'Sign out' && !onLogout}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                item.destructive
                  ? 'text-danger hover:bg-danger/10 hover:text-danger'
                  : 'text-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.href ? (
                <ChevronDown className="ml-auto h-3 w-3 text-muted-foreground" />
              ) : null}
            </button>
          ))}
          {menuItems.some((i) => i.label === 'Sign out') && (
            <div className="h-px bg-input mx-4 my-1" />
          )}
        </div>
        <div className="px-4 py-3 border-t border-input">
          <ThemeToggle className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
