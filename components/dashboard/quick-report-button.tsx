'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { MapPin, Plus, X, Camera, Map } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
  color?: string;
  bgColor?: string;
}

interface QuickReportButtonProps {
  actions?: QuickAction[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    label: 'Report an Issue',
    icon: <MapPin className="h-5 w-5" />,
    onClick: () => {},
    shortcut: 'Cmd+Shift+R',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Photo Report',
    icon: <Camera className="h-5 w-5" />,
    onClick: () => {},
    shortcut: 'Cmd+Shift+P',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    label: 'Map Report',
    icon: <Map className="h-5 w-5" />,
    onClick: () => {},
    shortcut: 'Cmd+Shift+M',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

// All quick-report actions open the report submission form; the specific
// intent (photo/map) can be layered on later via query params.

export function QuickReportButton({
  actions = defaultActions, 
  position = 'bottom-right',
  className 
}: QuickReportButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const navigateToReport = () => router.push('/report/new');

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  const menuPositionClasses = {
    'bottom-right': 'bottom-full right-0 mb-3',
    'bottom-left': 'bottom-full left-0 mb-3',
    'top-right': 'top-full right-0 mt-3',
    'top-left': 'top-full left-0 mt-3',
  };

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn('z-50', positionClasses[position], className)}>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/30 backdrop-blur-sm" 
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn('absolute flex flex-col-reverse gap-2', menuPositionClasses[position])}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 20 : -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 20 : -20 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => { navigateToReport(); handleClose(); }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg border border-input bg-card',
                  'hover:shadow-xl transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  position.includes('right') ? 'text-right' : 'text-left'
                )}
              >
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-lg font-medium', action.bgColor, action.color)}>
                  {action.icon}
                </span>
                <div className={cn('flex flex-col', position.includes('right') ? 'items-end' : 'items-start')}>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                  {action.shortcut && (
                    <span className="text-xs text-muted-foreground font-mono">{action.shortcut}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg',
          'hover:shadow-xl transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isOpen && 'rotate-45'
        )}
        aria-label="Quick actions"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -45, opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 10 : -10 }}
            className={cn(
              'absolute bottom-full right-0 mb-2 rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-lg whitespace-nowrap',
              'pointer-events-none'
            )}
          >
            Quick Actions
            <div className="absolute bottom-[-4px] right-4 h-0 w-0 border-4 border-transparent border-t-popover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}