'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TestTube, CheckCircle2, XCircle, RotateCcw, Clock, AlertTriangle, ArrowRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const testQueue = [
  { id: 'tq1', issueKey: 'PX-142', title: 'Real-time notifications not delivered on Safari', type: 'bug', priority: 'high', assignedTo: 'Casey Patel', avatar: 'CP', status: 'ready', env: 'Staging', elapsed: '2h' },
  { id: 'tq2', issueKey: 'PX-138', title: 'Auth token refresh loop on mobile', type: 'bug', priority: 'urgent', assignedTo: 'Casey Patel', avatar: 'CP', status: 'testing', env: 'Production', elapsed: '45m' },
  { id: 'tq3', issueKey: 'PX-140', title: 'Verify new permission matrix across roles', type: 'task', priority: 'medium', assignedTo: 'Casey Patel', avatar: 'CP', status: 'ready', env: 'Staging', elapsed: '0m' },
  { id: 'tq4', issueKey: 'PX-135', title: 'Board drag-drop intermittent failure', type: 'bug', priority: 'high', assignedTo: 'Casey Patel', avatar: 'CP', status: 'blocked', env: 'Staging', elapsed: '6h' },
  { id: 'tq5', issueKey: 'PX-130', title: 'Permission engine refactor — regression check', type: 'task', priority: 'medium', assignedTo: 'Casey Patel', avatar: 'CP', status: 'ready', env: 'Dev', elapsed: '0m' },
  { id: 'tq6', issueKey: 'PX-125', title: 'Next.js upgrade — smoke test all pages', type: 'task', priority: 'low', assignedTo: 'Casey Patel', avatar: 'CP', status: 'ready', env: 'Staging', elapsed: '0m' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ready: { label: 'Ready for Test', color: 'bg-blue-500/10 text-blue-500', icon: TestTube },
  testing: { label: 'In Testing', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  blocked: { label: 'Blocked', color: 'bg-red-500/10 text-red-500', icon: AlertTriangle },
  passed: { label: 'Passed', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-500', icon: XCircle },
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-500',
  high: 'bg-orange-500/10 text-orange-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  low: 'bg-muted text-muted-foreground',
};

export default function TestingQueuePage() {
  const { can } = useAppStore();

  if (!can('qa.testing_queue')) {
    return <AppLayout title="Testing Queue"><AccessDenied feature="Testing Queue" /></AppLayout>;
  }

  const readyCount = testQueue.filter(t => t.status === 'ready').length;
  const testingCount = testQueue.filter(t => t.status === 'testing').length;
  const blockedCount = testQueue.filter(t => t.status === 'blocked').length;

  return (
    <AppLayout title="Testing Queue">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Testing Queue</h2>
            <p className="text-sm text-muted-foreground">Items awaiting QA verification</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">Filter by Env</Button>
            <Button variant="outline" size="sm" className="text-xs">Sort by Priority</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{readyCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Ready</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{testingCount}</div>
              <div className="text-xs text-muted-foreground mt-1">In Testing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{blockedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Blocked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{testQueue.filter(t => t.priority === 'urgent').length}</div>
              <div className="text-xs text-muted-foreground mt-1">Urgent</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {testQueue.map((item) => {
            const config = statusConfig[item.status];
            const StatusIcon = config?.icon ?? Clock;
            return (
              <Card key={item.id} className={cn('hover:border-blue-500/30 transition-colors', item.priority === 'urgent' && 'border-red-500/20')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <TestTube className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{item.issueKey}</span>
                        <span className="text-sm font-medium">{item.title}</span>
                        <Badge className={cn('text-[10px] h-4 px-1.5 border-0', priorityColors[item.priority])}>{item.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge className={cn('text-[10px] h-4 px-1.5 border-0', config?.color)}>
                          <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                          {config?.label}
                        </Badge>
                        <span>Env: {item.env}</span>
                        <span>Elapsed: {item.elapsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.status === 'ready' && (
                        <Button size="sm" className="text-xs gap-1 h-7">
                          <TestTube className="w-3 h-3" /> Start Testing
                        </Button>
                      )}
                      {item.status === 'testing' && (
                        <>
                          <Button size="sm" variant="outline" className="text-xs gap-1 h-7 text-green-500 hover:text-green-600">
                            <CheckCircle2 className="w-3 h-3" /> Pass
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs gap-1 h-7 text-red-500 hover:text-red-600">
                            <XCircle className="w-3 h-3" /> Fail
                          </Button>
                        </>
                      )}
                      {item.status === 'blocked' && (
                        <Button size="sm" variant="outline" className="text-xs gap-1 h-7 text-orange-500">
                          <RotateCcw className="w-3 h-3" /> Reopen
                        </Button>
                      )}
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
