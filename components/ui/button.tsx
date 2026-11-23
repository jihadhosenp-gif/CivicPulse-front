import * as React from 'react';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[9px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'h-[44px] px-4 bg-accent text-accent-foreground shadow-elegant hover:bg-accent-hover hover:shadow-md',
        destructive:
          'h-[44px] px-4 bg-danger text-danger-foreground shadow-elegant hover:bg-danger/90 hover:shadow-md',
        outline:
          'h-[44px] px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'h-[44px] px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'h-[44px] px-4 hover:bg-accent hover:text-foreground',
        soft:
          'h-[44px] px-4 bg-primary/10 text-primary hover:bg-primary/20',
        softDestructive:
          'h-[44px] px-4 bg-danger/10 text-danger hover:bg-danger/20',
        softSuccess:
          'h-[44px] px-4 bg-success/10 text-success hover:bg-success/20',
        navy:
          'h-[44px] px-4 bg-navy text-navy-foreground shadow-elegant hover:bg-navy/90 hover:shadow-md',
        accent:
          'h-[44px] px-4 bg-accent text-accent-foreground shadow-elegant hover:bg-accent-hover hover:shadow-md',
        link:
          'h-[44px] px-4 text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-[44px] px-4 text-sm',
        lg: 'h-11 px-6 text-sm',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 rounded-[9px]',
        iconSm: 'h-9 w-9 rounded-[9px]',
        iconLg: 'h-11 w-11 rounded-[9px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';