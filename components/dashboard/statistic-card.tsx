'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: Tone;
  trend?: {
    value: number;
    label: string;
  };
  index?: number;
  variant?: 'default' | 'elevated';
  className?: string;
}

const toneStyles: Record<Tone, { iconWrap: string; iconColor: string; bar: string }> = {
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

export function StatisticCard({
  title,
  value,
  icon,
  tone = 'primary',
  trend,
  index = 0,
  variant = 'default',
  className,
}: StatisticCardProps) {
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
        'group relative overflow-hidden rounded-2xl border border-input bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
        variant === 'elevated' && 'shadow-elegant',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          {trend && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                isUp && 'text-success',
                isDown && 'text-danger',
                !hasTrend && 'text-muted-foreground'
              )}
            >
              {isUp && <TrendingUp className="h-3 w-3" />}
              {isDown && <TrendingDown className="h-3 w-3" />}
              {!hasTrend && <Minus className="h-3 w-3" />}
              <span>{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
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