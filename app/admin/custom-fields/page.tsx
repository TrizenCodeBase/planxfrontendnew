'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Plus, GripVertical, MoreHorizontal, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const fields = [
  { id: 'cf1', name: 'Priority Score', type: 'Number', scope: 'All Projects', required: false, active: true },
  { id: 'cf2', name: 'Customer Impact', type: 'Select', scope: 'Bug Reports', required: true, active: true },
  { id: 'cf3', name: 'Regression', type: 'Checkbox', scope: 'QA Pipeline', required: false, active: true },
  { id: 'cf4', name: 'Epic Link', type: 'Relation', scope: 'All Projects', required: false, active: true },
  { id: 'cf5', name: 'Sprint Goal', type: 'Text', scope: 'Sprint Issues', required: false, active: true },
  { id: 'cf6', name: 'Story Points', type: 'Number', scope: 'All Projects', required: true, active: true },
  { id: 'cf7', name: 'Due Date Override', type: 'Date', scope: 'Manager Only', required: false, active: false },
  { id: 'cf8', name: 'Deployment Env', type: 'Multi-Select', scope: 'Dev Pipeline', required: false, active: true },
];

const typeColors: Record<string, string> = {
  Number: 'bg-blue-500/10 text-blue-500',
  Select: 'bg-green-500/10 text-green-500',
  Checkbox: 'bg-orange-500/10 text-orange-500',
  Relation: 'bg-cyan-500/10 text-cyan-500',
  Text: 'bg-muted text-muted-foreground',
  Date: 'bg-yellow-500/10 text-yellow-500',
  'Multi-Select': 'bg-purple-500/10 text-purple-500',
};

export default function CustomFieldsPage() {
  const { can } = useAppStore();

  if (!can('custom_fields.manage')) {
    return <AppLayout title="Custom Fields"><AccessDenied feature="Custom Fields" /></AppLayout>;
  }

  return (
    <AppLayout title="Custom Fields">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Custom Fields</h2>
            <p className="text-sm text-muted-foreground">Define custom metadata for issues, sprints, and projects</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Field
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Active Fields', value: fields.filter(f => f.active).length, color: 'text-green-500' },
            { label: 'Required', value: fields.filter(f => f.required).length, color: 'text-blue-500' },
            { label: 'Field Types', value: new Set(fields.map(f => f.type)).size, color: 'text-orange-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className={cn('text-2xl font-bold', stat.color)}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Field Configuration</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <GripVertical className="w-4 h-4 text-muted-foreground/30 shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">{field.name}</span>
                    {field.required && <Badge className="text-[10px] h-4 px-1.5 bg-red-500/10 text-red-500 border-0">Required</Badge>}
                    {!field.active && <Badge className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground border-0">Disabled</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">Scope: {field.scope}</span>
                </div>
                <Badge className={cn('text-[10px] h-5 px-2 border-0', typeColors[field.type])}>{field.type}</Badge>
                <button className="shrink-0">
                  {field.active ? (
                    <ToggleRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </button>
                <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
