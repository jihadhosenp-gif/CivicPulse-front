'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { RecentReports } from '@/components/dashboard/recent-reports';
import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { QuickReportButton } from '@/components/dashboard/quick-report-button';
import { NotificationPanel } from '@/components/dashboard/notification-panel';
import { DashboardPageSkeleton } from '@/components/dashboard/loading-skeletons';
import { fetchDashboardData, type DashboardData } from '@/services/dashboard';
import type { Notification } from '@/data/mock-dashboard';

export default function CitizenDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetchDashboardData()
      .then((result) => {
        if (active) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (isLoading || !data) {
    return <DashboardPageSkeleton />;
  }

  const { user, stats, reports, activities, notifications } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">Your civic activity at a glance</p>
        </div>
        <NotificationPanelWithState notifications={notifications} />
      </div>

      {/* Hero / welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full"
      >
        <WelcomeHeader user={user} stats={stats} />
      </motion.div>

      {/* Statistic cards */}
      <StatsGrid stats={stats} />

      {/* Reports + activity */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecentReports
            reports={reports}
            maxItems={5}
            onReportIssue={() => {}}
            onViewAll={() => {}}
            onViewReport={(report) => {}}
          />
        </div>
        <div className="lg:col-span-5">
          <ActivityTimeline
            activities={activities}
            maxItems={6}
            onViewAll={() => {}}
          />
        </div>
      </div>

      {/* Floating quick actions */}
      <QuickReportButton />
    </motion.div>
  );
}

function NotificationPanelWithState({ notifications: initial }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = React.useState<Notification[]>(initial);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleView = (notification: Notification) => {
    console.log('Open notification', notification.id);
  };

  return (
    <NotificationPanel
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkRead={handleMarkRead}
      onMarkAllRead={handleMarkAllRead}
      onViewNotification={handleView}
    />
  );
}
