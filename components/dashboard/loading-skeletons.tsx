'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-muted',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{ width, height }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-input bg-card p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" variant="circular" />
      </div>
    </div>
  );
}

export function ReportsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-lg" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
<Skeleton className="h-6 w-24 hidden md:block" variant="rectangular" />
          <Skeleton className="h-6 w-20 hidden lg:block" variant="rectangular" />
          <Skeleton className="h-5 w-16 hidden lg:block" variant="rectangular" />
          <Skeleton className="h-4 w-20" variant="rectangular" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ActivityTimelineSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4">
          <Skeleton className="h-10 w-10 rounded-full" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WelcomeHeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-input bg-card p-6 sm:p-8 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" variant="circular" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-10 w-32" variant="rectangular" />
        <Skeleton className="h-10 w-32" variant="rectangular" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4">
          <Skeleton className="h-10 w-10 rounded-lg" variant="circular" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-2 w-2 rounded-full" variant="circular" />
            </div>
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Header */}
      <WelcomeHeaderSkeleton />
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Reports Table & Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-4 lg:col-span-4">
          <ReportsTableSkeleton rows={5} />
        </div>
        <div className="md:col-span-3 lg:col-span-3">
          <ActivityTimelineSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}