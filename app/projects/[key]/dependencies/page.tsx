'use client';

import { useCallback, useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/issues/issue-badge';
import { AlertTriangle, X, ZoomIn, ZoomOut, RotateCcw, Network } from 'lucide-react';
import { AccessDenied } from '@/components/layout/permission-guard';
import { cn } from '@/lib/utils';

// Inline dependency graph using SVG (no external lib needed for this layout)
type NodePosition = { x: number; y: number; issue: Issue };

const statusColors: Record<string, string> = {
  backlog: '#6b7280',
  todo: '#9ca3af',
  in_progress: '#3b82f6',
  in_review: '#f59e0b',
  done: '#10b981',
  cancelled: '#6b7280',
};

const priorityBorderColors: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#60a5fa',
  none: '#374151',
};

function getNodePositions(issues: Issue[]): NodePosition[] {
  const cols = 4;
  const colWidth = 220;
  const rowHeight = 140;
  const startX = 60;
  const startY = 60;

  return issues.map((issue, i) => ({
    x: startX + (i % cols) * colWidth,
    y: startY + Math.floor(i / cols) * rowHeight,
    issue,
  }));
}

interface IssuePanelProps {
  issue: Issue;
  onClose: () => void;
  allIssues: Issue[];
}

function IssueDetailPanel({ issue, onClose, allIssues }: IssuePanelProps) {
  const blockedBy = allIssues.filter((i) => issue.dependencies?.includes(i.id));
  const blocking = allIssues.filter((i) => i.dependencies?.includes(issue.id));

  return (
    <Card className="w-80 shrink-0 h-full overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-mono text-muted-foreground mb-1">{issue.key}</div>
            <CardTitle className="text-sm leading-snug">{issue.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mt-1 -mr-1" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={issue.status} showLabel />
          <PriorityBadge priority={issue.priority} showLabel />
        </div>

        {issue.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{issue.description}</p>
        )}

        {issue.blocked && (
          <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>This issue is currently blocked</span>
          </div>
        )}

        {blockedBy.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Blocked by</p>
            <div className="space-y-1.5">
              {blockedBy.map((dep) => (
                <div key={dep.id} className="flex items-center gap-2 text-xs bg-red-500/5 border border-red-500/20 rounded-md px-2.5 py-1.5">
                  <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="font-mono text-red-400">{dep.key}</span>
                  <span className="truncate text-muted-foreground">{dep.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {blocking.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Blocks</p>
            <div className="space-y-1.5">
              {blocking.map((dep) => (
                <div key={dep.id} className="flex items-center gap-2 text-xs bg-muted/50 rounded-md px-2.5 py-1.5">
                  <span className="font-mono text-blue-400">{dep.key}</span>
                  <span className="truncate text-muted-foreground">{dep.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded-lg p-2.5">
            <div className="text-muted-foreground">Story Points</div>
            <div className="font-bold mt-0.5">{issue.storyPoints ?? '—'}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5">
            <div className="text-muted-foreground">Sprint</div>
            <div className="font-bold mt-0.5">{issue.sprintId ? 'Sprint 23' : 'Backlog'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DependenciesPage() {
  const { issues, can } = useAppStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  if (!can('dependencies.view')) {
    return <AppLayout title="Dependencies"><AccessDenied feature="Dependency Graph" /></AppLayout>;
  }
  const [scale, setScale] = useState(1);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

  const filteredIssues = showBlockedOnly
    ? issues.filter((i) => i.blocked || (i.dependencies && i.dependencies.length > 0))
    : issues;

  const nodes = useMemo(() => getNodePositions(filteredIssues), [filteredIssues]);

  const edges = useMemo(() => {
    const result: { from: NodePosition; to: NodePosition; isBlocking: boolean }[] = [];
    nodes.forEach((node) => {
      node.issue.dependencies?.forEach((depId) => {
        const depNode = nodes.find((n) => n.issue.id === depId);
        if (depNode) {
          result.push({
            from: depNode,
            to: node,
            isBlocking: node.issue.blocked ?? false,
          });
        }
      });
    });
    return result;
  }, [nodes]);

  const canvasWidth = Math.max(900, (nodes.length > 0 ? Math.max(...nodes.map((n) => n.x)) + 260 : 900));
  const canvasHeight = Math.max(500, (nodes.length > 0 ? Math.max(...nodes.map((n) => n.y)) + 160 : 500));

  return (
    <AppLayout title="Dependencies">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Dependency Graph</h2>
            <Badge className="text-xs bg-blue-500/10 text-blue-500 border-0">
              {edges.length} dependencies
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showBlockedOnly ? 'default' : 'outline'}
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => setShowBlockedOnly(!showBlockedOnly)}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Blockers only
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setScale((s) => Math.min(s + 0.1, 2))}>
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}>
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setScale(1)}>
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex-1 border border-border rounded-xl overflow-auto bg-muted/20">
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
              <svg width={canvasWidth} height={canvasHeight} className="absolute pointer-events-none">
                <defs>
                  <marker id="arrow-normal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#4b5563" />
                  </marker>
                  <marker id="arrow-blocked" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
                  </marker>
                </defs>
                {edges.map((edge, i) => {
                  const x1 = edge.from.x + 90;
                  const y1 = edge.from.y + 50;
                  const x2 = edge.to.x + 90;
                  const y2 = edge.to.y;
                  const midY = (y1 + y2) / 2;
                  return (
                    <path
                      key={i}
                      d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                      stroke={edge.isBlocking ? '#ef4444' : '#4b5563'}
                      strokeWidth={edge.isBlocking ? 2 : 1.5}
                      fill="none"
                      strokeDasharray={edge.isBlocking ? '5 3' : undefined}
                      markerEnd={edge.isBlocking ? 'url(#arrow-blocked)' : 'url(#arrow-normal)'}
                      opacity={0.7}
                    />
                  );
                })}
              </svg>

              <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
                {nodes.map((node) => {
                  const statusColor = statusColors[node.issue.status] ?? '#6b7280';
                  const borderColor = node.issue.blocked ? '#ef4444' : priorityBorderColors[node.issue.priority] ?? '#374151';
                  const isSelected = selectedIssue?.id === node.issue.id;

                  return (
                    <div
                      key={node.issue.id}
                      onClick={() => setSelectedIssue(isSelected ? null : node.issue)}
                      className={cn(
                        'absolute w-44 bg-card rounded-lg p-3 cursor-pointer transition-all duration-150',
                        'hover:shadow-lg hover:-translate-y-0.5',
                        isSelected && 'ring-2 ring-blue-500'
                      )}
                      style={{
                        left: node.x,
                        top: node.y,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: isSelected ? '#3b82f6' : borderColor,
                        boxShadow: node.issue.blocked ? '0 0 0 1px #ef444420' : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono text-muted-foreground">{node.issue.key}</span>
                        {node.issue.blocked && (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs font-medium leading-tight line-clamp-2 mb-2">{node.issue.title}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                        <span className="text-xs text-muted-foreground capitalize">{node.issue.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedIssue && (
            <IssueDetailPanel
              issue={selectedIssue}
              onClose={() => setSelectedIssue(null)}
              allIssues={issues}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px bg-muted-foreground" />
            <span>Dependency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px bg-red-500 border-dashed border-t border-red-500" style={{ borderStyle: 'dashed' }} />
            <span>Blocking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded border border-red-500" />
            <span>Blocked issue</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
