'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/utils/cn';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  XCircle,
  MessageCircle,
} from 'lucide-react';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = DialogPrimitive.Content;

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  time: string;
  read: boolean;
  href?: string;
  icon?: React.ReactNode;
}

const notificationColors: Record<NotificationItem['type'], string> = {
  info: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
};

const notificationIcons: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  Clock: <Clock className="h-4 w-4" />,
  MessageCircle: <MessageCircle className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
};

interface NotificationDropdownProps {
  notifications?: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  className?: string;
  trigger?: React.ReactNode;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Report resolved',
    description: 'Your report about pothole on Main St has been resolved.',
    type: 'success',
    time: '2 hours ago',
    read: false,
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: '2',
    title: 'New comment on your report',
    description: 'Admin added a comment to your waterlogging report.',
    type: 'info',
    time: '5 hours ago',
    read: true,
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: '3',
    title: 'Streetlight outage',
    description: 'A new streetlight outage was reported near your area.',
    type: 'warning',
    time: '1 day ago',
    read: true,
    icon: <AlertCircle className="h-4 w-4" />,
  },
];

export function NotificationDropdown({
  notifications = defaultNotifications,
  onMarkRead,
  onMarkAllRead,
  className,
  trigger,
}: NotificationDropdownProps = {}) {
  const [open, setOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    onMarkRead?.(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'relative inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            className
          )}
          aria-label="Notifications"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'w-80 border border-input bg-popover shadow-lg rounded-2xl p-0',
          open ? 'animate-in fade-in slide-in-from-top-2 z-50' : 'hidden'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-input">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger/10 px-1.5 text-xs font-semibold text-danger">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && onMarkAllRead ? (
              <button
                onClick={onMarkAllRead}
                className="text-xs font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Mark all read
              </button>
            ) : null}
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 hover:bg-accent transition-colors"
              aria-label="Close notifications"
            >
              <ArrowRight className="h-4 w-4 rotate-90" />
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.read) handleMarkRead(notification.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 border-b border-input/60 hover:bg-accent/60 transition-colors cursor-pointer group',
                  !notification.read && 'bg-primary/5'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    notificationColors[notification.type],
                    notification.read && 'bg-muted/50'
                  )}
                >
                  {notification.icon ?? (
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full text-xs font-semibold',
                        notificationColors[notification.type]
                      )}
                    >
                      {notification.title.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm text-foreground', !notification.read ? 'font-semibold' : 'font-medium')}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.description}
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground/80 mt-0.5">
                    {notification.time}
                  </p>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center justify-between border-t border-input px-4 py-2.5 text-xs text-muted-foreground">
            <span>
              {unreadCount} unread of {notifications.length} total
            </span>
            <button className="text-xs font-medium text-primary hover:text-primary/90">
              View all
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}