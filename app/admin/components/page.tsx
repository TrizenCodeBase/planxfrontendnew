'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Plus, MoreHorizontal, Users, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

const components = [
  { id: 'c1', name: 'Frontend', lead: 'Morgan Kim', issues: 34, color: '#3b82f6', description: 'React, Next.js, and UI components' },
  { id: 'c2', name: 'Backend API', lead: 'Alex Chen', issues: 28, color: '#22c55e', description: 'REST/GraphQL API layer' },
  { id: 'c3', name: 'Database', lead: 'Jordan Lee', issues: 12, color: '#f97316', description: 'PostgreSQL, migrations, schemas' },
  { id: 'c4', name: 'Auth & IAM', lead: 'Sam Rivera', issues: 8, color: '#dc2626', description: 'Authentication, SSO, permissions' },
  { id: 'c5', name: 'Infrastructure', lead: 'Jordan Lee', issues: 15, color: '#64748b', description: 'Cloud, CI/CD, monitoring' },
  { id: 'c6', name: 'Mobile SDK', lead: 'Morgan Kim', issues: 21, color: '#a855f7', description: 'iOS and Android SDKs' },
];

export default function ComponentsPage() {
  const { can } = useAppStore();

  if (!can('components.manage')) {
    return <AppLayout title="Components"><AccessDenied feature="Components Manager" /></AppLayout>;
  }

  return (
    <AppLayout title="Components">
      <div className="p-6 max-w-[800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Components</h2>
            <p className="text-sm text-muted-foreground">Group issues by architectural component</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Component
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Components', value: components.length, color: 'text-blue-500' },
            { label: 'Total Issues', value: components.reduce((a, c) => a + c.issues, 0), color: 'text-green-500' },
            { label: 'Leads', value: new Set(components.map(c => c.lead)).size, color: 'text-orange-500' },
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
          {components.map((comp) => (
            <Card key={comp.id} className="hover:border-blue-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: comp.color + '15' }}>
                    <Puzzle className="w-5 h-5" style={{ color: comp.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{comp.name}</span>
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{comp.issues} issues</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{comp.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    <Users className="w-3 h-3" />
                    <span>{comp.lead}</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
