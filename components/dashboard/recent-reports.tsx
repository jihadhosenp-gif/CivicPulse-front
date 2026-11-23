'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  ChevronRight,
  FileText,
  MapPinned,
  Building2,
  Leaf,
  Droplet,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { ReportsTableSkeleton } from '@/components/dashboard/loading-skeletons';
import type { Report } from '@/data/mock-dashboard';

const categoryIcons: Record<string, React.ReactNode> = {
  'Road Damage': <MapPinned className="h-5 w-5" />,
  Infrastructure: <Building2 className="h-5 w-5" />,
  Environmental: <Leaf className="h-5 w-5" />,
  Utilities: <Droplet className="h-5 w-5" />,
  Sanitation: <Trash2 className="h-5 w-5" />,
  Vandalism: <Sparkles className="h-5 w-5" />,
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

interface RecentReportsProps {
  reports: Report[];
  isLoading?: boolean;
  maxItems?: number;
  onViewReport?: (report: Report) => void;
  onViewAll?: () => void;
  onReportIssue?: () => void;
}

export function RecentReports({
  reports,
  isLoading = false,
  maxItems = 5,
  onViewReport,
  onViewAll,
  onReportIssue,
}: RecentReportsProps) {
  const displayReports = reports.slice(0, maxItems);

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Recent Reports</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1 text-muted-foreground hover:text-foreground">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ReportsTableSkeleton rows={4} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Recent Reports</CardTitle>
          {reports.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
              {reports.length}
            </span>
          )}
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1 text-muted-foreground hover:text-foreground">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {displayReports.length === 0 ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary/15 to-primary/5"
          >
            <FileText className="h-9 w-9 text-primary" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-input">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          </motion.div>
          <h3 className="text-lg font-semibold text-foreground">No reports yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t reported any issues. Spot a problem in your neighborhood? Let your
            community know.
          </p>
          {onReportIssue && (
            <Button onClick={onReportIssue} className="mt-6 gap-2 rounded-[9px] h-[44px]">
              <MapPin className="h-4 w-4" />
              Report Your First Issue
            </Button>
          )}
        </CardContent>
      ) : (
        <CardContent className="flex-1 p-0">
          <div className="divide-y divide-input/60">
            {displayReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onViewReport?.(report)}
                className={cn(
                  'group flex w-full cursor-pointer items-center gap-4 px-6 py-4 text-left transition-colors last:border-0 hover:bg-accent/50',
                  'rounded-none'
                )}
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  {categoryIcons[report.category] ?? <FileText className="h-5 w-5" />}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-foreground">{report.title}</p>
                    <StatusBadge status={report.status} />
                    <span className="hidden sm:inline-flex">
                      <PriorityBadge priority={report.priority} />
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {report.category}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{report.location.address}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(report.updatedAt)}
                    </span>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
