'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, ReadOnlyBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUsers } from '@/lib/mock-data';
import { UserPlus, MoreHorizontal, Mail, Crown, Eye, Edit3, Shield, ShieldCheck, Settings2, FolderKanban, Code2, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlanXRole } from '@/lib/types';

const roleConfig: Record<PlanXRole, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  super_admin: { label: 'Super Admin', className: 'bg-red-500/10 text-red-400 border-0', icon: ShieldCheck },
  admin: { label: 'Admin', className: 'bg-cyan-500/10 text-cyan-400 border-0', icon: Settings2 },
  manager: { label: 'Manager', className: 'bg-blue-500/10 text-blue-400 border-0', icon: FolderKanban },
  developer: { label: 'Developer', className: 'bg-green-500/10 text-green-400 border-0', icon: Code2 },
  qa: { label: 'QA / Tester', className: 'bg-orange-500/10 text-orange-400 border-0', icon: Bug },
  viewer: { label: 'Viewer', className: 'bg-slate-500/10 text-slate-400 border-0', icon: Eye },
};

export default function TeamPage() {
  const { can } = useAppStore();

  if (!can('team.view')) {
    return <AppLayout title="Team"><AccessDenied feature="Team Members" /></AppLayout>;
  }

  return (
    <AppLayout title="Team Members">
      <div className="p-6 max-w-[800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground">{mockUsers.length} members in this workspace</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5" disabled={!can('team.invite')}>
            <UserPlus className="w-3.5 h-3.5" />
            Invite Member
          </Button>
        </div>

        {/* Invite Banner */}
        {can('team.invite') && (
        <Card className="mb-4 border-dashed">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Invite by email</p>
            <div className="flex gap-2">
              <Input placeholder="colleague@company.com" className="h-9 text-sm flex-1" />
              <Select defaultValue="developer">
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="text-xs gap-1">
                <Mail className="w-3.5 h-3.5" /> Send invite
              </Button>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Members List */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            {mockUsers.map((user, i) => {
              const config = roleConfig[user.role];
              const RoleIcon = config.icon;
              return (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-sm bg-blue-500/20 text-blue-400 font-semibold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{user.name}</span>
                      {i === 0 && <span className="text-xs text-muted-foreground">(you)</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Badge className={cn('text-xs gap-1', config.className)}>
                    <RoleIcon className="w-2.5 h-2.5" />
                    {config.label}
                  </Badge>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
