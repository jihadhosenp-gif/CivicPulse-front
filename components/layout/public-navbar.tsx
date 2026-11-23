'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Mail, Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

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
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-30 flex h-[72px] items-center justify-between px-4 border-b border-border bg-surface/95 backdrop-blur-md shadow-sm transition-colors',
          className
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-elegant">
            <span className="text-sm font-bold tracking-tight">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            CivicPulse<span className="text-accent">AI</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle showLabel={false} />
          <Link
            href="/report/new"
            className="hidden sm:flex items-center justify-center gap-2 h-[44px] px-5 font-medium shadow-elegant hover:shadow-md transition-all bg-accent text-accent-foreground rounded-[9px]"
          >
            <ArrowRight className="h-4 w-4" /> Report an Issue
          </Link>
          <Link
            href="/login"
            className="hidden sm:flex items-center justify-center gap-2 h-[44px] px-5 font-medium rounded-[9px] border border-input bg-background hover:bg-accent/50 transition-all"
          >
            <Mail className="h-4 w-4" /> Login
          </Link>
          <button
            className="lg:hidden rounded-[9px] p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
        )}
        {navOpen && (
          <motion.div
            initial={{ translateX: '-100%' }}
            animate={{ translateX: 0 }}
            exit={{ translateX: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-full sm:max-w-xs bg-surface border-r border-input shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-input">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-elegant">
                  <span className="text-sm font-bold tracking-tight">C</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-foreground">
                  CivicPulse<span className="text-accent">AI</span>
                </span>
              </Link>
              <button
                className="rounded-[9px] p-1.5 hover:bg-accent/50 transition-colors"
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setNavOpen(false)}
                  className="flex items-center gap-3 rounded-[9px] px-3 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto px-4 py-6 space-y-3">
              <Link
                href="/report/new"
                className="flex items-center justify-center gap-2 h-[44px] px-5 font-medium shadow-elegant hover:shadow-md transition-all bg-accent text-accent-foreground rounded-[9px] w-full"
              >
                <ArrowRight className="h-4 w-4" /> Report an Issue
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 h-[44px] px-5 font-medium rounded-[9px] border border-input bg-background hover:bg-accent/50 transition-all w-full"
              >
                <Mail className="h-4 w-4" /> Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
