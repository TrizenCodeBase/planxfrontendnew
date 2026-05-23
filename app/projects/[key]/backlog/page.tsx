'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { StatusBadge, PriorityBadge, TypeBadge } from '@/components/issues/issue-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, ChevronRight, ChevronDown, MoreHorizontal, Calendar, AlertTriangle, Lock } from 'lucide-react';
import { AccessDenied, ReadOnlyBadge } from '@/components/layout/permission-guard';
import { cn } from '@/lib/utils';
import { mockSprints } from '@/lib/mock-data';
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
      {issue.blocked && (
        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
      )}
      <div className="flex items-center gap-3 shrink-0">
        {issue.labels?.map((label) => (
          <span
            key={label.id}
            className="text-xs px-1.5 py-0.5 rounded-full hidden md:inline"
            style={{ backgroundColor: label.color + '20', color: label.color }}
          >
            {label.name}
          </span>
        ))}
        {issue.storyPoints !== undefined && (
          <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground w-6 text-center">
            {issue.storyPoints}
          </span>
        )}
        {issue.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground hidden md:flex">
            <Calendar className="w-3 h-3" />
            {format(new Date(issue.dueDate), 'MMM d')}
          </div>
        )}
        {issue.assignee ? (
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-xs bg-blue-500/20 text-blue-400 font-semibold">
              {issue.assignee.avatar}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-5 h-5 rounded-full border border-dashed border-border" />
        )}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function SprintSection({ sprint, issues, defaultOpen = true }: {
  sprint: typeof mockSprints[0];
  issues: Issue[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const totalPoints = issues.reduce((sum, i) => sum + (i.storyPoints ?? 0), 0);
  const donePoints = issues.filter((i) => i.status === 'done').reduce((sum, i) => sum + (i.storyPoints ?? 0), 0);

  const statusColor = sprint.status === 'active' ? 'text-green-500 bg-green-500/10'
    : sprint.status === 'completed' ? 'text-muted-foreground bg-muted'
    : 'text-blue-500 bg-blue-500/10';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/20 transition-colors"
        >
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <span className="font-semibold text-sm">{sprint.name}</span>
          <Badge className={cn('text-xs border-0', statusColor)}>
            {sprint.status === 'active' ? 'Active' : sprint.status === 'completed' ? 'Completed' : 'Planning'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(sprint.startDate), 'MMM d')} – {format(new Date(sprint.endDate), 'MMM d')}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{donePoints}/{totalPoints} pts</span>
            <Badge variant="secondary" className="text-xs">{issues.length} issues</Badge>
          </div>
        </button>
      </CardHeader>
      {open && (
        <CardContent className="p-0">
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: totalPoints > 0 ? `${(donePoints / totalPoints) * 100}%` : '0%' }}
            />
          </div>
          {issues.length > 0 ? (
            <div>
              {issues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No issues in this sprint yet.{' '}
              <button className="text-blue-500 hover:underline">Add issues</button>
            </div>
          )}
          <div className="px-4 py-2.5 border-t border-border">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add issue to sprint
            </button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function BacklogPage() {
  const { issues, can } = useAppStore();
  const backlogIssues = issues.filter((i) => !i.sprintId);

  if (!can('backlog.view')) {
    return <AppLayout title="Backlog"><AccessDenied feature="Backlog" /></AppLayout>;
  }

  return (
    <AppLayout title="Backlog">
      <div className="p-6 max-w-[1200px] mx-auto space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Backlog</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">Filters</Button>
            {can('backlog.manage') ? (
              <Button size="sm" className="text-xs gap-1">
                <Plus className="w-3.5 h-3.5" /> New Sprint
              </Button>
            ) : (
              <ReadOnlyBadge />
            )}
          </div>
        </div>

        {mockSprints.map((sprint) => (
          <SprintSection
            key={sprint.id}
            sprint={sprint}
            issues={issues.filter((i) => i.sprintId === sprint.id)}
            defaultOpen={sprint.status === 'active'}
          />
        ))}

        {/* Backlog */}
        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Backlog</span>
              <Badge variant="secondary" className="text-xs">{backlogIssues.length} issues</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {backlogIssues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
            <div className="px-4 py-2.5 border-t border-border">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Create issue
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
