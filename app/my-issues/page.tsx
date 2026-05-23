'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { StatusBadge, PriorityBadge, TypeBadge } from '@/components/issues/issue-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, MoreHorizontal, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Issue } from '@/lib/types';

function IssueRow({ issue }: { issue: Issue }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors border-b border-border last:border-0 group">
      <PriorityBadge priority={issue.priority} />
      <TypeBadge type={issue.type} />
      <StatusBadge status={issue.status} />
      <span className="text-xs font-mono text-muted-foreground w-16 shrink-0">{issue.key}</span>
      <span className="flex-1 text-sm truncate group-hover:text-blue-500 transition-colors cursor-pointer">
        {issue.title}
      </span>
      <div className="flex items-center gap-3 shrink-0">
        {issue.storyPoints !== undefined && (
          <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground">
            {issue.storyPoints}
          </span>
        )}
        {issue.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(new Date(issue.dueDate), 'MMM d')}
          </div>
        )}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default function MyIssuesPage() {
  const { issues, currentUser } = useAppStore();
  const myIssues = issues.filter((i) => i.assignee?.id === currentUser.id);
  const inProgress = myIssues.filter((i) => i.status === 'in_progress');
  const todo = myIssues.filter((i) => i.status === 'todo' || i.status === 'backlog');
  const inReview = myIssues.filter((i) => i.status === 'in_review');
  const done = myIssues.filter((i) => i.status === 'done');

  return (
    <AppLayout title="My Issues">
      <div className="p-6 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">My Issues</h2>
          <Button size="sm" className="text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> New Issue
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">
              Active
              <Badge className="ml-1.5 text-xs h-4 px-1 bg-blue-500/20 text-blue-500 border-0">
                {inProgress.length + inReview.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="todo">
              Todo
              <Badge className="ml-1.5 text-xs h-4 px-1 bg-muted text-muted-foreground border-0">
                {todo.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {inProgress.length > 0 && (
                <>
                  <div className="px-4 py-2.5 bg-muted/20 border-b border-border">
                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">In Progress</span>
                  </div>
                  {inProgress.map((issue) => <IssueRow key={issue.id} issue={issue} />)}
                </>
              )}
              {inReview.length > 0 && (
                <>
                  <div className="px-4 py-2.5 bg-muted/20 border-b border-border">
                    <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">In Review</span>
                  </div>
                  {inReview.map((issue) => <IssueRow key={issue.id} issue={issue} />)}
                </>
              )}
              {inProgress.length === 0 && inReview.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No active issues assigned to you.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="todo">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {todo.length > 0 ? (
                todo.map((issue) => <IssueRow key={issue.id} issue={issue} />)
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">No todo issues.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="done">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {done.length > 0 ? (
                done.map((issue) => <IssueRow key={issue.id} issue={issue} />)
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">No completed issues.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
