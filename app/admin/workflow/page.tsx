'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, ReadOnlyBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitMerge, Plus, Play, Pause, ArrowRight, Copy, MoreHorizontal, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const workflows = [
  { id: 'w1', name: 'Bug Triage Flow', status: 'active', steps: 5, triggers: 2, lastRun: '2 min ago' },
  { id: 'w2', name: 'Sprint Auto-Assign', status: 'active', steps: 3, triggers: 1, lastRun: '1 hour ago' },
  { id: 'w3', name: 'QA Gate Pipeline', status: 'active', steps: 7, triggers: 3, lastRun: '5 min ago' },
  { id: 'w4', name: 'Release Promotion', status: 'paused', steps: 4, triggers: 1, lastRun: '3 days ago' },
  { id: 'w5', name: 'Stale Issue Cleanup', status: 'active', steps: 2, triggers: 1, lastRun: '12 hours ago' },
  { id: 'w6', name: 'Epic Breakdown', status: 'draft', steps: 6, triggers: 2, lastRun: 'Never' },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500',
  paused: 'bg-yellow-500/10 text-yellow-500',
  draft: 'bg-muted text-muted-foreground',
};

export default function WorkflowPage() {
  const { can } = useAppStore();

  if (!can('workflow.manage')) {
    return <AppLayout title="Workflow Builder"><AccessDenied feature="Workflow Builder" /></AppLayout>;
  }

  return (
    <AppLayout title="Workflow Builder">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Workflow Builder</h2>
            <p className="text-sm text-muted-foreground">Design and manage automated workflows</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Active', value: workflows.filter(w => w.status === 'active').length, color: 'text-green-500' },
            { label: 'Paused', value: workflows.filter(w => w.status === 'paused').length, color: 'text-yellow-500' },
            { label: 'Draft', value: workflows.filter(w => w.status === 'draft').length, color: 'text-muted-foreground' },
            { label: 'Total Steps', value: workflows.reduce((a, w) => a + w.steps, 0), color: 'text-blue-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className={cn('text-2xl font-bold', stat.color)}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow list */}
        <div className="space-y-3">
          {workflows.map((wf) => (
            <Card key={wf.id} className="hover:border-blue-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <GitMerge className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{wf.name}</span>
                      <Badge className={cn('text-[10px] h-4 px-1.5 border-0', statusStyles[wf.status])}>
                        {wf.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{wf.steps} steps</span>
                      <span>{wf.triggers} triggers</span>
                      <span>Last run: {wf.lastRun}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {wf.status === 'active' ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pause className="w-3.5 h-3.5" />
                      </Button>
                    ) : wf.status === 'paused' ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="w-3.5 h-3.5" />
                      </Button>
                    ) : null}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual workflow preview */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">QA Gate Pipeline — Step Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['Issue Created', 'Auto-Assign QA', 'Add to Testing', 'Verify Pass/Fail', 'Promote to Done', 'Notify Team', 'Log Audit'].map((step, i) => (
                <div key={step} className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 text-xs flex items-center justify-center font-bold">{i + 1}</div>
                    <span className="text-xs font-medium whitespace-nowrap">{step}</span>
                  </div>
                  {i < 6 && <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
