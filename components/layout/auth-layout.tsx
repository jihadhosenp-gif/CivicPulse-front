'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Mail, Shield, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    <div className={cn('relative min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle showLabel={false} />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-lg">
              <span className="text-sm font-bold tracking-tight">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              {brandName}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              {description}
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-[14px] border border-input shadow-xl p-8 sm:p-10"
        >
          {children}
        </motion.div>

        {actionText && actionHref && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              {actionText}{' '}
              <Link
                href={actionHref}
                className="font-medium text-primary hover:text-primary/90 transition-colors"
              >
                {actionText === "Don't have an account?" ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </motion.div>
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
            'flex h-10 w-full rounded-[9px] border border-input bg-background px-4 py-2.5 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error && 'border-danger',
            className
          )}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-danger">{error}</p>
      )}
    </div>
  );
}
