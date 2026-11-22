'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Search, Bell, MessageCircle, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onSidebarToggle?: () => void;
}

export function Navbar({ onSidebarToggle }: NavbarProps = {}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 border-b border-input bg-card shadow-sm">
      <div className="flex items-center gap-4">
        <button
          className="rounded-lg p-1.5 hover:bg-accent transition-colors"
          onClick={onSidebarToggle}
        >
          <span className="sr-only">Toggle sidebar</span>
          <div className="relative flex -left-1 h-4 w-4">
            <span className="absolute block left-1 top-1 rounded-full bg-primary pb-0.75" />
            <span className="absolute block left-2 top-2 rounded-full bg-primary pb-0.75" />
            <span className="relative block rounded-full bg-muted pb-0.75" />
          </div>
        </button>

        <div className="relative hidden sm:flex w-[320px] items-center rounded-lg border border-input bg-background px-3 py-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search reports, users, locations…"
            className="flex h-8 w-full rounded-lg bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-1.5 hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-danger px-[6px] py-[2px] text-[10px] text-primary-foreground">
            <span className="px-[0.5px]">9+</span>
          </span>
        </button>
        <button className="relative rounded-lg p-1.5 hover:bg-accent transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary px-[6px] py-[2px] text-[10px] text-primary-foreground">
            <span className="px-[0.5px]">2</span>
          </span>
        </button>
        <button className="relative rounded-lg p-1.5 hover:bg-accent transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 pl-2">
          <div className="hidden sm:flex items-center gap-3 border-l border-input pl-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Jane Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <span className="text-xs font-bold">JA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}