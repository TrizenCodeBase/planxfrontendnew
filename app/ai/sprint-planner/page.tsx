'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { AIPanel, AISuggestion } from '@/components/ai/ai-panel';
import { AccessDenied } from '@/components/layout/permission-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/issues/issue-badge';
import { mockSprints } from '@/lib/mock-data';
import { Zap, Users, Target, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const quickPrompts = [
  'Plan Sprint 24 based on team velocity',
  'What issues should be prioritized next sprint?',
  'Analyze current sprint health and risks',
  'Suggest sprint goal based on roadmap',
  'Balance workload across team members',
];

export default function SprintPlannerPage() {
  const { issues, currentUser, can } = useAppStore();
  const activeSprint = mockSprints.find((s) => s.status === 'active');

  if (!can('ai.use')) {
    return <AppLayout title="AI Sprint Planner"><AccessDenied feature="AI Features" /></AppLayout>;
  }
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);

  const handleAccept = (suggestion: AISuggestion) => {
    setAcceptedSuggestions((prev) => [...prev, suggestion.id]);
  };

  const sprintIssues = issues.filter((i) => i.sprintId === activeSprint?.id);
  const totalPoints = sprintIssues.reduce((sum, i) => sum + (i.storyPoints ?? 0), 0);
  const donePoints = sprintIssues.filter((i) => i.status === 'done').reduce((sum, i) => sum + (i.storyPoints ?? 0), 0);

  return (
    <AppLayout title="AI Sprint Planner">
      <div className="h-[calc(100vh-3.5rem)] flex">
        {/* Left Panel - Context */}
        <div className="w-72 border-r border-border flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Sprint Planner</h2>
                <p className="text-xs text-muted-foreground">AI-powered</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Let AI analyze your backlog, team velocity, and priorities to plan the optimal sprint.
            </p>
          </div>

          {/* Sprint Context */}
          {activeSprint && (
            <div className="p-4 border-b border-border space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Sprint</h3>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{activeSprint.name}</span>
                  <Badge className="text-xs bg-green-500/10 text-green-500 border-0">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{activeSprint.goal}</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: totalPoints > 0 ? `${(donePoints / totalPoints) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{donePoints}/{totalPoints} pts</span>
                  <span>Ends {format(new Date(activeSprint.endDate), 'MMM d')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: 'Velocity', value: '39', icon: TrendingUp },
                  { label: 'Members', value: '5', icon: Users },
                  { label: 'Goal', value: '85%', icon: Target },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-muted/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold">{value}</div>
                    <div className="text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Prompts</h3>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                className="w-full text-left text-xs px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Accepted Suggestions */}
          {acceptedSuggestions.length > 0 && (
            <div className="p-4 border-t border-border space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Applied ({acceptedSuggestions.length})
              </h3>
              {acceptedSuggestions.map((id) => (
                <div key={id} className="flex items-center gap-2 text-xs text-green-500">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Suggestion accepted</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <AIPanel
            title="AI Sprint Planner"
            placeholder="Ask about sprint planning, velocity, or issue prioritization..."
            onAcceptSuggestion={handleAccept}
            initialMessages={[{
              role: 'assistant',
              content: `Hi ${currentUser.name.split(' ')[0]}! I'm your AI Sprint Planner. I have access to your team's velocity data, current backlog, and sprint history.\n\nI can help you:\n• Plan the optimal next sprint\n• Balance workload across team members\n• Identify risks and blockers\n• Set realistic sprint goals\n\nWhat would you like to work on?`,
            }]}
            className="flex-1"
          />
        </div>
      </div>
    </AppLayout>
  );
}
