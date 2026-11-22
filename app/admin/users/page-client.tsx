'use client';

export const dynamic = 'force-dynamic';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import {
  AdminStatsSkeleton,
  AdminUserTableSkeleton,
} from '@/components/admin/admin-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Search,
  User,
  Shield,
  Clock,
  ChevronRight,
  Eye,
  X,
  MoreVertical,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  division?: string;
  district?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  data: {
    items?: AdminUser[];
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
    users?: AdminUser[];
  };
}

const roleOptions = [
  { label: 'All Roles', value: '' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Moderator', value: 'MODERATOR' },
  { label: 'Citizen', value: 'CITIZEN' },
];

const roleMeta: Record<string, { label: string; className: string }> = {
  ADMIN: { label: 'Administrator', className: 'bg-primary/10 text-primary border-primary/20' },
  MODERATOR: { label: 'Moderator', className: 'bg-info/10 text-info border-info/20' },
  CITIZEN: { label: 'Citizen', className: 'bg-secondary/10 text-secondary-foreground border-secondary/20' },
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return 'Today';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function UserDetailsDialog({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const { toast } = useToast();
  const [isActive, setIsActive] = React.useState(user.isActive);
  const [role, setRole] = React.useState(user.role);

  const handleToggleActive = async () => {
    try {
      await api.patch(`/users/${user.id}`, { isActive: !isActive });
      setIsActive(!isActive);
      toast({
        title: 'Account updated',
        description: `${user.name} is now ${!isActive ? 'active' : 'suspended'}.`,
      });
    } catch {
      toast({
        variant: 'danger',
        title: 'Update failed',
        description: 'Could not update account status. Please try again.',
      });
    }
  };

  const handleRoleChange = async (nextRole: string) => {
    try {
      await api.patch(`/users/${user.id}`, { role: nextRole });
      setRole(nextRole);
      toast({
        title: 'Role updated',
        description: `${user.name} is now a ${roleMeta[nextRole]?.label ?? nextRole}.`,
      });
    } catch {
      setRole(user.role);
      toast({
        variant: 'danger',
        title: 'Update failed',
        description: 'Could not update user role. Please try again.',
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[560px] p-0">
        <DialogHeader className="px-6 py-4 flex items-center justify-between gap-4 border-b border-input">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold">User Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">User ID: {user.id}</DialogDescription>
          </div>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </DialogHeader>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="col-span-2 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={cn(roleMeta[role]?.className, 'gap-1')}>
                  <Shield className="h-3 w-3" />
                  {roleMeta[role]?.label ?? role}
                </Badge>
                {isActive ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="danger" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Suspended
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</p>
            <Select
              onValueChange={handleRoleChange}
              defaultValue={user.role}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Status</p>
            <button
              onClick={handleToggleActive}
              className={cn(
                'w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'border-input bg-background hover:bg-accent text-foreground'
                  : 'border-danger/20 bg-danger/10 hover:bg-danger/20 text-danger'
              )}
            >
              <span>{isActive ? 'Suspend Account' : 'Activate Account'}</span>
              {isActive ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            </button>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact &amp; Location</p>
            <div className="rounded-xl border border-input bg-background p-4 space-y-3">
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{user.phone}</span>
                </div>
              )}
              {user.division && (
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{user.division}</span>
                </div>
              )}
              {user.district && (
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{user.district}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground truncate">{user.address}</span>
                </div>
              )}
              {!user.phone && !user.division && !user.district && !user.address && (
                <p className="text-sm text-muted-foreground">No contact or location details on file.</p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamps</p>
            <div className="rounded-xl border border-input bg-background p-4 grid gap-2 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Registered</p>
                <p className="text-sm text-foreground font-mono">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm text-foreground font-mono">{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 border-t border-input">
          <DialogTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<UsersResponse>('/users', {
        params: {
          page,
          limit: pageSize,
          search: search || undefined,
          role: roleFilter || undefined,
          isActive: statusFilter === '' ? undefined : statusFilter === 'active',
        },
      });
      const data = res.data?.data ?? {};
      const items = data.items ?? data.users ?? [];
      setUsers(items);
      setTotal(data.total ?? items.length);
    } catch (err: any) {
      // If the users endpoint doesn't exist yet, show a graceful empty state.
      if (err?.response?.status === 404 || err?.code === 'ERR_NETWORK') {
        setUsers([]);
        setTotal(0);
        setError('User management requires a backend /users API endpoint. Contact the backend team to enable it.');
      } else {
        setError(err?.message ?? 'Failed to load users.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
        </div>
        <AdminStatsSkeleton />
        <AdminUserTableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage platform accounts, roles, and access.
          </p>
        </div>
      </motion.div>

      {error && (
        <Card className="rounded-2xl border border-input bg-warning/50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Backend API not available</h3>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden lg:flex"
      >
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{total}</p>
          </div>
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active</p>
            <p className="mt-1 text-2xl font-bold text-success">{users.filter((u) => u.isActive).length}</p>
          </div>
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admins</p>
            <p className="mt-1 text-2xl font-bold text-primary">{users.filter((u) => u.role === 'ADMIN').length}</p>
          </div>
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Moderators</p>
            <p className="mt-1 text-2xl font-bold text-info">{users.filter((u) => u.role === 'MODERATOR').length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-input bg-card shadow-elegant overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-input">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-input/50 hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Button
                            variant="link"
                            className="text-left font-medium text-foreground hover:underline truncate w-full"
                            onClick={() => setSelectedUser(user)}
                          >
                            {user.name}
                          </Button>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <Badge variant="outline" className={cn(roleMeta[user.role]?.className, 'gap-1')}>
                        <Shield className="h-3 w-3" />
                        {roleMeta[user.role]?.label ?? user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                        user.isActive
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-danger/10 text-danger border-danger/20'
                      )}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {formatRelativeTime(user.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <UserDetailsDialog user={user} onClose={() => setSelectedUser(null)} />
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" aria-label="More actions">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <User className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                      <h3 className="text-sm font-semibold text-foreground">No users found</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-input px-4 py-3 bg-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-px">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-l-xl"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-r-xl"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {selectedUser && (
        <UserDetailsDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
