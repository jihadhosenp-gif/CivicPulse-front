'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Brain,
  AlertTriangle,
  ListChecks,
  Languages,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Sparkles,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { ImageGallery } from '@/components/report/image-gallery';
import { CitizenLayout } from '@/components/layout/citizen-layout';
import { fetchReportById } from '@/services/dashboard';
import type { Report } from '@/data/mock-dashboard';

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const severityStyles: Record<string, { badge: string; ring: string; icon: React.ReactNode }> = {
  Low: {
    badge: 'bg-muted/10 text-muted border-muted/20',
    ring: 'ring-muted/30',
    icon: <CircleDot className="h-5 w-5" />,
  },
  Medium: {
    badge: 'bg-info/10 text-info border-info/20',
    ring: 'ring-info/30',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  High: {
    badge: 'bg-warning/10 text-warning border-warning/20',
    ring: 'ring-warning/30',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  Critical: {
    badge: 'bg-danger/10 text-danger border-danger/20',
    ring: 'ring-danger/30',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
};

/* ────────────────────────────────────────────────────────────────────────────
 * Info tile
 * ──────────────────────────────────────────────────────────────────────────── */

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

function InfoTile({ icon, label, children, className, iconClassName }: InfoTileProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-input bg-card p-4 transition-colors hover:bg-accent/40',
        className
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
          iconClassName
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-medium text-foreground break-words">{children}</div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * AI analysis card
 * ──────────────────────────────────────────────────────────────────────────── */

function AIAnalysisCard({ report }: { report: Report }) {
  const ai = report.aiAnalysis;
  const severityKey = ai?.severity ?? 'Low';
  const sev = severityStyles[severityKey] ?? severityStyles.Low;
  const confidence = ai ? Math.round((ai.confidence ?? 0) * 100) : 0;

  if (!ai) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            AI analysis is not available for this report yet. It will appear here once processed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Analysis
        </CardTitle>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Brain className="h-3 w-3" />
          {confidence}% confidence
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Severity + Priority row */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className={cn('flex items-center gap-3 rounded-lg border border-input bg-card p-4 ring-1', sev.ring)}>
            <div
              className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                sev.badge
              )}
            >
              {sev.icon}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                AI Severity
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{ai.severity}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-input bg-card p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                AI Priority
              </p>
              <div className="mt-0.5">
                <PriorityBadge priority={report.priority} />
              </div>
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Confidence</span>
            <span className="font-semibold text-foreground">{confidence}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-info"
            />
          </div>
        </div>

        {/* Bengali summary */}
        {ai.bengaliSummary && (
          <div className="rounded-lg border border-input bg-primary/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
              <Languages className="h-3.5 w-3.5" />
              AI Bengali Summary
            </p>
            <p className="text-sm leading-relaxed text-foreground">{ai.bengaliSummary}</p>
          </div>
        )}

        {/* Recommended action */}
        <div className="rounded-lg border border-input bg-success/5 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-success">
            <ListChecks className="h-3.5 w-3.5" />
            AI Recommended Action
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {recommendationFor(report)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function recommendationFor(report: Report): string {
  const severity = report.aiAnalysis?.severity?.toLowerCase();
  if (severity === 'critical') {
    return 'Dispatch an emergency response team immediately and cordon off the affected area to prevent injury. Notify relevant authorities and provide public safety advisories.';
  }
  if (severity === 'high') {
    return 'Prioritize this report for inspection within 24 hours. Assign a field team and schedule remediation as soon as resources allow.';
  }
  if (severity === 'medium') {
    return 'Schedule a routine inspection within 3 business days and add to the maintenance queue for the upcoming cycle.';
  }
  return 'Add to the standard maintenance backlog. No immediate action required; monitor for any escalation in severity.';
}

/* ────────────────────────────────────────────────────────────────────────────
 * Report timeline (derived from the report itself)
 * ──────────────────────────────────────────────────────────────────────────── */

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  variant: 'created' | 'status' | 'comment' | 'resolved' | 'rejected';
}

function buildTimeline(report: Report): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      id: `${report.id}-created`,
      title: 'Report submitted',
      description: `Submitted by citizen`,
      date: report.createdAt,
      variant: 'created',
    },
  ];

  if (report.assignedTo) {
    items.push({
      id: `${report.id}-assigned`,
      title: `Assigned to ${report.assignedTo}`,
      date: report.updatedAt,
      variant: 'status',
    });
  }

  report.comments.forEach((c) => {
    items.push({
      id: c.id,
      title: c.isOfficial ? 'Official update' : 'Comment added',
      description: `${c.userName}: ${c.content}`,
      date: c.createdAt,
      variant: 'comment',
    });
  });

  if (report.resolvedAt) {
    items.push({
      id: `${report.id}-resolved`,
      title: 'Report resolved',
      date: report.resolvedAt,
      variant: 'resolved',
    });
  }

  if (report.status === 'rejected') {
    items.push({
      id: `${report.id}-rejected`,
      title: 'Report rejected',
      date: report.updatedAt,
      variant: 'rejected',
    });
  }

  // Sort chronologically ascending for the timeline.
  return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const timelineStyles: Record<TimelineItem['variant'], { dot: string; icon: React.ReactNode; line: string }> = {
  created: { dot: 'bg-primary/10 text-primary', icon: <FileText className="h-4 w-4" />, line: 'bg-primary/30' },
  status: { dot: 'bg-warning/10 text-warning', icon: <RefreshCw className="h-4 w-4" />, line: 'bg-warning/30' },
  comment: { dot: 'bg-info/10 text-info', icon: <FileText className="h-4 w-4" />, line: 'bg-info/30' },
  resolved: { dot: 'bg-success/10 text-success', icon: <CheckCircle className="h-4 w-4" />, line: 'bg-success/30' },
  rejected: { dot: 'bg-danger/10 text-danger', icon: <XCircle className="h-4 w-4" />, line: 'bg-danger/30' },
};

function ReportTimeline({ report }: { report: Report }) {
  const items = React.useMemo(() => buildTimeline(report), [report]);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            <Clock className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No activity yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Activity will appear here as this report progresses.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative px-4 pb-4">
          <div className="absolute bottom-4 left-[2.1rem] top-2 w-0.5 bg-input/60" />
          <ul className="space-y-4">
            {items.map((item, index) => {
              const style = timelineStyles[item.variant];
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background',
                        style.dot
                      )}
                    >
                      {style.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatShortDate(item.date)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Loading skeleton
 * ──────────────────────────────────────────────────────────────────────────── */

function ReportDetailSkeleton() {
  return (
    <CitizenLayout>
      <div className="space-y-6 animate-pulse">
        <div className="h-9 w-40 rounded-lg bg-muted" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-input bg-card p-6">
              <div className="h-8 w-2/3 rounded bg-muted" />
              <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-lg bg-muted" />
              ))}
            </div>
            <div className="rounded-xl border border-input bg-card p-6">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-4/6 rounded bg-muted" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-input bg-card p-6">
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-input bg-card p-6">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 rounded bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Error state
 * ──────────────────────────────────────────────────────────────────────────── */

function ReportErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <CitizenLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
          <XCircle className="h-10 w-10 text-danger" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-foreground">Unable to load report</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => routerBackSafe()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    </CitizenLayout>
  );
}

function routerBackSafe() {
  if (typeof window !== 'undefined') window.history.back();
}

/* ────────────────────────────────────────────────────────────────────────────
 * Main page
 * ──────────────────────────────────────────────────────────────────────────── */

export default function ReportDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [report, setReport] = React.useState<Report | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [retryTick, setRetryTick] = React.useState(0);

  React.useEffect(() => {
    if (!id) {
      setError('No report id was provided.');
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);

    fetchReportById(id)
      .then((result) => {
        if (active) {
          setReport(result);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message =
            err instanceof Error ? err.message : 'Something went wrong while loading this report.';
          setError(message);
          setReport(null);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id, retryTick]);

  const handleRetry = () => setRetryTick((t) => t + 1);

  if (isLoading) {
    return <ReportDetailSkeleton />;
  }

  if (error) {
    return <ReportErrorState message={error} onRetry={handleRetry} />;
  }

  if (!report) {
    return (
      <CitizenLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/60">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">Report not found</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The report you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload
            </Button>
          </div>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout>
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
              <span className="text-xs font-medium text-muted-foreground">{report.id}</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {report.title}
            </h1>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-4 lg:col-span-2">
            {/* Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {report.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Images
                  {report.images.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({report.images.length})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGallery images={report.images} alt={report.title} />
              </CardContent>
            </Card>

            {/* AI analysis */}
            <AIAnalysisCard report={report} />

            {/* Timeline */}
            <ReportTimeline report={report} />
          </div>

          {/* Side column */}
          <div className="space-y-4">
            {/* Report details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoTile icon={<Tag className="h-5 w-5" />} label="Category">
                  {report.category}
                  {report.subcategory && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {report.subcategory}
                    </span>
                  )}
                </InfoTile>

                <InfoTile icon={<MapPin className="h-5 w-5" />} label="Location">
                  {report.location.address}
                  {report.location.landmark && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {report.location.landmark}
                    </span>
                  )}
                </InfoTile>

                <InfoTile
                  icon={<CircleDot className="h-5 w-5" />}
                  label="Report Status"
                  iconClassName="bg-primary/10 text-primary"
                >
                  <StatusBadge status={report.status} />
                </InfoTile>

                <InfoTile
                  icon={<Calendar className="h-5 w-5" />}
                  label="Submission Date"
                  iconClassName="bg-info/10 text-info"
                >
                  {formatDate(report.createdAt)}
                </InfoTile>

                {report.resolvedAt && (
                  <InfoTile
                    icon={<CheckCircle className="h-5 w-5" />}
                    label="Resolved On"
                    iconClassName="bg-success/10 text-success"
                  >
                    {formatDate(report.resolvedAt)}
                  </InfoTile>
                )}

                <InfoTile
                  icon={<Clock className="h-5 w-5" />}
                  label="Last Updated"
                  iconClassName="bg-warning/10 text-warning"
                >
                  {formatDate(report.updatedAt)}
                </InfoTile>
              </CardContent>
            </Card>

            {/* Mini status summary */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">At a Glance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge status={report.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <PriorityBadge priority={report.priority} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Severity</span>
                  <span className="text-sm font-semibold text-foreground">
                    {report.aiAnalysis?.severity ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-sm font-semibold text-foreground">
                    {report.aiAnalysis
                      ? `${Math.round(report.aiAnalysis.confidence * 100)}%`
                      : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}