'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/services/api';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    api.get('/analytics/summary').then((r) => setData(r.data.data));
  }, []);

  const statusData = (data.byStatus || []).map((x: any) => ({ name: x._id, value: x.count }));
  const categoryData = (data.byCategory || []).map((x: any) => ({ name: String(x._id), value: x.count }));
  const severityData = (data.bySeverity || []).map((x: any) => ({ name: x._id, value: x.count }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4 h-80">
          <h2 className="font-semibold mb-2">Reports by Status</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow rounded p-4 h-80">
          <h2 className="font-semibold mb-2">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" outerRadius={100}>
                {severityData.map((_: any, i: number) => <Cell key={i} fill={['#22c55e','#eab308','#f97316','#ef4444'][i % 4]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white shadow rounded p-4 h-80">
        <h2 className="font-semibold mb-2">Reports by Category</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
