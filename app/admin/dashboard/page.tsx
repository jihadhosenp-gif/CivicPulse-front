'use client';

import { ClientOnly } from '@/components/admin/client-only';
import AdminDashboardPage from './page-client';

export default function AdminDashboardWrapper() {
  return (
    <ClientOnly fallback={<div className="animate-pulse h-96" />}>
      <AdminDashboardPage />
    </ClientOnly>
  );
}
