'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { Issue, IssueStatus } from '@/lib/types';
import { StatusBadge, PriorityBadge, TypeBadge } from '@/components/issues/issue-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, AlertTriangle, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PermissionGuard, ReadOnlyBadge, AccessDenied, OwnOnlyBadge, LimitedBadge } from '@/components/layout/permission-guard';
import { getAllowedTransitions } from '@/lib/permissions';

const columns: { id: IssueStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-muted-foreground' },
  { id: 'todo', label: 'Todo', color: 'text-muted-foreground' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-500' },
  { id: 'in_review', label: 'In Review', color: 'text-yellow-500' },
  { id: 'testing', label: 'Testing', color: 'text-orange-500' },
  { id: 'done', label: 'Done', color: 'text-green-500' },
];

function IssueCard({ issue, onDragStart, canDrag, effectiveRole }: {
  issue: Issue;
  onDragStart: (e: React.DragEvent, issue: Issue) => void;
  canDrag: boolean;
  effectiveRole: string;
}) {
  const allowedTargets = getAllowedTransitions(effectiveRole as any, issue.status);

  return (
    <div
      draggable={canDrag}
      onDragStart={(e) => canDrag && onDragStart(e, issue)}
      className={cn(
        'bg-card border border-border rounded-lg p-3 transition-all duration-150 group',
        canDrag ? 'cursor-grab active:cursor-grabbing hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5' : 'cursor-default opacity-90',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <TypeBadge type={issue.type} />
          <span className="text-xs font-mono text-muted-foreground">{issue.key}</span>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <p className="text-sm font-medium leading-snug mb-2.5 line-clamp-2">{issue.title}</p>

      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {issue.labels.map((label) => (
            <span key={label.id} className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: label.color + '20', color: label.color }}>
              {label.name}
            </span>
          ))}
        </div>
      )}

      {issue.blocked && (
        <div className="flex items-center gap-1 text-xs text-red-500 mb-2">
          <AlertTriangle className="w-3 h-3" /> Blocked
        </div>
      )}

      {issue.status === 'testing' && (
        <div className="flex items-center gap-1 text-xs text-orange-500 mb-2">
          <ShieldCheck className="w-3 h-3" /> QA Gate
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={issue.priority} />
          {issue.storyPoints !== undefined && (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground">{issue.storyPoints}</span>
          )}
        </div>
        {issue.assignee && (
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-xs bg-blue-500/20 text-blue-400 font-semibold">{issue.assignee.avatar}</AvatarFallback>
          </Avatar>
        )}
      </div>

      {!canDrag && (
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/50">
          <Lock className="w-3 h-3" /> Read-only
        </div>
      )}

      {canDrag && allowedTargets.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {allowedTargets.map((target) => (
            <span key={target} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              → {target.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Column({
  column, issues, onDrop, onDragOver, onDragStart, canDrag, effectiveRole,
}: {
  column: typeof columns[0];
  issues: Issue[];
  onDrop: (e: React.DragEvent, status: IssueStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, issue: Issue) => void;
  canDrag: boolean;
  effectiveRole: string;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <StatusBadge status={column.id} />
          <span className="text-sm font-medium">{column.label}</span>
          <Badge variant="secondary" className="text-xs h-4 min-w-4 px-1">{issues.length}</Badge>
          {column.id === 'testing' && (
            <Badge className="text-[10px] h-4 px-1 bg-orange-500/10 text-orange-500 border-0">QA</Badge>
          )}
        </div>
        {canDrag && (
          <button className="p-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div
        onDrop={(e) => { setIsDragOver(false); onDrop(e, column.id); }}
        onDragOver={(e) => { onDragOver(e); if (canDrag) setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        className={cn(
          'flex-1 space-y-2 p-2 rounded-xl min-h-[500px] transition-all duration-150',
          canDrag && isDragOver ? 'bg-blue-500/5 border-2 border-dashed border-blue-500/30' : 'bg-muted/30 border-2 border-transparent'
        )}
      >
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onDragStart={onDragStart} canDrag={canDrag} effectiveRole={effectiveRole} />
        ))}
        {issues.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground/50">
            {canDrag ? 'Drop issues here' : 'No issues'}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { issues, updateIssueStatus, can, activeRole, effectiveRole, canTransitionToStatus } = useAppStore();
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const canDrag = can('board.drag_drop');
  const canCreate = can('issues.create');

  if (!can('board.view')) {
    return <AppLayout title="Board"><AccessDenied feature="Kanban Board" /></AppLayout>;
  }

  const boardTitle = effectiveRole === 'qa' ? 'Bug Board' : effectiveRole === 'viewer' ? 'Board (Read-only)' : 'Kanban Board';

  const handleDragStart = (e: React.DragEvent, issue: Issue) => {
    e.dataTransfer.setData('issueId', issue.id);
    setDraggedIssueId(issue.id);
  };

  const handleDrop = (e: React.DragEvent, status: IssueStatus) => {
    e.preventDefault();
    if (!canDrag) return;
    const issueId = e.dataTransfer.getData('issueId');
    if (!issueId) return;

    const issue = issues.find((i) => i.id === issueId);
    if (!issue) return;

    // Enforce status transition rules
    if (canTransitionToStatus(issue.status, status)) {
      updateIssueStatus(issueId, status);
    }
    setDraggedIssueId(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <AppLayout title="Board">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{boardTitle}</h2>
            <Badge className="bg-blue-500/10 text-blue-500 border-0 text-xs">Sprint 23</Badge>
            {!canDrag && <ReadOnlyBadge />}
            {canDrag && can('board.drag_drop') && effectiveRole === 'qa' && <OwnOnlyBadge />}
            {canDrag && can('board.drag_drop') && effectiveRole === 'developer' && <OwnOnlyBadge />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">Filters</Button>
            {canCreate ? (
              <Button size="sm" className="text-xs gap-1">
                <Plus className="w-3.5 h-3.5" /> New Issue
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="text-xs gap-1 text-muted-foreground" disabled>
                <Lock className="w-3.5 h-3.5" /> Read-only
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              issues={issues.filter((i) => i.status === column.id)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              canDrag={canDrag}
              effectiveRole={effectiveRole}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
