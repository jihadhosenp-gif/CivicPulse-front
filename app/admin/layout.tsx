import { AdminLayout as AdminLayoutComponent } from '@/components/layout/admin-layout';

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}