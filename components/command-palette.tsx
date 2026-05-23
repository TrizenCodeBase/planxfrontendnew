'use client';

import { useRouter } from 'next/navigation';
import {
  Command, CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard, Kanban, List, BarChart3, Settings, Bell,
  Sparkles, Zap, GitBranch, Network, Plug, Shield, Boxes,
  GitMerge, SlidersHorizontal, Tag, Puzzle, Package, Gauge,
  GitPullRequest, Timer, TestTube, CheckSquare, Clock,
  RotateCcw, Activity, Calendar,
} from 'lucide-react';
import { Badge } from './ui/badge';

const routes = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { href: '/inbox', label: 'Inbox', icon: Bell, group: 'Navigation' },
  { href: '/my-issues', label: 'My Issues', icon: List, group: 'Navigation' },
  { href: '/projects/px/board', label: 'Kanban Board', icon: Kanban, group: 'Project Views' },
  { href: '/projects/px/backlog', label: 'Backlog', icon: List, group: 'Project Views' },
  { href: '/projects/px/dependencies', label: 'Dependency Graph', icon: Network, group: 'Project Views' },
  { href: '/projects/px/reports', label: 'Reports', icon: BarChart3, group: 'Project Views' },
  { href: '/projects/px/timeline', label: 'Timeline', icon: Activity, group: 'Project Views' },
  { href: '/projects/px/calendar', label: 'Calendar', icon: Calendar, group: 'Project Views' },
  { href: '/admin/workflow', label: 'Workflow Builder', icon: GitMerge, group: 'Admin' },
  { href: '/admin/custom-fields', label: 'Custom Fields', icon: SlidersHorizontal, group: 'Admin' },
  { href: '/admin/automation', label: 'Automation', icon: Zap, group: 'Admin' },
  { href: '/admin/labels', label: 'Labels', icon: Tag, group: 'Admin' },
  { href: '/admin/components', label: 'Components', icon: Puzzle, group: 'Admin' },
  { href: '/admin/releases', label: 'Releases', icon: Package, group: 'Admin' },
  { href: '/manager/capacity', label: 'Capacity Planning', icon: Gauge, group: 'Manager' },
  { href: '/dev/pull-requests', label: 'Pull Requests', icon: GitPullRequest, group: 'Developer' },
  { href: '/dev/time-tracking', label: 'Time Logs', icon: Timer, group: 'Developer' },
  { href: '/qa/testing-queue', label: 'Testing Queue', icon: TestTube, group: 'QA' },
  { href: '/qa/verification', label: 'Verification', icon: CheckSquare, group: 'QA' },
  { href: '/qa/sla', label: 'SLA Tracking', icon: Clock, group: 'QA' },
  { href: '/ai/sprint-planner', label: 'AI Sprint Planner', icon: Zap, group: 'AI Features' },
  { href: '/ai/task-generator', label: 'AI Task Generator', icon: Sparkles, group: 'AI Features' },
  { href: '/ai/roadmap', label: 'AI Roadmap', icon: GitBranch, group: 'AI Features' },
  { href: '/settings/integrations', label: 'Integrations', icon: Plug, group: 'Settings' },
  { href: '/settings/enterprise', label: 'Enterprise Settings', icon: Shield, group: 'Settings' },
  { href: '/settings/white-label', label: 'White Label', icon: Boxes, group: 'Settings' },
  { href: '/settings/team', label: 'Team Members', icon: List, group: 'Settings' },
  { href: '/settings', label: 'Settings', icon: Settings, group: 'Settings' },
];

const groups = ['Navigation', 'Project Views', 'Admin', 'Manager', 'Developer', 'QA', 'AI Features', 'Settings'];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, issues } = useAppStore();
  const router = useRouter();

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search pages, issues, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {groups.map((group) => {
          const items = routes.filter((r) => r.group === group);
          if (items.length === 0) return null;
          return (
            <CommandGroup key={group} heading={group}>
              {items.map((route) => (
                <CommandItem
                  key={route.href}
                  onSelect={() => handleSelect(route.href)}
                  className="flex items-center gap-2"
                >
                  <route.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{route.label}</span>
                  {route.group === 'AI Features' && (
                    <Badge className="ml-auto text-xs h-4 px-1 bg-blue-500/10 text-blue-500 border-0">AI</Badge>
                  )}
                  {route.group === 'QA' && (
                    <Badge className="ml-auto text-xs h-4 px-1 bg-orange-500/10 text-orange-500 border-0">QA</Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}

        <CommandSeparator />

        <CommandGroup heading="Recent Issues">
          {issues.slice(0, 5).map((issue) => (
            <CommandItem key={issue.id} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{issue.key}</span>
              <span className="flex-1 truncate">{issue.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
