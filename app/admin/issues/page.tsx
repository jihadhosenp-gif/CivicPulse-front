'use client';

import { ClientOnly } from '@/components/admin/client-only';
import IssueManagementPage from './page-client';

export default function IssuesWrapper() {
  return (
    <ClientOnly fallback={<div className="animate-pulse h-96" />}>
      <IssueManagementPage />
    </ClientOnly>
  );
}
