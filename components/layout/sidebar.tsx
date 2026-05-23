'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Kanban, List, Calendar, BarChart3, Settings,
  Bell, Search, ChevronDown, Plus, Layers, GitBranch, Plug,
  Users, Shield, Sparkles, Boxes, Zap, ChevronRight,
  FolderKanban, Activity, Network, Code2, Bug, Eye,
  ShieldCheck, Settings2, GitMerge, SlidersHorizontal, Tag,
  Puzzle, Package, Gauge, GitPullRequest, Timer, TestTube,
  CheckSquare, Clock, ScrollText, RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { ROLE_META, SidebarSection, SidebarItem as SidebarItemType } from '@/lib/permissions';
import { PlanXRole } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Kanban, List, Calendar, BarChart3, Settings,
  Bell, GitBranch, Plug, Users, Shield, Sparkles, Boxes, Zap,
  FolderKanban, Activity, Network, Code2, Bug, Eye,
  ChevronRight, ShieldCheck, Settings2, GitMerge, SlidersHorizontal,
  Tag, Puzzle, Package, Gauge, GitPullRequest, Timer, TestTube,
  CheckSquare, Clock, ScrollText, RotateCcw,
};

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
  collapsed?: boolean;
}

function NavItem({ href, label, icon: Icon, badge, collapsed }: NavItemProps) {
  const pathname = usePathname();
  const unreadCount = useAppStore((s) => s.getUnreadNotificationCount());
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'sidebar-item',
            isActive && 'active',
            collapsed && 'justify-center px-2'
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{label}</span>
              {badge && unreadCount > 0 && (
                <Badge className="h-4 min-w-4 px-1 text-xs bg-blue-500 text-white border-0 rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </>
          )}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  defaultOpen?: boolean;
}

function Section({ title, children, collapsed, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) return <div className="space-y-0.5">{children}</div>;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 w-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        <ChevronRight className={cn('w-3 h-3 transition-transform', open && 'rotate-90')} />
        {title}
      </button>
      {open && <div className="mt-0.5 space-y-0.5">{children}</div>}
    </div>
  );
}

const roleBadgeColors: Record<PlanXRole, string> = {
  super_admin: 'bg-red-500/20 text-red-400',
  admin: 'bg-cyan-500/20 text-cyan-400',
  manager: 'bg-blue-500/20 text-blue-400',
  developer: 'bg-green-500/20 text-green-400',
  qa: 'bg-orange-500/20 text-orange-400',
  viewer: 'bg-slate-500/20 text-slate-400',
};

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, projects, activeProjectId, setActiveProject, currentUser, activeRole, effectiveRole } = useAppStore();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const roleMeta = ROLE_META[effectiveRole];

  const renderSidebarSection = (section: SidebarSection) => {
    const items = section.items.map((item) => {
      const IconComp = iconMap[item.icon] ?? LayoutDashboard;
      const fullHref = item.projectKey
        ? `/projects/${item.projectKey}${item.href}`
        : item.href;

      return (
        <NavItem
          key={fullHref + item.label}
          href={fullHref}
          label={item.label}
          icon={IconComp}
          badge={item.badge}
          collapsed={sidebarCollapsed}
        />
      );
    });

    return (
      <Section
        key={section.title}
        title={sidebarCollapsed ? '' : section.title}
        collapsed={sidebarCollapsed}
        defaultOpen={section.defaultOpen}
      >
        {items}
      </Section>
    );
  };

  const showProjects = effectiveRole === 'super_admin' || effectiveRole === 'admin' || effectiveRole === 'manager';

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r transition-all duration-200 ease-in-out shrink-0',
        'bg-[hsl(var(--sidebar-bg))] border-[hsl(var(--sidebar-border))]',
        sidebarCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center h-14 px-3 border-b border-[hsl(var(--sidebar-border))]', sidebarCollapsed && 'justify-center')}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[hsl(var(--sidebar-fg-active))] text-sm">PlanX</span>
            <span className={cn('ml-auto text-xs px-1.5 py-0.5 rounded font-medium', roleBadgeColors[effectiveRole])}>
              {roleMeta.label}
            </span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <button className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))] hover:text-[hsl(var(--sidebar-fg-active))] transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="ml-auto text-xs bg-white/5 px-1 py-0.5 rounded font-mono">⌘K</kbd>
          </button>
        </div>
      )}

      {/* Projects picker */}
      {!sidebarCollapsed && showProjects && (
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between px-2.5 py-1">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <ChevronRight className={cn('w-3 h-3 transition-transform', projectsOpen && 'rotate-90')} />
              Projects
            </button>
            <button className="p-0.5 rounded hover:bg-white/5 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {projectsOpen && (
            <div className="mt-0.5 space-y-0.5">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={cn('sidebar-item w-full', activeProjectId === project.id && 'active')}
                >
                  <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: project.color }}>
                    {project.key[0]}
                  </div>
                  <span className="flex-1 text-left truncate">{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Role-based nav sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-2 px-2 space-y-1">
        {!sidebarCollapsed && showProjects && (
          <div className="border-t border-[hsl(var(--sidebar-border))] my-2" />
        )}
        {roleMeta.sidebarSections.map(renderSidebarSection)}
      </div>

      {/* Quick Actions */}
      {!sidebarCollapsed && roleMeta.quickActions.length > 0 && (
        <div className="px-3 py-2 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex flex-wrap gap-1">
            {roleMeta.quickActions.map((action) => {
              const IconComp = iconMap[action.icon] ?? Zap;
              return (
                <Link key={action.label} href={action.href}>
                  <button className={cn('flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[hsl(var(--sidebar-hover))] hover:bg-white/10 transition-colors', action.color)}>
                    <IconComp className="w-3 h-3" />
                    {action.label}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* User footer */}
      <div className={cn(
        'flex items-center gap-2.5 p-3 border-t border-[hsl(var(--sidebar-border))] cursor-pointer hover:bg-[hsl(var(--sidebar-hover))] transition-colors',
        sidebarCollapsed && 'justify-center'
      )}>
        <Avatar className="w-7 h-7 shrink-0">
          <AvatarFallback className={cn('text-xs font-semibold', roleBadgeColors[effectiveRole])}>
            {currentUser.avatar}
          </AvatarFallback>
        </Avatar>
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[hsl(var(--sidebar-fg-active))] truncate">{currentUser.name}</div>
            <div className="text-xs text-[hsl(var(--sidebar-fg))] truncate">{roleMeta.label}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
