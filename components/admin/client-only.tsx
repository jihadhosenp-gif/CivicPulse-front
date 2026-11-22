'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only after the component mounts on the client.
 * Use this for components that use framer-motion `motion` elements,
 * which cannot be invoked during server-side prerendering.
 */
export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <>{fallback ?? null}</>;
  }
  return <>{children}</>;
}
