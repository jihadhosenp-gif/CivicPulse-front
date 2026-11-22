'use client';

import * as React from 'react';
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
 * Renders label with required marker, the control, an optional aside (e.g.
 * character count), an inline error, and a hint line.
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
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}