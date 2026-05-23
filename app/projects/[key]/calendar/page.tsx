'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { AccessDenied } from '@/components/layout/permission-guard';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/issues/issue-badge';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, format,
  isSameMonth, isToday, parseISO, isSameDay, addMonths, subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-01'));
  const { issues, can } = useAppStore();

  if (!can('calendar.view')) {
    return <AppLayout title="Calendar"><AccessDenied feature="Calendar" /></AppLayout>;
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getIssuesForDay = (day: Date) => {
    return issues.filter((issue) => {
      if (!issue.dueDate) return false;
      return isSameDay(parseISO(issue.dueDate), day);
    });
  };

  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <AppLayout title="Calendar">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Calendar</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold w-32 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {weekDays.map((day) => (
              <div key={day} className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {paddingDays.map((i) => (
              <div key={`pad-${i}`} className="min-h-[100px] border-r border-b border-border bg-muted/10" />
            ))}
            {days.map((day) => {
              const dayIssues = getIssuesForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[100px] p-2 border-r border-b border-border hover:bg-muted/20 transition-colors',
                    !isSameMonth(day, currentDate) && 'opacity-30',
                    isCurrentDay && 'bg-blue-500/5'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1.5 ml-auto',
                    isCurrentDay ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:bg-muted'
                  )}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayIssues.slice(0, 3).map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer truncate"
                      >
                        <PriorityBadge priority={issue.priority} className="shrink-0" />
                        <span className="truncate">{issue.title}</span>
                      </div>
                    ))}
                    {dayIssues.length > 3 && (
                      <div className="text-xs text-muted-foreground px-1.5">+{dayIssues.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
