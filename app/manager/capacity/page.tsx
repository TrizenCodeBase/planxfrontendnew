'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, ReadOnlyBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Gauge, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/lib/mock-data';
import { PlanXRole } from '@/lib/types';

const teamCapacity = [
  { name: 'Morgan Kim', role: 'developer' as PlanXRole, avatar: 'MK', allocated: 34, capacity: 40, sprintIssues: 8, completed: 5 },
  { name: 'Casey Patel', role: 'qa' as PlanXRole, avatar: 'CP', allocated: 28, capacity: 32, sprintIssues: 6, completed: 4 },
  { name: 'Sam Rivera', role: 'manager' as PlanXRole, avatar: 'SR', allocated: 18, capacity: 24, sprintIssues: 3, completed: 2 },
  { name: 'Alex Chen', role: 'super_admin' as PlanXRole, avatar: 'AC', allocated: 12, capacity: 20, sprintIssues: 2, completed: 1 },
  { name: 'Jordan Lee', role: 'admin' as PlanXRole, avatar: 'JL', allocated: 38, capacity: 40, sprintIssues: 9, completed: 7 },
  { name: 'Taylor Wong', role: 'viewer' as PlanXRole, avatar: 'TW', allocated: 0, capacity: 0, sprintIssues: 0, completed: 0 },
];

const roleColors: Record<string, string> = {
  super_admin: 'text-red-400',
  admin: 'text-cyan-400',
  manager: 'text-blue-400',
  developer: 'text-green-400',
  qa: 'text-orange-400',
  viewer: 'text-slate-400',
};

function CapacityBar({ allocated, capacity }: { allocated: number; capacity: number }) {
  const pct = capacity > 0 ? Math.round((allocated / capacity) * 100) : 0;
  const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className={cn('text-xs font-medium w-10 text-right', pct > 90 ? 'text-red-500' : pct > 70 ? 'text-yellow-500' : 'text-green-500')}>
        {pct}%
      </span>
    </div>
  );
}

export default function CapacityPage() {
  const { can } = useAppStore();
  const canManage = can('capacity.manage');
  const canView = can('capacity.view');

  if (!canView) {
    return <AppLayout title="Capacity"><AccessDenied feature="Capacity Planning" /></AppLayout>;
  }

  const totalAllocated = teamCapacity.reduce((a, t) => a + t.allocated, 0);
  const totalCapacity = teamCapacity.reduce((a, t) => a + t.capacity, 0);
  const overallPct = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

  return (
    <AppLayout title="Capacity Planning">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Capacity Planning</h2>
            <p className="text-sm text-muted-foreground">Sprint 23 — Team workload and allocation</p>
          </div>
          <div className="flex items-center gap-2">
            {!canManage && <ReadOnlyBadge />}
            <Button variant="outline" size="sm" className="text-xs">Previous Sprint</Button>
            <Button variant="outline" size="sm" className="text-xs">Next Sprint</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{overallPct}%</div>
              <div className="text-xs text-muted-foreground mt-1">Overall Load</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{totalAllocated}</div>
              <div className="text-xs text-muted-foreground mt-1">Hours Allocated</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{totalCapacity - totalAllocated}</div>
              <div className="text-xs text-muted-foreground mt-1">Hours Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {teamCapacity.filter(t => t.capacity > 0 && (t.allocated / t.capacity) > 0.9).length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Overloaded</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Team Workload</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {teamCapacity.filter(t => t.capacity > 0).map((member) => (
              <div key={member.name} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-blue-500/20 text-blue-400">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="w-28 shrink-0">
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className={cn('text-xs', roleColors[member.role])}>{member.role.replace('_', ' ')}</div>
                </div>
                <div className="flex-1">
                  <CapacityBar allocated={member.allocated} capacity={member.capacity} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0 w-40">
                  <span>{member.allocated}/{member.capacity}h</span>
                  <span>{member.completed}/{member.sprintIssues} done</span>
                </div>
                {member.allocated / member.capacity > 0.9 && (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Velocity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Sprint 21', 'Sprint 22', 'Sprint 23'].map((sprint, i) => {
                  const pts = [38, 42, 35];
                  return (
                    <div key={sprint} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">{sprint}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/70 rounded-full" style={{ width: `${(pts[i] / 50) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{pts[i]}pts</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" /> Team Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Development', 'QA Testing', 'Management', 'Admin'].map((cat) => {
                  const pct = cat === 'Development' ? 55 : cat === 'QA Testing' ? 25 : cat === 'Management' ? 12 : 8;
                  const color = cat === 'Development' ? 'bg-green-500/70' : cat === 'QA Testing' ? 'bg-orange-500/70' : cat === 'Management' ? 'bg-blue-500/70' : 'bg-cyan-500/70';
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-28">{cat}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
