'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface PublicNavbarProps {
  className?: string;
}

const navLinks = [
  { name: 'Platform', href: '#platform' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'AI Intelligence', href: '#ai-intelligence' },
  { name: 'Stats', href: '#stats' },
];

export function PublicNavbar({ className }: PublicNavbarProps = {}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between px-4 border-b border-input bg-background/80 backdrop-blur-md transition-all',
        className
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elegant">
          <span className="text-sm font-bold tracking-tight">C</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">
          CivicPulse<span className="text-primary">AI</span>
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'text-muted-foreground hover:text-primary transition-colors',
              pathname === link.href && 'text-primary'
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/report/new"
          className="hidden sm:flex items-center justify-center gap-2 h-10 px-5 font-medium shadow-elegant hover:shadow-lg transition-all bg-primary text-primary-foreground rounded-lg"
        >
          <ArrowRight className="h-4 w-4" /> Report an Issue
        </Link>
        <ThemeToggle className="px-4" />
        <Link
          href="/login"
          className="hidden sm:flex items-center justify-center gap-2 h-10 px-5 font-medium rounded-lg border border-input bg-background hover:bg-accent transition-all"
        >
          <Mail className="h-4 w-4" /> Login
        </Link>
      </div>
    </nav>
  );
}
