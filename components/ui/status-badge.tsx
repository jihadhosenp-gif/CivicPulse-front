import * as React from 'react';
import { cn } from '@/utils/cn';
import type { ReportStatus, ReportPriority } from '@/data/mock-dashboard';

const statusMeta: Record<ReportStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  in_progress: { label: 'In Progress', className: 'bg-primary/10 text-primary border-primary/20' },
  resolved: { label: 'Resolved', className: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejected', className: 'bg-danger/10 text-danger border-danger/20' },
  under_review: { label: 'Under Review', className: 'bg-info/10 text-info border-info/20' },
};

const priorityMeta: Record<ReportPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted/10 text-muted border-muted/20' },
  medium: { label: 'Medium', className: 'bg-primary/10 text-primary border-primary/20' },
  high: { label: 'High', className: 'bg-warning/10 text-warning border-warning/20' },
  critical: { label: 'Critical', className: 'bg-danger/10 text-danger border-danger/20' },
};

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        meta.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: ReportPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const meta = priorityMeta[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        meta.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}