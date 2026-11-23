'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, MapPin, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface WelcomeHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
    reportsCount: number;
    joinedAt: string;
  };
  stats?: {
    resolutionRate: number;
    avgResponseTime: string;
  };
}

export function WelcomeHeader({ user, stats }: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[14px] border border-input bg-card p-6 sm:p-8 shadow-sm"
    >
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <Target className="h-3 w-3" />
          <span>{stats?.resolutionRate ?? 85}% Resolution Rate</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
          <Award className="h-3 w-3" />
          <span>{stats?.avgResponseTime ?? '4.2h'} Avg Response</span>
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user.reportsCount} reports submitted since {new Date(user.joinedAt).getFullYear()}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-[9px] h-[44px]">
            <MapPin className="h-4 w-4" />
            <span>Report an Issue</span>
          </Button>
          <Button className="w-full sm:w-auto gap-2 rounded-[9px] h-[44px]">
            <Target className="h-4 w-4" />
            <span>Quick Report</span>
          </Button>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-4 pt-6 border-t border-input/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sun className="h-4 w-4 text-warning" />
          <span>Active today</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Moon className="h-4 w-4 text-primary" />
          <span>Dark mode ready</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Location enabled</span>
        </div>
      </div>
    </motion.div>
  );
}
