'use client';

export const dynamic = 'force-dynamic';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { AdminStatsGrid } from '@/components/admin/admin-stats';
import {
  AdminStatsSkeleton,
  AdminChartSkeleton,
  AdminIssueTableSkeleton,
  AdminWelcomeHeaderSkeleton,
} from '@/components/admin/admin-skeleton';
import { AdminChartCard } from '@/components/admin/admin-chart-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  MapPin,
  Clock,
  FileText,
  ChevronRight,
  Activity,
  Users,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/utils/cn';

interface ReportItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  severity?: string;
  location?: {
    address: string;
    lat?: number;
    lng?: number;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsSummary {
  byStatus?: Array<{ _id: string; count: number }>;
  byCategory?: Array<{ _id: string; count: number }>;
  bySeverity?: Array<{ _id: string; count: number }>;
}

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  resolved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-danger/10 text-danger border-danger/20',
  under_review: 'bg-info/10 text-info border-info/20',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
  under_review: 'Under Review',
};

const categoryColors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--danger))'];

const axisStyle = {
  fill: 'hsl(var(--muted-foreground))',
  fontSize: 12,
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  color: 'hsl(var(--popover-foreground))',
  boxShadow: 'var(--shadow-lg)',
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      api.get<{ data: { items: ReportItem[] } }>('/reports', { params: { page: 1, limit: 10 } }),
      api.get<{ data: AnalyticsSummary }>('/analytics/summary'),
    ])
      .then(([reportsRes, analyticsRes]) => {
        if (!active) return;
        setReports(reportsRes.data.data?.items ?? []);
        setAnalytics(analyticsRes.data?.data ?? {});
        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message ?? 'Failed to load dashboard data.');
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const inProgressReports = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedReports = reports.filter((r) => r.status === 'resolved').length;
  const resolutionRate = totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;

  const statusData = (analytics.byStatus ?? []).map((x) => ({ name: statusLabels[x._id] ?? String(x._id), value: x.count }));
  const categoryData = (analytics.byCategory ?? []).map((x) => ({ name: String(x._id), value: x.count }));
  const severityData = (analytics.bySeverity ?? []).map((x) => ({ name: String(x._id), value: x.count }));

  const stats = {
    totalReports,
    pendingReports,
    inProgressReports,
    resolvedReports,
    totalUsers: 0,
    resolutionRate,
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <AdminWelcomeHeaderSkeleton />
        <AdminStatsSkeleton />
        <div className="grid gap-6 md:grid-cols-3">
          <AdminChartSkeleton />
          <AdminChartSkeleton />
          <AdminChartSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminIssueTableSkeleton rows={4} />
          <AdminChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-input bg-card p-6 sm:p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-danger mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Unable to load dashboard</h3>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage community reports and platform activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="gap-2">
            <Activity className="h-4 w-4" />
            View Activity
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          totalReports === 0 && 'opacity-50 pointer-events-none'
        )}
      >
        <AdminStatsGrid stats={stats} />
      </motion.div>

      {/* Charts row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <AdminChartCard title="Reports by Status" description="Distribution of reports across statuses">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Reports by Category" description="Reports grouped by category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="value" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Severity Distribution" description="Breakdown by severity level">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={60}
                fill="#8884d8"
                label>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--foreground))' }} />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="flex h-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-input">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 8).map((report) => (
                      <tr
                        key={report._id}
                        className="border-b border-input/50 hover:bg-accent/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{report.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {report.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="outline" className={cn(statusColors[report.status], 'gap-1')}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {statusLabels[report.status] ?? report.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs font-medium text-foreground">{report.severity ?? '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatRelativeTime(report.updatedAt)}
                        </td>
                      </tr>
                    ))}
                    {reports.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center">
                          <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                          <h3 className="text-sm font-semibold text-foreground">No recent activity</h3>
                          <p className="mt-1 text-xs text-muted-foreground">Reports will appear here as they are submitted.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="flex h-full flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Report Locations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[320px] rounded-xl border border-input overflow-hidden">
                <AdminMapOverview reports={reports.slice(0, 20)} />
              </div>
              {reports.length === 0 && (
                <div className="p-6 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No report locations to display.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick stats summary */}
      {totalReports > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid gap-4 sm:grid-cols-3 text-center"
        >
          <div className="rounded-xl border border-input bg-secondary p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending</div>
            <div className="mt-1 text-2xl font-bold text-warning">{pendingReports}</div>
          </div>
          <div className="rounded-xl border border-input bg-secondary p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">In Progress</div>
            <div className="mt-1 text-2xl font-bold text-primary">{inProgressReports}</div>
          </div>
          <div className="rounded-xl border border-input bg-secondary p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resolved</div>
            <div className="mt-1 text-2xl font-bold text-success">{resolvedReports}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AdminMapOverview({ reports }: { reports: ReportItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let map: any;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!ref.current) return;
      const center: [number, number] = reports.length > 0 && reports[0]?.location?.lat != null
        ? [reports[0].location.lat, (reports[0].location.lng ?? 90.4125) as number]
        : [23.8103, 90.4125];
      map = L.map(ref.current).setView(center, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      reports.forEach((r) => {
        const lat = r.location?.lat;
        const lng = r.location?.lng;
        if (lat == null || lng == null) return;
        const color = statusColors[r.status]?.includes('danger') ? 'red' :
          statusColors[r.status]?.includes('success') ? 'green' :
          statusColors[r.status]?.includes('warning') ? 'orange' : 'blue';
        L.circleMarker([lat, lng], {
          radius: 6,
          fillColor: color,
          color: color,
          fillOpacity: 0.7,
          weight: 1,
        }).addTo(map).bindPopup(r.title || 'Report');
      });
    })();
    return () => {
      if (map) map.remove();
    };
  }, [reports]);

  return <div ref={ref} className="w-full h-full" />;
}
