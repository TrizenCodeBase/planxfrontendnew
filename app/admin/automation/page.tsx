'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, Play, Pause, Clock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const automations = [
  { id: 'a1', name: 'Auto-assign bugs to QA', trigger: 'Issue created (type: bug)', action: 'Assign to QA team', status: 'active', runs: 142, lastRun: '5 min ago' },
  { id: 'a2', name: 'Stale issue notification', trigger: 'Issue unchanged for 7 days', action: 'Notify assignee + manager', status: 'active', runs: 56, lastRun: '2 hours ago' },
  { id: 'a3', name: 'Sprint auto-close', trigger: 'Sprint end date reached', action: 'Move open issues to next sprint', status: 'active', runs: 8, lastRun: '3 days ago' },
  { id: 'a4', name: 'PR auto-link', trigger: 'PR opened with issue key', action: 'Link PR to issue, move to In Review', status: 'paused', runs: 234, lastRun: '1 day ago' },
  { id: 'a5', name: 'Critical priority escalation', trigger: 'Priority set to Urgent', action: 'Notify #escalations channel', status: 'active', runs: 12, lastRun: '6 hours ago' },
  { id: 'a6', name: 'Done auto-transition', trigger: 'All subtasks completed', action: 'Move parent to Done', status: 'draft', runs: 0, lastRun: 'Never' },
];

const statusStyles: Record<string, { bg: string; icon: React.ElementType }> = {
  active: { bg: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  paused: { bg: 'bg-yellow-500/10 text-yellow-500', icon: Pause },
  draft: { bg: 'bg-muted text-muted-foreground', icon: AlertCircle },
  error: { bg: 'bg-red-500/10 text-red-500', icon: AlertCircle },
};

export default function AutomationPage() {
  const { can } = useAppStore();

  if (!can('automation.manage')) {
    return <AppLayout title="Automation"><AccessDenied feature="Automation Rules" /></AppLayout>;
  }

  return (
    <AppLayout title="Automation">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Automation Rules</h2>
            <p className="text-sm text-muted-foreground">Configure triggers and actions for automatic workflows</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Rule
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Active', value: automations.filter(a => a.status === 'active').length, color: 'text-green-500' },
            { label: 'Total Runs', value: automations.reduce((a, r) => a + r.runs, 0), color: 'text-blue-500' },
            { label: 'Paused', value: automations.filter(a => a.status === 'paused').length, color: 'text-yellow-500' },
            { label: 'Drafts', value: automations.filter(a => a.status === 'draft').length, color: 'text-muted-foreground' },
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
          {automations.map((auto) => {
            const StatusIcon = statusStyles[auto.status]?.icon ?? AlertCircle;
            return (
              <Card key={auto.id} className="hover:border-blue-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">{auto.name}</span>
                        <Badge className={cn('text-[10px] h-4 px-1.5 border-0', statusStyles[auto.status]?.bg)}>
                          <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                          {auto.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="bg-muted/50 px-2 py-0.5 rounded">When: {auto.trigger}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="bg-muted/50 px-2 py-0.5 rounded">Then: {auto.action}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                        <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {auto.runs} runs</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {auto.lastRun}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {auto.status === 'active' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pause className="w-3.5 h-3.5" /></Button>
                      ) : auto.status === 'paused' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Play className="w-3.5 h-3.5" /></Button>
                      ) : null}
                    </div>
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
