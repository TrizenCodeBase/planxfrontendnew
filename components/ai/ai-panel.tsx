'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Sparkles, Send, RefreshCw, Check, Copy, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  suggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, string | number>;
}

interface AIPanelProps {
  title: string;
  placeholder?: string;
  initialMessages?: AIMessage[];
  onAcceptSuggestion?: (suggestion: AISuggestion) => void;
  className?: string;
}

function TypingMessage({ content, onDone }: { content: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const speed = 8;
    const interval = setInterval(() => {
      if (i < content.length) {
        setDisplayed(content.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [content, onDone]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-foreground/80 ml-0.5 animate-pulse align-middle" />}
    </span>
  );
}

function SuggestionCard({ suggestion, onAccept }: {
  suggestion: AISuggestion;
  onAccept: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all duration-200',
      accepted ? 'border-green-500/50 bg-green-500/5' : 'border-border bg-card hover:border-blue-500/40'
    )}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-medium text-blue-500 uppercase tracking-wide">{suggestion.type}</span>
          </div>
          <p className="text-sm font-medium">{suggestion.title}</p>
        </div>
        <Button
          size="sm"
          variant={accepted ? 'outline' : 'default'}
          className={cn('h-7 text-xs gap-1 shrink-0', accepted && 'text-green-500 border-green-500/50')}
          onClick={() => { setAccepted(true); onAccept(); }}
          disabled={accepted}
        >
          {accepted ? <><Check className="w-3 h-3" /> Accepted</> : 'Accept'}
        </Button>
      </div>
      {suggestion.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.description}</p>
      )}
      {suggestion.metadata && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(suggestion.metadata).map(([k, v]) => (
            <span key={k} className="text-xs bg-muted px-2 py-0.5 rounded font-medium">
              {k}: {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message, onAcceptSuggestion, isNew, onTypingDone }: {
  message: AIMessage;
  onAcceptSuggestion?: (s: AISuggestion) => void;
  isNew?: boolean;
  onTypingDone?: () => void;
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
          {isNew && message.streaming ? (
            <TypingMessage content={message.content} onDone={onTypingDone ?? (() => {})} />
          ) : (
            message.content
          )}
        </div>
        {message.suggestions && !message.streaming && (
          <div className="space-y-2">
            {message.suggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onAccept={() => onAcceptSuggestion?.(s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AIPanel({ title, placeholder, initialMessages = [], onAcceptSuggestion, className }: AIPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingDone, setStreamingDone] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || !streamingDone) return;
    setLoading(true);
    setStreamingDone(false);

    const userMsg: AIMessage = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    await new Promise((r) => setTimeout(r, 800));

    const responseContent = generateMockResponse(text, title);
    const assistantMsg: AIMessage = {
      role: 'assistant',
      content: responseContent.text,
      streaming: true,
      suggestions: responseContent.suggestions,
    };

    setMessages((m) => [...m, assistantMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground mt-1">Ask me anything to get started</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            onAcceptSuggestion={onAcceptSuggestion}
            isNew={i === messages.length - 1}
            onTypingDone={() => {
              setStreamingDone(true);
              setMessages((m) => m.map((msg2, j) => j === i ? { ...msg2, streaming: false } : msg2));
            }}
          />
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Ask the AI assistant...'}
            className="min-h-[44px] max-h-24 resize-none text-sm"
            rows={1}
          />
          <Button
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim() || !streamingDone}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}

function generateMockResponse(input: string, context: string): { text: string; suggestions?: AISuggestion[] } {
  const lower = input.toLowerCase();

  if (context.includes('Sprint')) {
    return {
      text: `Based on your team's velocity of 39 story points per sprint and current backlog, here's my recommended sprint composition for Sprint 24. I've analyzed task complexity, team capacity, and priority alignment to optimize for a 90% completion probability.`,
      suggestions: [
        {
          id: 's1', type: 'Sprint Goal',
          title: 'Complete integration hub + mobile notifications',
          description: 'Focused goal with clear deliverables. Aligns with Q2 roadmap milestones.',
          metadata: { 'Story Points': 34, 'Issues': 8, 'Risk': 'Low' },
        },
        {
          id: 's2', type: 'Issue to Include',
          title: 'PX-008: Integration hub: GitHub sync',
          description: 'High priority, assignee available, no blockers. 8 story points.',
          metadata: { 'Priority': 'High', 'Points': 8, 'Assignee': 'Sam' },
        },
        {
          id: 's3', type: 'Issue to Include',
          title: 'PX-007: Mobile app push notifications',
          description: 'Low risk, clear requirements. 5 story points.',
          metadata: { 'Priority': 'Low', 'Points': 5 },
        },
      ],
    };
  }

  if (context.includes('Task') || lower.includes('task') || lower.includes('issue')) {
    return {
      text: `I've generated a set of actionable tasks based on your input. These tasks are scoped for a single sprint and follow your team's definition of done.`,
      suggestions: [
        {
          id: 't1', type: 'Feature',
          title: 'Set up OAuth2 provider integration',
          description: 'Implement the OAuth2 client with PKCE flow for secure authorization.',
          metadata: { 'Points': 5, 'Priority': 'High', 'Type': 'Feature' },
        },
        {
          id: 't2', type: 'Task',
          title: 'Write unit tests for auth service',
          description: 'Cover token refresh, expiry, and error cases with 80% coverage minimum.',
          metadata: { 'Points': 3, 'Priority': 'Medium', 'Type': 'Task' },
        },
        {
          id: 't3', type: 'Task',
          title: 'Update API documentation',
          description: 'Document all new auth endpoints in OpenAPI 3.0 format.',
          metadata: { 'Points': 2, 'Priority': 'Low', 'Type': 'Task' },
        },
      ],
    };
  }

  if (context.includes('Roadmap') || lower.includes('roadmap')) {
    return {
      text: `Here's a strategic roadmap based on your current backlog and team capacity. I've clustered related issues into themed milestones with realistic delivery windows.`,
      suggestions: [
        {
          id: 'r1', type: 'Q2 Milestone',
          title: 'Enterprise Auth & Security',
          description: 'SSO, audit logs, session management, IP allowlist. Foundation for enterprise deals.',
          metadata: { 'Duration': '4 weeks', 'Issues': 6, 'Priority': 'Critical' },
        },
        {
          id: 'r2', type: 'Q3 Milestone',
          title: 'Integration Ecosystem',
          description: 'GitHub, GitLab, Slack, Discord, Sentry integrations. Drives user acquisition.',
          metadata: { 'Duration': '6 weeks', 'Issues': 12, 'Priority': 'High' },
        },
        {
          id: 'r3', type: 'Q3 Milestone',
          title: 'AI-Native Features',
          description: 'Sprint planner, issue summarizer, auto-triage. Key differentiator.',
          metadata: { 'Duration': '8 weeks', 'Issues': 8, 'Priority': 'High' },
        },
      ],
    };
  }

  return {
    text: `I understand your request. Based on the current project context, team velocity, and backlog health, here are my recommendations. I've analyzed 10 sprints of historical data and the current issue landscape to provide these insights.`,
    suggestions: [
      {
        id: 'g1', type: 'Recommendation',
        title: 'Reduce WIP to improve cycle time',
        description: 'Your team has 6 issues in progress simultaneously. Limiting to 3 would reduce context switching and improve throughput.',
        metadata: { 'Impact': 'High', 'Effort': 'Low' },
      },
    ],
  };
}
