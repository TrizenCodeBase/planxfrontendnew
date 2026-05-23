'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { AIPanel, AISuggestion } from '@/components/ai/ai-panel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, Bug, Zap, ClipboardList } from 'lucide-react';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';

const templates = [
  { icon: Sparkles, label: 'Feature breakdown', prompt: 'Break down a new user authentication feature into tasks' },
  { icon: Bug, label: 'Bug investigation', prompt: 'Create tasks for investigating and fixing a production bug' },
  { icon: Zap, label: 'Performance work', prompt: 'Generate tasks for a performance optimization initiative' },
  { icon: ClipboardList, label: 'Epic decomposition', prompt: 'Decompose an epic into sprint-ready user stories' },
];

export default function TaskGeneratorPage() {
  const { currentUser, can } = useAppStore();

  if (!can('ai.use')) {
    return <AppLayout title="AI Task Generator"><AccessDenied feature="AI Features" /></AppLayout>;
  }
  const [accepted, setAccepted] = useState<AISuggestion[]>([]);

  const handleAccept = (suggestion: AISuggestion) => {
    setAccepted((prev) => [...prev, suggestion]);
  };

  return (
    <AppLayout title="AI Task Generator">
      <div className="h-[calc(100vh-3.5rem)] flex">
        {/* Left - Templates */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Task Generator</h2>
                <p className="text-xs text-muted-foreground">AI-powered</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Describe a feature, epic, or user story and AI will generate a set of actionable tasks.
            </p>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Templates</h3>
            {templates.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <div className="text-xs font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground truncate">{prompt.slice(0, 40)}...</div>
                </div>
              </button>
            ))}
          </div>

          {accepted.length > 0 && (
            <div className="p-4 border-t border-border space-y-2 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Tasks Created ({accepted.length})
              </h3>
              {accepted.map((s) => (
                <div key={s.id} className="flex items-start gap-2 text-xs p-2 bg-green-500/5 border border-green-500/20 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{s.title}</span>
                </div>
              ))}
              <Button size="sm" className="w-full text-xs mt-2">Add all to backlog</Button>
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <AIPanel
            title="AI Task Generator"
            placeholder="Describe a feature, bug, or epic to generate tasks..."
            onAcceptSuggestion={handleAccept}
            initialMessages={[{
              role: 'assistant',
              content: `Hello! I can transform high-level descriptions into sprint-ready tasks.\n\nJust describe:\n• A feature you want to build\n• A bug that needs investigation\n• An epic to decompose\n• Any technical initiative\n\nI'll generate detailed, properly estimated tasks with acceptance criteria. What would you like to build?`,
            }]}
            className="flex-1"
          />
        </div>
      </div>
    </AppLayout>
  );
}
