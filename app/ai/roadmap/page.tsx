'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { AIPanel, AISuggestion } from '@/components/ai/ai-panel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, CheckCircle2, Calendar, Flag, Layers } from 'lucide-react';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';

const quickPrompts = [
  'Generate Q3 2026 product roadmap',
  'Create milestones for enterprise launch',
  'Plan mobile app release timeline',
  'Identify dependencies across quarters',
  'Roadmap for AI features rollout',
];

export default function RoadmapPage() {
  const { currentUser, can } = useAppStore();

  if (!can('ai.use')) {
    return <AppLayout title="AI Roadmap"><AccessDenied feature="AI Features" /></AppLayout>;
  }
  const [accepted, setAccepted] = useState<AISuggestion[]>([]);

  return (
    <AppLayout title="AI Roadmap Generator">
      <div className="h-[calc(100vh-3.5rem)] flex">
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Roadmap AI</h2>
                <p className="text-xs text-muted-foreground">Strategic planning</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI analyzes your backlog and generates strategic roadmaps with milestones and dependencies.
            </p>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Prompts</h3>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                className="w-full text-left text-xs px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Current Milestones */}
          <div className="p-4 border-t border-border space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Roadmap Preview</h3>
            {[
              { q: 'Q2 2026', theme: 'Enterprise Foundation', color: 'bg-blue-500' },
              { q: 'Q3 2026', theme: 'Integration Ecosystem', color: 'bg-green-500' },
              { q: 'Q4 2026', theme: 'AI-Native Platform', color: 'bg-orange-500' },
            ].map(({ q, theme, color }) => (
              <div key={q} className="flex items-center gap-2.5 text-xs">
                <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <div>
                  <div className="font-medium">{q}</div>
                  <div className="text-muted-foreground">{theme}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <AIPanel
            title="AI Roadmap Generator"
            placeholder="Describe your goals, timeline, or ask for roadmap recommendations..."
            onAcceptSuggestion={(s) => setAccepted((prev) => [...prev, s])}
            initialMessages={[{
              role: 'assistant',
              content: `I can help you build a strategic product roadmap based on your backlog, team capacity, and business goals.\n\nI can:\n• Generate quarterly roadmaps with milestones\n• Identify dependencies between initiatives\n• Balance features, technical debt, and growth\n• Estimate timelines based on velocity\n\nWhat time horizon and focus areas should I plan for?`,
            }]}
            className="flex-1"
          />
        </div>
      </div>
    </AppLayout>
  );
}
