'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { AccessDenied } from '@/components/layout/permission-guard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PriorityBadge } from '@/components/issues/issue-badge';
import { mockSprints } from '@/lib/mock-data';
import { eachDayOfInterval, format, differenceInDays, parseISO, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

const SPRINT_START = new Date('2026-05-19');
const SPRINT_END = new Date('2026-06-16');
const CELL_WIDTH = 32;

export default function TimelinePage() {
  const { issues, can } = useAppStore();
  const days = eachDayOfInterval({ start: SPRINT_START, end: SPRINT_END });
  const today = startOfDay(new Date());

  if (!can('timeline.view')) {
    return <AppLayout title="Timeline"><AccessDenied feature="Timeline" /></AppLayout>;
  }

  const issuesWithDates = issues.filter((i) => i.dueDate);

  return (
    <AppLayout title="Timeline">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Badge variant="outline" className="text-xs">Sprint 23 — Sprint 24</Badge>
        </div>

        <Card className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header: Dates */}
            <div className="flex border-b border-border">
              <div className="w-72 shrink-0 px-4 py-2.5 text-xs font-semibold text-muted-foreground border-r border-border">
                Issue
              </div>
              <div className="flex">
                {days.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'flex flex-col items-center justify-center text-xs border-r border-border last:border-0 py-2',
                      startOfDay(day).getTime() === today.getTime() && 'bg-blue-500/5 text-blue-500'
                    )}
                    style={{ width: CELL_WIDTH }}
                  >
                    <span className="font-medium">{format(day, 'd')}</span>
                    <span className="text-muted-foreground/60">{format(day, 'EEE').slice(0, 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Rows */}
            {mockSprints.slice(0, 2).map((sprint) => {
              const sprintStart = parseISO(sprint.startDate);
              const sprintEnd = parseISO(sprint.endDate);
              const offsetDays = Math.max(0, differenceInDays(sprintStart, SPRINT_START));
              const durationDays = Math.min(
                differenceInDays(sprintEnd, sprintStart) + 1,
                days.length - offsetDays
              );

              return (
                <div key={sprint.id} className="border-b border-border">
                  <div className="flex">
                    <div className="w-72 shrink-0 px-4 py-2 flex items-center gap-2 border-r border-border bg-muted/20">
                      <span className="text-xs font-semibold">{sprint.name}</span>
                      <Badge
                        className={cn(
                          'text-xs border-0',
                          sprint.status === 'active' ? 'bg-green-500/10 text-green-500' :
                          sprint.status === 'completed' ? 'bg-muted text-muted-foreground' :
                          'bg-blue-500/10 text-blue-500'
                        )}
                      >
                        {sprint.status}
                      </Badge>
                    </div>
                    <div className="flex-1 relative h-9 flex items-center">
                      {durationDays > 0 && (
                        <div
                          className="absolute h-5 rounded-full opacity-30"
                          style={{
                            left: offsetDays * CELL_WIDTH + 4,
                            width: durationDays * CELL_WIDTH - 8,
                            backgroundColor: sprint.status === 'active' ? '#3b82f6' :
                              sprint.status === 'completed' ? '#6b7280' : '#10b981',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Issue rows */}
            {issuesWithDates.map((issue) => {
              const dueDate = parseISO(issue.dueDate!);
              const offsetDays = Math.max(0, differenceInDays(dueDate, SPRINT_START));
              const isOverdue = dueDate < today && issue.status !== 'done';

              return (
                <div key={issue.id} className="flex border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <div className="w-72 shrink-0 px-4 py-2.5 flex items-center gap-2 border-r border-border">
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{issue.key}</span>
                    <span className="text-xs truncate flex-1">{issue.title}</span>
                    {issue.assignee && (
                      <Avatar className="w-5 h-5 shrink-0">
                        <AvatarFallback className="text-xs bg-blue-500/20 text-blue-400">
                          {issue.assignee.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex-1 relative h-10 flex items-center">
                    {offsetDays < days.length && (
                      <div
                        className={cn(
                          'absolute w-3 h-3 rounded-full ring-2 ring-background',
                          isOverdue ? 'bg-red-500' :
                          issue.status === 'done' ? 'bg-green-500' :
                          'bg-blue-500'
                        )}
                        style={{ left: offsetDays * CELL_WIDTH + CELL_WIDTH / 2 - 6 }}
                        title={format(dueDate, 'MMM d')}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
