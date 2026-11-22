'use client';

import { ClientOnly } from '@/components/admin/client-only';
import AnalyticsPage from './page-client';

export default function AnalyticsWrapper() {
  return (
    <ClientOnly fallback={<div className="animate-pulse h-96" />}>
      <AnalyticsPage />
    </ClientOnly>
  );
}
