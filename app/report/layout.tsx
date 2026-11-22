import { CitizenLayout as CitizenLayoutComponent } from '@/components/layout/citizen-layout';

export default function ReportRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CitizenLayoutComponent>{children}</CitizenLayoutComponent>;
}