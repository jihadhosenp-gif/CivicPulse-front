import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/utils/cn';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetPortal = SheetPrimitive.Portal;

const SheetClose = SheetPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: 'left' | 'right' | 'top' | 'bottom' }
>(({ className, side = 'right', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 grid w-full max-w-[380px] translate-y-0 data-[state=closed]:duration-300 data-[state=open]:duration-500 border border-input bg-popover shadow-lg duration-200 data-[side=bottom]:animate-in data-[side=bottom]:slide-in-from-bottom-2 data-[side=bottom]:slide-out-to-bottom-2 data-[side=left]:animate-in data-[side=left]:slide-in-from-left-2 data-[side=left]:slide-out-to-left-2 data-[side=right]:animate-in data-[side=right]:slide-in-from-right-2 data-[side=right]:slide-out-to-right-2 data-[side=top]:animate-in data-[side=top]:slide-in-from-top-2 data-[side=top]:slide-out-to-top-2 sm:rounded-xl',
        side === 'right'
          ? 'right-0 top-0 bottom-0 translate-x-0 sm:translate-x-0 sm:rounded-none sm:border-l sm:shadow-xl'
          : side === 'left'
          ? 'left-0 top-0 bottom-0 translate-x-0 sm:translate-x-0 sm:rounded-none sm:border-r sm:shadow-xl'
          : side === 'top'
          ? 'top-0 left-0 right-0 translate-y-0 sm:translate-y-0 sm:rounded-none sm:border-b sm:shadow-xl'
          : 'bottom-0 left-0 right-0 translate-y-0 sm:translate-y-0 sm:rounded-none sm:border-t sm:shadow-xl',
        className
      )}
      {...props}
    />
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-input',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground tracking-tight', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetClose,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};