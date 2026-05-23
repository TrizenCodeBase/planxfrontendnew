'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Calendar, CheckCircle2, Clock, AlertCircle, GitCommit, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const releases = [
  { id: 'r1', name: 'v3.2.0', status: 'released', date: '2026-05-20', issues: 24, bugs: 3, features: 8, commits: 47 },
  { id: 'r2', name: 'v3.2.1', status: 'in_progress', date: '2026-05-28', issues: 12, bugs: 5, features: 2, commits: 18 },
  { id: 'r3', name: 'v3.3.0', status: 'planning', date: '2026-06-15', issues: 0, bugs: 0, features: 0, commits: 0 },
  { id: 'r4', name: 'v3.1.4', status: 'released', date: '2026-05-10', issues: 8, bugs: 6, features: 0, commits: 12 },
  { id: 'r5', name: 'v3.1.3', status: 'released', date: '2026-04-28', issues: 15, bugs: 9, features: 1, commits: 23 },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  released: { label: 'Released', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500', icon: Clock },
  planning: { label: 'Planning', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
};

export default function ReleasesPage() {
  const { can } = useAppStore();

  if (!can('releases.manage')) {
    return <AppLayout title="Releases"><AccessDenied feature="Release Management" /></AppLayout>;
  }

  return (
    <AppLayout title="Releases">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Release Management</h2>
            <p className="text-sm text-muted-foreground">Track releases, milestones, and deployment schedules</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Release
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Released', value: releases.filter(r => r.status === 'released').length, color: 'text-green-500' },
            { label: 'In Progress', value: releases.filter(r => r.status === 'in_progress').length, color: 'text-blue-500' },
            { label: 'Planning', value: releases.filter(r => r.status === 'planning').length, color: 'text-muted-foreground' },
            { label: 'Total Commits', value: releases.reduce((a, r) => a + r.commits, 0), color: 'text-orange-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className={cn('text-2xl font-bold', stat.color)}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          {releases.map((release) => {
            const config = statusConfig[release.status];
            const StatusIcon = config?.icon ?? AlertCircle;
            return (
              <Card key={release.id} className="hover:border-blue-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold font-mono">{release.name}</span>
                        <Badge className={cn('text-[10px] h-4 px-1.5 border-0', config?.color)}>
                          <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                          {config?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {release.date}</span>
                        <span className="flex items-center gap-1"><GitCommit className="w-3 h-3" /> {release.commits} commits</span>
                        <span>{release.features} features, {release.bugs} bugs</span>
                        <span>{release.issues} total issues</span>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
