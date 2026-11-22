'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  AlertCircle,
  Activity,
} from 'lucide-react';

type StatTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  tone?: StatTone;
  trend?: {
    value: number;
    label: string;
  };
  index?: number;
  className?: string;
}

const toneStyles: Record<StatTone, { iconWrap: string; iconColor: string; bar: string }> = {
  primary: {
    iconWrap: 'bg-primary/10',
    iconColor: 'text-primary',
    bar: 'bg-primary',
  },
  success: {
    iconWrap: 'bg-success/10',
    iconColor: 'text-success',
    bar: 'bg-success',
  },
  warning: {
    iconWrap: 'bg-warning/10',
    iconColor: 'text-warning',
    bar: 'bg-warning',
  },
  danger: {
    iconWrap: 'bg-danger/10',
    iconColor: 'text-danger',
    bar: 'bg-danger',
  },
  info: {
    iconWrap: 'bg-info/10',
    iconColor: 'text-info',
    bar: 'bg-info',
  },
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'primary',
  trend,
  index = 0,
  className,
}: AdminStatCardProps) {
  const styles = toneStyles[tone];
  const isUp = (trend?.value ?? 0) > 0;
  const isDown = (trend?.value ?? 0) < 0;
  const hasTrend = trend && trend.value !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-input bg-card p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          <div className="mt-3 flex items-baseline gap-1">
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          {trend && (
            <div
              className={cn(
                'mt-3 inline-flex items-center gap-1.5 text-xs font-medium',
                isUp && 'text-success',
                isDown && 'text-danger',
                !hasTrend && 'text-muted-foreground'
              )}
            >
              {isUp && <Activity className="h-3 w-3" />}
              {isDown && <Activity className="h-3 w-3" />}
              {!hasTrend && <span className="h-3 w-3" />}
              <span>{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
            styles.iconWrap
          )}
        >
          <span className={cn('flex items-center justify-center', styles.iconColor)}>{icon}</span>
        </div>
      </div>

      {hasTrend && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100',
            isUp ? styles.bar : isDown ? 'bg-danger' : 'bg-muted'
          )}
        />
      )}
    </motion.div>
  );
}

export interface AdminStatsGridProps {
  stats: {
    totalReports: number;
    pendingReports: number;
    inProgressReports: number;
    resolvedReports: number;
    totalUsers: number;
    resolutionRate: number;
  };
  weeklyChange?: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

export function AdminStatsGrid({ stats, weeklyChange }: AdminStatsGridProps) {
  const cards = [
    {
      title: 'Total Reports',
      value: stats.totalReports.toLocaleString(),
      subtitle: 'All time',
      icon: <FileText className="h-5 w-5" />,
      tone: 'primary' as const,
      trend: weeklyChange
        ? {
            value: weeklyChange.total,
            label: `${weeklyChange.total >= 0 ? '+' : ''}${weeklyChange.total} this week`,
          }
        : undefined,
    },
    {
      title: 'Pending',
      value: stats.pendingReports.toLocaleString(),
      subtitle: 'Awaiting review',
      icon: <Clock className="h-5 w-5" />,
      tone: 'warning' as const,
      trend: weeklyChange
        ? {
            value: weeklyChange.pending,
            label: `${weeklyChange.pending >= 0 ? '+' : ''}${weeklyChange.pending} this week`,
          }
        : undefined,
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports.toLocaleString(),
      subtitle: 'Being handled',
      icon: <AlertCircle className="h-5 w-5" />,
      tone: 'info' as const,
      trend: weeklyChange
        ? {
            value: weeklyChange.inProgress,
            label:
              weeklyChange.inProgress === 0
                ? 'No change'
                : `${weeklyChange.inProgress >= 0 ? '+' : ''}${weeklyChange.inProgress} this week`,
          }
        : undefined,
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports.toLocaleString(),
      subtitle: 'Closed cases',
      icon: <CheckCircle className="h-5 w-5" />,
      tone: 'success' as const,
      trend: weeklyChange
        ? {
            value: weeklyChange.resolved,
            label: `${weeklyChange.resolved >= 0 ? '+' : ''}${weeklyChange.resolved} this week`,
          }
        : undefined,
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers.toLocaleString(),
      subtitle: 'Platform accounts',
      icon: <Users className="h-5 w-5" />,
      tone: 'primary' as const,
    },
    {
      title: 'Resolution Rate',
      value: `${stats.resolutionRate.toFixed(1)}%`,
      subtitle: 'Resolved / total',
      icon: <Activity className="h-5 w-5" />,
      tone: 'success' as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, index) => (
        <AdminStatCard key={card.title} index={index} {...card} />
      ))}
    </div>
  );
}
