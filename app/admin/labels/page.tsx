'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, ReadOnlyBadge, LimitedBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tag, Plus, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const labels = [
  { id: 'l1', name: 'bug', color: '#ef4444', usage: 23 },
  { id: 'l2', name: 'feature', color: '#3b82f6', usage: 45 },
  { id: 'l3', name: 'improvement', color: '#22c55e', usage: 18 },
  { id: 'l4', name: 'regression', color: '#f97316', usage: 7 },
  { id: 'l5', name: 'security', color: '#dc2626', usage: 5 },
  { id: 'l6', name: 'performance', color: '#a855f7', usage: 12 },
  { id: 'l7', name: 'ui/ux', color: '#ec4899', usage: 31 },
  { id: 'l8', name: 'backend', color: '#06b6d4', usage: 28 },
  { id: 'l9', name: 'infra', color: '#64748b', usage: 9 },
  { id: 'l10', name: 'documentation', color: '#eab308', usage: 14 },
  { id: 'l11', name: 'tech-debt', color: '#78716c', usage: 6 },
  { id: 'l12', name: 'blocked', color: '#dc2626', usage: 3 },
];

export default function LabelsPage() {
  const { can, isLimited } = useAppStore();
  const canManage = can('labels.manage');
  const readOnly = isLimited('labels.manage');

  if (!canManage && !readOnly) {
    return <AppLayout title="Labels"><AccessDenied feature="Labels Manager" /></AppLayout>;
  }

  return (
    <AppLayout title="Labels">
      <div className="p-6 max-w-[800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Labels Manager</h2>
            <p className="text-sm text-muted-foreground">Organize issues with color-coded labels</p>
          </div>
          <div className="flex items-center gap-2">
            {readOnly && <LimitedBadge />}
            <Button size="sm" className="text-xs gap-1.5" disabled={!canManage || readOnly}>
              <Plus className="w-3.5 h-3.5" /> New Label
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">All Labels ({labels.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x divide-border">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center gap-3 px-5 py-3 border-b border-border hover:bg-muted/20 transition-colors">
                  <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center" style={{ backgroundColor: label.color + '20' }}>
                    <Tag className="w-3.5 h-3.5" style={{ color: label.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{label.name}</span>
                    <div className="text-xs text-muted-foreground">{label.usage} issues</div>
                  </div>
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
                  {canManage && !readOnly && (
                    <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
