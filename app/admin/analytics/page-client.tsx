'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '@/services/api';
import {
  AdminChartSkeleton,
  AdminStatsSkeleton,
} from '@/components/admin/admin-skeleton';
import { AdminChartCard } from '@/components/admin/admin-chart-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

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

const categoryColors = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--danger))',
];

interface CountBucket {
  _id: string | number;
  count: number;
}

interface AnalyticsSummary {
  byStatus?: CountBucket[];
  byCategory?: CountBucket[];
  bySeverity?: CountBucket[];
}

interface ChartDatum {
  name: string;
  value: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    api
      .get<{ data: AnalyticsSummary }>('/analytics/summary')
      .then((r) => {
        if (!active) return;
        setData(r.data?.data ?? {});
        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message ?? 'Failed to load analytics.');
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const statusData: ChartDatum[] = (data.byStatus ?? []).map((x) => ({
    name: String(x._id),
    value: x.count,
  }));
  const categoryData: ChartDatum[] = (data.byCategory ?? []).map((x) => ({
    name: String(x._id),
    value: x.count,
  }));
  const severityData: ChartDatum[] = (data.bySeverity ?? []).map((x) => ({
    name: String(x._id),
    value: x.count,
  }));

  const hasData = statusData.length > 0 || categoryData.length > 0 || severityData.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3">
          <AdminChartSkeleton />
          <AdminChartSkeleton />
          <AdminChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-input bg-card p-6 sm:p-8 text-center">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 mb-4">
              <svg className="h-6 w-6 text-danger" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Unable to load analytics</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3">
          {['Reports by Status', 'Severity Distribution', 'Reports by Category'].map((title) => (
            <Card key={title} className="flex h-full flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col items-center justify-center py-10 text-center">
                <svg className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Insights into report volume, categories, and severity trends.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AdminChartCard title="Reports by Status" description="Distribution of reports across statuses">
          <ResponsiveContainer width="100%" height={320}>
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
          <ResponsiveContainer width="100%" height={320}>
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
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={60}
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
    </div>
  );
}
