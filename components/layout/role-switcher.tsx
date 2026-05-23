'use client';

import { useAppStore } from '@/lib/store';
import { ROLE_META, ALL_ROLES, getPermissions, getAccessLevel, ACCESS_SYMBOLS } from '@/lib/permissions';
import { PlanXRole } from '@/lib/types';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ShieldCheck, Settings2, FolderKanban, Code2, Bug, Eye,
  Check, Lock, ChevronRight,
} from 'lucide-react';

const roleIcons: Record<PlanXRole, React.ComponentType<{ className?: string }>> = {
  super_admin: ShieldCheck,
  admin: Settings2,
  manager: FolderKanban,
  developer: Code2,
  qa: Bug,
  viewer: Eye,
};

function RoleOption({ role, isActive, onSelect }: { role: PlanXRole; isActive: boolean; onSelect: () => void }) {
  const meta = ROLE_META[role];
  const Icon = roleIcons[role];
  const perms = getPermissions(role);

  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 cursor-pointer',
        isActive && 'bg-blue-500/10'
      )}
    >
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', meta.bgColor)}>
        <Icon className={cn('w-4 h-4', meta.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{meta.label}</span>
          {isActive && <Check className="w-3.5 h-3.5 text-blue-500" />}
        </div>
        <span className="text-xs text-muted-foreground">{perms.length} permissions</span>
      </div>
    </DropdownMenuItem>
  );
}

function PermissionPreview({ role }: { role: PlanXRole }) {
  const meta = ROLE_META[role];
  const perms = getPermissions(role);
  const sections = meta.sidebarSections;
  const totalNavItems = sections.reduce((sum, s) => sum + s.items.length, 0);

  const accessLevels = {
    full: perms.filter((p) => getAccessLevel(role, p) === 'full').length,
    read_only: perms.filter((p) => getAccessLevel(role, p) === 'read_only').length,
    limited: perms.filter((p) => getAccessLevel(role, p) === 'limited').length,
    own_only: perms.filter((p) => getAccessLevel(role, p) === 'own_only').length,
  };

  return (
    <div className="p-3 space-y-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role Preview</div>
      <p className="text-xs text-muted-foreground leading-relaxed">{meta.description}</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold">{perms.length}</div>
          <div className="text-xs text-muted-foreground">Permissions</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold">{totalNavItems}</div>
          <div className="text-xs text-muted-foreground">Nav items</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold">{sections.length}</div>
          <div className="text-xs text-muted-foreground">Sections</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(accessLevels).map(([level, count]) => {
          if (count === 0) return null;
          const colors: Record<string, string> = {
            full: 'border-green-500/30 text-green-500',
            read_only: 'border-blue-500/30 text-blue-500',
            limited: 'border-yellow-500/30 text-yellow-500',
            own_only: 'border-orange-500/30 text-orange-500',
          };
          return (
            <Badge key={level} variant="outline" className={cn('text-xs', colors[level])}>
              {ACCESS_SYMBOLS[level as keyof typeof ACCESS_SYMBOLS]} {count} {level.replace('_', ' ')}
            </Badge>
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground">Navigation</div>
        {sections.map((section) => (
          <div key={section.title} className="flex items-center gap-2 text-xs">
            <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
            <span className="font-medium">{section.title}</span>
            <span className="text-muted-foreground">({section.items.length})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoleSwitcher() {
  const { activeRole, setActiveRole, currentUser, effectiveRole } = useAppStore();
  const meta = ROLE_META[effectiveRole];
  const Icon = roleIcons[effectiveRole];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-2 px-2 hover:bg-muted">
          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', meta.bgColor)}>
            <Icon className={cn('w-3.5 h-3.5', meta.color)} />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs font-medium leading-none">{currentUser.name}</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">{meta.label}</span>
          </div>
          <Avatar className="w-6 h-6 shrink-0 ml-1">
            <AvatarFallback className="text-xs bg-blue-500/20 text-blue-400 font-semibold">
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role</DropdownMenuLabel>
        {ALL_ROLES.map((role) => (
          <RoleOption
            key={role}
            role={role}
            isActive={effectiveRole === role}
            onSelect={() => setActiveRole(role)}
          />
        ))}
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          <PermissionPreview role={effectiveRole} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
