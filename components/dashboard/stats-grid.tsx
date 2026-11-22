'use client';

import * as React from 'react';
import { FileText, Clock, Loader, CheckCircle } from 'lucide-react';
import { StatisticCard } from '@/components/dashboard/statistic-card';
import { StatCardSkeleton } from '@/components/dashboard/loading-skeletons';
import type { DashboardStats } from '@/data/mock-dashboard';

interface StatsGridProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Reports',
      value: stats.totalReports.toLocaleString(),
      icon: <FileText className="h-5 w-5" />,
      tone: 'primary' as const,
      trend: { value: stats.weeklyChange.total, label: `${stats.weeklyChange.total >= 0 ? '+' : ''}${stats.weeklyChange.total} this week` },
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports.toLocaleString(),
      icon: <Clock className="h-5 w-5" />,
      tone: 'warning' as const,
      trend: { value: stats.weeklyChange.pending, label: `${stats.weeklyChange.pending >= 0 ? '+' : ''}${stats.weeklyChange.pending} this week` },
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports.toLocaleString(),
      icon: <Loader className="h-5 w-5" />,
      tone: 'info' as const,
      trend: { value: stats.weeklyChange.inProgress, label: stats.weeklyChange.inProgress === 0 ? 'No change' : `${stats.weeklyChange.inProgress >= 0 ? '+' : ''}${stats.weeklyChange.inProgress} this week` },
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports.toLocaleString(),
      icon: <CheckCircle className="h-5 w-5" />,
      tone: 'success' as const,
      trend: { value: stats.weeklyChange.resolved, label: `${stats.weeklyChange.resolved >= 0 ? '+' : ''}${stats.weeklyChange.resolved} this week` },
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatisticCard key={card.title} index={index} {...card} />
      ))}
    </div>
  );
}