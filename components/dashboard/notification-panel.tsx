'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  MessageCircle,
  Clock,
  MapPin,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/data/mock-dashboard';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onViewNotification?: (notification: Notification) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const notificationIcons: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4" />,
  MessageCircle: <MessageCircle className="h-4 w-4" />,
  Clock: <Clock className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
};

const notificationColors: Record<Notification['type'], string> = {
  info: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onViewNotification,
  isOpen: controlledOpen,
  onOpenChange,
}: NotificationPanelProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full"
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.15, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop' }}
              className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-background"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 top-full z-50 mt-2 flex max-h-[80vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-input bg-popover text-popover-foreground shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-input px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger/10 px-1.5 text-xs font-semibold text-danger">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && onMarkAllRead && (
                  <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="h-7 text-xs text-primary">
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-7 w-7 text-muted-foreground"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60">
                    <Bell className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updates about your reports will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.2 }}
                    onClick={() => {
                      onViewNotification?.(notification);
                      if (!notification.read) onMarkRead?.(notification.id);
                    }}
                    className={cn(
                      'group relative flex cursor-pointer items-start gap-3 border-b border-input/60 px-4 py-3.5 transition-colors last:border-0 hover:bg-accent/60',
                      !notification.read && 'bg-primary/[0.04]'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
                        notificationColors[notification.type]
                      )}
                    >
                      {notificationIcons[notification.icon] ?? <Bell className="h-4 w-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm text-foreground',
                            notification.read ? 'font-medium' : 'font-semibold'
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="mt-1.5 text-[0.7rem] text-muted-foreground/80">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>

                    <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/0 transition-colors group-hover:text-primary" />
                  </motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center justify-between border-t border-input px-4 py-2.5 text-xs text-muted-foreground">
                <span>
                  {unreadCount} unread of {notifications.length} total
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                  View all
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}