import * as React from 'react';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-elegant hover:bg-indigo-600/90 hover:shadow-md',
        destructive:
          'bg-danger text-danger-foreground shadow-elegant hover:bg-red-600/90 hover:shadow-md',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-slate-200',
        ghost:
          'hover:bg-accent hover:text-foreground',
        soft:
          'bg-primary/10 text-primary hover:bg-primary/20',
        softDestructive:
          'bg-danger/10 text-danger hover:bg-danger/20',
        softSuccess:
          'bg-success/10 text-success hover:bg-success/20',
        navy:
          'bg-navy text-navy-foreground shadow-elegant hover:bg-slate-900 hover:shadow-md',
        accent:
          'bg-accent text-accent-foreground shadow-elegant hover:bg-cyan-500/90 hover:shadow-md',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-11 px-6 text-sm',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
        iconSm: 'h-9 w-9',
        iconLg: 'h-11 w-11',
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