'use client';

import * as React from 'react';
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

type Align = 'start' | 'center' | 'end';
type Side = 'top' | 'bottom';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerChildProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  children?: React.ReactNode;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'menu';
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');

  if (!React.isValidElement<DropdownMenuTriggerChildProps>(children)) {
    return null;
  }

  const child = children;

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    child.props.onClick?.(event);
    if (!event.defaultPrevented) {
      context.setOpen(!context.open);
    }
  };

  if (asChild) {
    return React.cloneElement(child, {
      onClick: handleClick,
      'aria-expanded': context.open,
      'aria-haspopup': 'menu',
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={context.open}
      aria-haspopup="menu"
      className={cn(child.props.className)}
    >
      {child.props.children}
    </button>
  );
}

type DropdownMenuContentProps = HTMLMotionProps<'div'> & {
  align?: Align;
  side?: Side;
  sideOffset?: number;
};

export function DropdownMenuContent({
  className,
  align = 'end',
  side = 'bottom',
  sideOffset = 8,
  children,
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuContent must be used within a DropdownMenu');

  const alignmentClass =
    align === 'start' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0';
  const sideClass = side === 'top' ? 'bottom-full' : 'top-full';

  React.useEffect(() => {
    if (!context.open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-dropdown-root]')) return;
      context.setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') context.setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [context]);

  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          data-dropdown-root
          role="menu"
          initial={{ opacity: 0, scale: 0.96, y: side === 'top' ? sideOffset : -sideOffset }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: side === 'top' ? sideOffset : -sideOffset }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: side === 'bottom' ? sideOffset : undefined, marginBottom: side === 'top' ? sideOffset : undefined }}
          className={cn(
            'absolute z-50 min-w-[10rem] overflow-hidden rounded-xl border border-input bg-popover p-1.5 text-popover-foreground shadow-lg',
            alignmentClass,
            sideClass,
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  destructive?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, inset, destructive, children, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        onClick={(event) => {
          props.onClick?.(event);
          if (!event.defaultPrevented) context?.setOpen(false);
        }}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors',
          'focus-visible:bg-accent focus-visible:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          inset && 'pl-8',
          destructive ? 'text-danger hover:bg-danger/10' : 'text-foreground hover:bg-accent',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('-mx-1 my-1 h-px bg-input', className)} />;
}

export function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('px-3 py-1.5 text-xs font-semibold text-muted-foreground', className)}>
      {children}
    </div>
  );
}

export function DropdownMenuShortcut({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn('ml-auto text-xs text-muted-foreground', className)}>
      {children}
    </span>
  );
}