'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [reports, setReports] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/reports', { params: { page, limit: 10 } }).then((r) => {
      setReports(r.data.data.items || []);
    });
  }, [page]);

  const cards = [
    { label: 'Total Reports', value: reports.length },
    { label: 'Pending', value: reports.filter((r) => r.status === 'pending').length },
    { label: 'In Progress', value: reports.filter((r) => r.status === 'in_progress').length },
    { label: 'Resolved', value: reports.filter((r) => r.status === 'resolved').length },
    { label: 'Critical', value: reports.filter((r) => r.severity === 'critical').length },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card text-card-foreground border border-input shadow-elegant rounded-xl p-4">
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-card text-card-foreground border border-input shadow-elegant rounded-xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Title</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="py-2">{r.title}</td>
                <td>{r.status}</td>
                <td>{r.severity}</td>
                <td>{r.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
