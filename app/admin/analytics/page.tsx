'use client';
import { useEffect, useState } from 'react';
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

const severityColors = [
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--danger))',
  'hsl(var(--primary))',
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

const chartCard =
  'bg-card text-card-foreground border border-input shadow-elegant rounded-xl p-4 h-80';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary>({});
  useEffect(() => {
    api
      .get<{ data: AnalyticsSummary }>('/analytics/summary')
      .then((r) => setData(r.data?.data ?? {}));
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className={chartCard}>
          <h2 className="font-semibold mb-2">Reports by Status</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={chartCard}>
          <h2 className="font-semibold mb-2">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {severityData.map((_, i) => (
                  <Cell key={i} fill={severityColors[i % severityColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--foreground))' }} />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={chartCard}>
        <h2 className="font-semibold mb-2">Reports by Category</h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="value" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
