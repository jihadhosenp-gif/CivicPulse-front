'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  /** Optional node rendered on the right of the label row (e.g. char counter). */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Consistent label / error / hint layout for form fields.
 * Renders a label with an optional required marker, the control, an optional
 * aside (e.g. character count), an inline error with an icon, and a hint line.
 */
export function Field({
  id,
  label,
  required = false,
  error,
  hint,
  aside,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-foreground"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {aside}
      </div>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs font-medium text-danger"
        >
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}