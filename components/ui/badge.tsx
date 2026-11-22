import * as React from 'react';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-danger text-danger-foreground hover:bg-danger/90',
        outline:
          'border-input text-foreground hover:bg-accent hover:text-accent-foreground',
        success:
          'border-success/20 bg-success/10 text-success hover:bg-success/20',
        warning:
          'border-warning/20 bg-warning/10 text-warning hover:bg-warning/20',
        danger:
          'border-danger/20 bg-danger/10 text-danger hover:bg-danger/20',
        navy:
          'border-transparent bg-navy text-navy-foreground hover:bg-navy/90',
        accent:
          'border-accent/20 bg-accent/10 text-accent hover:bg-accent/20',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground',
        info:
          'border-info/20 bg-info/10 text-info hover:bg-info/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-[0.7rem]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';