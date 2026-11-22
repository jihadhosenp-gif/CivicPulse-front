'use client';

export const dynamic = 'force-dynamic';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import {
  AdminStatsSkeleton,
  AdminIssueTableSkeleton,
} from '@/components/admin/admin-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  MapPin,
  FileText,
  ChevronRight,
  Eye,
  Clock,
  X,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
  under_review: 'Under Review',
};

const pageSize = 10;

const categoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Road Damage', value: 'Road Damage' },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'Environmental', value: 'Environmental' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Sanitation', value: 'Sanitation' },
  { label: 'Vandalism', value: 'Vandalism' },
];

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Under Review', value: 'under_review' },
];

const priorityOptions = [
  { label: 'All Priorities', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

interface ReportItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: string;
  priority: string;
  severity?: string;
  location?: {
    address: string;
    lat?: number;
    lng?: number;
    landmark?: string;
  };
  images?: string[];
  aiAnalysis?: {
    category?: string;
    confidence?: number;
    severity?: string;
  };
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface PaginatedResponse {
  data: {
    items: ReportItem[];
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

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

function IssueDetailsDialog({ report, onClose }: { report: ReportItem; onClose: () => void }) {
  const { toast } = useToast();
  const [status, setStatus] = React.useState(report.status);

  const handleStatusChange = async (nextStatus: string) => {
    setStatus(nextStatus);
    try {
      await api.patch(`/reports/${report._id}`, { status: nextStatus });
      toast({
        title: 'Status updated',
        description: `Report "${report.title}" is now ${statusLabels[nextStatus] ?? nextStatus}.`,
      });
    } catch (err: any) {
      setStatus(report.status);
      toast({
        variant: 'danger',
        title: 'Update failed',
        description: 'Could not update report status. Please try again.',
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] p-0">
        <DialogHeader className="px-6 py-4 flex items-center justify-between gap-4 border-b border-input">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold">Issue Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Report ID: {report._id}
            </DialogDescription>
          </div>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </DialogHeader>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground truncate">{report.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{report.category}{report.subcategory ? ` • ${report.subcategory}` : ''}</p>
              </div>
              <StatusBadge status={report.status as any} />
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <div className="rounded-xl border border-input bg-background p-4 text-sm leading-relaxed">
              {report.description}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Priority</p>
            <PriorityBadge priority={report.priority as any} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Select
              onValueChange={handleStatusChange}
              defaultValue={report.status}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {report.location && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <div className="flex items-start gap-3 rounded-xl border border-input bg-background p-4">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{report.location.address}</p>
                  {report.location.landmark && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{report.location.landmark}</p>
                  )}
                  {(report.location.lat != null || report.location.lng != null) && (
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                      {report.location.lat?.toFixed?.(4) ?? '-'}, {report.location.lng?.toFixed?.(4) ?? '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {report.images && report.images.length > 0 && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Images ({report.images.length})</p>
              <div className="flex flex-wrap gap-2">
                {report.images.slice(0, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Report image ${i + 1}`}
                    className="aspect-square w-20 h-20 rounded-xl object-cover border border-input"
                  />
                ))}
              </div>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Timestamps</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm text-foreground font-mono">{new Date(report.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="text-sm text-foreground font-mono">{new Date(report.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
          {report.assignedTo && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
              <div className="rounded-xl border border-input bg-background p-4">
                <p className="text-sm text-foreground">{report.assignedTo}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="px-6 py-4 border-t border-input">
          <DialogTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function IssueManagementPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<PaginatedResponse>('/reports', {
        params: {
          page,
          limit: pageSize,
          search: search || undefined,
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        },
      });
      const data = res.data?.data ?? {};
      setReports(data.items ?? []);
      setTotal(data.total ?? data.items?.length ?? 0);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load reports.');
      setReports([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const filteredCount = reports.length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Issue Management</h1>
        </div>
        <div className="rounded-2xl border border-input bg-card p-6 animate-pulse">
          <div className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        </div>
        <AdminIssueTableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-input bg-card p-6 sm:p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-danger mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Unable to load issues</h3>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button onClick={fetchReports} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Issue Management</h1>
          <p className="text-sm text-muted-foreground">
            Review, filter, and update status of community reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Toolbar: search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-input bg-card p-5 sm:p-6 shadow-elegant"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by title, location, description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="lg:col-span-1">
            <Select
              onValueChange={setCategoryFilter}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-1">
            <Select
              onValueChange={setStatusFilter}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-1">
            <Select
              onValueChange={setPriorityFilter}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filteredCount} of {total} reports
          </span>
          <div className="flex items-center gap-2">
            <span className="mr-2">Filters: </span>
            {(search || categoryFilter || statusFilter || priorityFilter) && (
              <Button variant="ghost" size="sm" onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setStatusFilter('');
                setPriorityFilter('');
              }}>
                Clear all <X className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-input bg-card shadow-elegant overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-input">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {reports.map((report) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-input/50 hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Button
                            variant="link"
                            className="text-left font-medium text-foreground hover:underline truncate w-full"
                            onClick={() => setSelectedReport(report)}
                          >
                            {report.title}
                          </Button>
                          <p className="text-xs text-muted-foreground truncate">{report.description.slice(0, 90)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {report.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground truncate max-w-[160px]">
                        <MapPin className="h-3 w-3" />
                        {report.location?.address ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={report.status as any} />
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <PriorityBadge priority={report.priority as any} />
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {formatRelativeTime(report.updatedAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="View details">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <IssueDetailsDialog report={report} onClose={() => setSelectedReport(null)} />
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" aria-label="More actions">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                      <h3 className="text-sm font-semibold text-foreground">No issues found</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-input px-4 py-3 bg-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-px">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-l-xl"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-r-xl"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {selectedReport && (
        <IssueDetailsDialog report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
