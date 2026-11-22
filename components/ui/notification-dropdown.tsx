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
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
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
            <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-danger px-[6px] py-[2px] text-[10px] text-white border-2 border-background">
              <span className="px-[0.5px]">{unreadCount}</span>
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'w-80 border border-input bg-popover shadow-lg rounded-xl p-0',
          open ? 'animate-in fade-in slide-in-from-top-2 z-50' : 'hidden'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-input">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && onMarkAllRead ? (
            <button
              onClick={onMarkAllRead}
              className="text-xs font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Mark all as read
            </button>
          ) : null}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
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
                  'flex items-center gap-3 px-4 py-3 border-b border-input hover:bg-accent transition-colors cursor-pointer group',
                  !notification.read ? 'bg-primary/5' : ''
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    notificationColors[notification.type],
                    notification.read ? 'bg-[hsl(var(--border))]' : ''
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
                  <p className={cn('text-sm font-medium text-foreground', !notification.read ? 'font-semibold' : '')}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.description}
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground mt-0.5">
                    {notification.time}
                  </p>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
