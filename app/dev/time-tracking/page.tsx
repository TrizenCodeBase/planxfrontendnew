'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, OwnOnlyBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Plus, Play, Pause, Clock, Calendar, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const timeEntries = [
  { id: 't1', issueKey: 'PX-142', title: 'Implement notification system', date: '2026-05-23', timeSpent: '3h 45m', status: 'running' },
  { id: 't2', issueKey: 'PX-138', title: 'Fix auth token refresh loop', date: '2026-05-23', timeSpent: '1h 30m', status: 'stopped' },
  { id: 't3', issueKey: 'PX-130', title: 'Refactor permission engine', date: '2026-05-22', timeSpent: '5h 15m', status: 'stopped' },
  { id: 't4', issueKey: 'PX-125', title: 'Upgrade Next.js', date: '2026-05-22', timeSpent: '2h 00m', status: 'stopped' },
  { id: 't5', issueKey: 'PX-119', title: 'Capacity planning view', date: '2026-05-21', timeSpent: '4h 30m', status: 'stopped' },
  { id: 't6', issueKey: 'PX-115', title: 'Board mobile drag-drop', date: '2026-05-21', timeSpent: '2h 45m', status: 'stopped' },
  { id: 't7', issueKey: 'PX-108', title: 'AI sprint planner integration', date: '2026-05-20', timeSpent: '6h 00m', status: 'stopped' },
];

const dailyTotals = [
  { day: 'Mon', hours: 7.5 },
  { day: 'Tue', hours: 8.0 },
  { day: 'Wed', hours: 6.5 },
  { day: 'Thu', hours: 9.0 },
  { day: 'Fri', hours: 5.0 },
];

export default function TimeTrackingPage() {
  const { can, effectiveRole } = useAppStore();
  const canView = can('time_tracking.view');
  const canManage = can('time_tracking.manage');

  if (!canView) {
    return <AppLayout title="Time Logs"><AccessDenied feature="Time Tracking" /></AppLayout>;
  }

  const totalThisWeek = dailyTotals.reduce((a, d) => a + d.hours, 0);
  const runningEntry = timeEntries.find(t => t.status === 'running');

  return (
    <AppLayout title="Time Logs">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Time Tracking</h2>
            <p className="text-sm text-muted-foreground">Log and review your work hours</p>
          </div>
          <div className="flex items-center gap-2">
            {effectiveRole === 'developer' && <OwnOnlyBadge />}
            <Button size="sm" className="text-xs gap-1.5" disabled={!canManage}>
              <Plus className="w-3.5 h-3.5" /> Manual Entry
            </Button>
          </div>
        </div>

        {/* Active timer */}
        {runningEntry && (
          <Card className="mb-4 border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 animate-pulse">
                  <Timer className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">{runningEntry.title}</span>
                    <Badge className="text-[10px] h-4 px-1.5 bg-blue-500/10 text-blue-500 border-0">Running</Badge>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{runningEntry.issueKey}</span>
                </div>
                <span className="text-lg font-mono font-bold text-blue-500">{runningEntry.timeSpent}</span>
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Pause className="w-3.5 h-3.5" /> Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{totalThisWeek}h</div>
              <div className="text-xs text-muted-foreground mt-1">This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{timeEntries.filter(t => t.status === 'stopped').length}</div>
              <div className="text-xs text-muted-foreground mt-1">Entries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">8h</div>
              <div className="text-xs text-muted-foreground mt-1">Daily Target</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-500">
                {Math.round((totalThisWeek / 40) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Weekly Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly chart */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-24">
              {dailyTotals.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-muted rounded-t relative overflow-hidden" style={{ height: '80px' }}>
                    <div
                      className={cn('absolute bottom-0 w-full rounded-t', day.hours >= 8 ? 'bg-green-500/60' : 'bg-blue-500/60')}
                      style={{ height: `${(day.hours / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                  <span className="text-[10px] font-medium">{day.hours}h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time entries */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{entry.issueKey}</span>
                    <span className="text-sm font-medium truncate">{entry.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <span className="text-sm font-mono font-medium">{entry.timeSpent}</span>
                {entry.status === 'running' && (
                  <Badge className="text-[10px] h-4 px-1.5 bg-blue-500/10 text-blue-500 border-0">Running</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
