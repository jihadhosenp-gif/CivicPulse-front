'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  FileText,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  ThumbsUp,
  UserPlus,
  Clock,
  MapPin,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityEvent } from '@/data/mock-dashboard';

const activityIcons: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-4 w-4" />,
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  MessageCircle: <MessageCircle className="h-4 w-4" />,
  ThumbsUp: <ThumbsUp className="h-4 w-4" />,
  UserPlus: <UserPlus className="h-4 w-4" />,
  Clock: <Clock className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  report_created: 'text-primary bg-primary/10',
  status_changed: 'text-warning bg-warning/10',
  comment_added: 'text-primary bg-primary/10',
  report_resolved: 'text-success bg-success/10',
  report_upvoted: 'text-success bg-success/10',
  assigned: 'text-info bg-info/10',
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface ActivityTimelineProps {
  activities: ActivityEvent[];
  isLoading?: boolean;
  maxItems?: number;
  onViewAll?: () => void;
}

export function ActivityTimeline({ 
  activities, 
  isLoading = false, 
  maxItems = 10,
  onViewAll 
}: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimelineSkeleton count={maxItems} />
        </CardContent>
      </Card>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            <Clock className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No activity yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Your activity will appear here as you report and track issues.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Timeline</CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-input/50" />
          
          <AnimatePresence mode="popLayout">
            {displayActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative flex gap-4 px-4 py-4 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background border border-input flex-shrink-0 z-10">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', activityColors[activity.type])}>
                    {activityIcons[activity.icon] || activityIcons.FileText}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                  
                  {activity.reportTitle && (
                    <button className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                      <MapPin className="h-3 w-3" />
                      View report: {activity.reportTitle}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {activities.length > maxItems && onViewAll && (
          <div className="mt-4 pt-4 border-t border-input text-center">
            <Button variant="ghost" size="sm" onClick={onViewAll} className="w-full">
              View {activities.length - maxItems} more activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityTimelineSkeleton({ count = 5 }: { count: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-3 w-3/4 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}