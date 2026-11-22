'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { MapPin, Clock, FileText, MoreVertical, Eye, Download, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Report, ReportStatus, statusColors, statusLabels, priorityColors, priorityLabels } from '@/data/mock-dashboard';

interface ReportsTableProps {
  reports: Report[];
  isLoading?: boolean;
  onViewReport?: (report: Report) => void;
  onReportIssue?: () => void;
  emptyStateMessage?: string;
}

export function ReportsTable({ 
  reports, 
  isLoading = false, 
  onViewReport, 
  onReportIssue,
  emptyStateMessage = 'No reports found. Start by reporting an issue in your area.'
}: ReportsTableProps) {
  const getStatusColor = (status: ReportStatus) => statusColors[status];
  const getStatusLabel = (status: ReportStatus) => statusLabels[status];
  const getPriorityColor = (priority: string) => priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium;
  const getPriorityLabel = (priority: string) => priorityLabels[priority as keyof typeof priorityLabels] || priority;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsTableSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No reports yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">{emptyStateMessage}</p>
          <Button onClick={onReportIssue} className="mt-6 gap-2">
            <MapPin className="h-4 w-4" />
            Report Your First Issue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reports</CardTitle>
        <Button variant="ghost" size="sm" onClick={onReportIssue}>
          <MapPin className="h-4 w-4 mr-1" />
          New Report
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-input">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="border-b border-input/50 hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <button
                          onClick={() => onViewReport?.(report)}
                          className="flex items-center gap-3 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg p-1 hover:bg-accent transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{report.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{report.description.slice(0, 80)}...</p>
                          </div>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {report.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {report.location.address}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={cn(getStatusColor(report.status), 'gap-1')}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {getStatusLabel(report.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <Badge variant="outline" className={cn(getPriorityColor(report.priority), 'gap-1')}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {getPriorityLabel(report.priority)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(report.updatedAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onViewReport?.(report)} className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-danger">
                            <Flag className="h-4 w-4" />
                            Flag for Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportsTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
          <div className="h-6 w-24 bg-muted rounded hidden md:block" />
          <div className="h-6 w-20 bg-muted rounded hidden lg:block" />
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded hidden lg:block" />
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}