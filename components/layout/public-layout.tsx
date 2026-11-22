'use client';

import * as React from 'react';
import { PublicNavbar } from './public-navbar';
import { Footer } from './footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PublicLayout({ children, className }: PublicLayoutProps) {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className ?? ''}`}>
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}