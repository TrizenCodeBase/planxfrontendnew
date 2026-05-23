'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, ReadOnlyBadge, OwnOnlyBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GitPullRequest, Plus, GitCommit, MessageSquare, CheckCircle2, Clock, XCircle, Eye, GitMerge } from 'lucide-react';
import { cn } from '@/lib/utils';

const pullRequests = [
  { id: 'pr1', title: 'feat: add real-time notifications', number: 347, status: 'open', author: 'Morgan Kim', avatar: 'MK', branch: 'feat/notifications', base: 'main', additions: 234, deletions: 45, comments: 8, reviewers: 2, approved: 1, issueKey: 'PX-142' },
  { id: 'pr2', title: 'fix: resolve auth token refresh loop', number: 346, status: 'review', author: 'Morgan Kim', avatar: 'MK', branch: 'fix/auth-refresh', base: 'main', additions: 28, deletions: 12, comments: 3, reviewers: 2, approved: 2, issueKey: 'PX-138' },
  { id: 'pr3', title: 'refactor: extract permission engine', number: 345, status: 'approved', author: 'Alex Chen', avatar: 'AC', branch: 'refactor/permissions', base: 'main', additions: 189, deletions: 156, comments: 12, reviewers: 3, approved: 3, issueKey: 'PX-130' },
  { id: 'pr4', title: 'chore: upgrade Next.js to 15.3', number: 344, status: 'merged', author: 'Jordan Lee', avatar: 'JL', branch: 'chore/nextjs-upgrade', base: 'main', additions: 67, deletions: 89, comments: 5, reviewers: 1, approved: 1, issueKey: 'PX-125' },
  { id: 'pr5', title: 'feat: add capacity planning view', number: 343, status: 'draft', author: 'Sam Rivera', avatar: 'SR', branch: 'feat/capacity', base: 'main', additions: 312, deletions: 0, comments: 0, reviewers: 0, approved: 0, issueKey: 'PX-119' },
  { id: 'pr6', title: 'fix: board drag-drop on mobile', number: 342, status: 'closed', author: 'Morgan Kim', avatar: 'MK', branch: 'fix/mobile-dnd', base: 'main', additions: 45, deletions: 22, comments: 7, reviewers: 2, approved: 0, issueKey: 'PX-115' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: 'Open', color: 'bg-green-500/10 text-green-500', icon: GitPullRequest },
  review: { label: 'In Review', color: 'bg-yellow-500/10 text-yellow-500', icon: Eye },
  approved: { label: 'Approved', color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle2 },
  merged: { label: 'Merged', color: 'bg-cyan-500/10 text-cyan-400', icon: GitMerge },
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground', icon: Clock },
  closed: { label: 'Closed', color: 'bg-red-500/10 text-red-500', icon: XCircle },
};

export default function PullRequestsPage() {
  const { can, effectiveRole } = useAppStore();
  const canView = can('pull_requests.view');
  const canManage = can('pull_requests.manage');

  if (!canView) {
    return <AppLayout title="Pull Requests"><AccessDenied feature="Pull Requests" /></AppLayout>;
  }

  const isReadOnly = !canManage;

  return (
    <AppLayout title="Pull Requests">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Pull Requests</h2>
            <p className="text-sm text-muted-foreground">Code reviews and merge tracking</p>
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly && <ReadOnlyBadge />}
            {effectiveRole === 'developer' && canManage && <OwnOnlyBadge />}
            <Button size="sm" className="text-xs gap-1.5" disabled={!canManage}>
              <Plus className="w-3.5 h-3.5" /> New PR
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['All', 'Open', 'In Review', 'Approved', 'Merged', 'Draft'].map((tab) => (
            <Button key={tab} variant="outline" size="sm" className={cn('text-xs h-7', tab === 'All' && 'bg-muted')}>
              {tab}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {pullRequests.map((pr) => {
            const config = statusConfig[pr.status];
            const StatusIcon = config?.icon ?? GitPullRequest;
            return (
              <Card key={pr.id} className="hover:border-blue-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <StatusIcon className={cn('w-5 h-5 mt-0.5 shrink-0', pr.status === 'merged' ? 'text-cyan-400' : pr.status === 'closed' ? 'text-red-500' : 'text-green-500')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{pr.title}</span>
                        <Badge className={cn('text-[10px] h-4 px-1.5 border-0', config?.color)}>
                          {config?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">#{pr.number}</span>
                        <span>{pr.branch} → {pr.base}</span>
                        <span className="text-green-500">+{pr.additions}</span>
                        <span className="text-red-500">-{pr.deletions}</span>
                        <span className="font-mono">{pr.issueKey}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/60 mt-1">
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {pr.comments}</span>
                        <span>{pr.approved}/{pr.reviewers} approved</span>
                      </div>
                    </div>
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarFallback className="text-xs bg-blue-500/20 text-blue-400 font-semibold">{pr.avatar}</AvatarFallback>
                    </Avatar>
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
