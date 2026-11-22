'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AdminChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function AdminChartCard({
  title,
  description,
  children,
  className,
  height = '90%',
}: AdminChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-2xl border border-input bg-card shadow-elegant',
        className
      )}
    >
      <Card className="border-0 bg-transparent p-0 shadow-none h-full">
        <CardHeader className="pb-3 px-0 pt-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent className="p-0 h-full">
          <div className="h-full" style={{ height }}>
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
