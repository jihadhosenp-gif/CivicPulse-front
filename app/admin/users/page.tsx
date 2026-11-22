'use client';

import { ClientOnly } from '@/components/admin/client-only';
import UserManagementPage from './page-client';

export default function UsersWrapper() {
  return (
    <ClientOnly fallback={<div className="animate-pulse h-96" />}>
      <UserManagementPage />
    </ClientOnly>
  );
}
