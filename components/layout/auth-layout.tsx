'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Mail, Phone, Shield, ArrowRight } from 'lucide-react';

interface AuthLayoutProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  brandName?: string;
  className?: string;
  children: React.ReactNode;
}

export function AuthLayout({
  title = 'Sign in',
  description,
  actionText,
  actionHref,
  brandName = 'CivicPulse AI',
  className,
  children,
}: AuthLayoutProps) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-elegant">
              <span className="text-sm font-bold tracking-tight">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              {brandName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-input shadow-lg p-8">
          {children}
        </div>

        {actionText && actionHref && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {actionText}{' '}
              <Link
                href={actionHref}
                className="font-medium text-primary hover:text-primary/90 transition-colors"
              >
                {actionText === "Don't have an account?" ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export interface AuthCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  className,
  children,
}: AuthCardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export interface AuthInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AuthInput({
  label,
  id,
  type = 'text',
  placeholder,
  icon,
  error,
  className,
  children,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
        {children}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error && 'border-danger',
            className
          )}
        />
      </div>
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
