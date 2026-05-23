'use client';

import { Bell, Search, Sun, Moon, PanelLeftClose, PanelLeft, Plus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { RoleSwitcher } from './role-switcher';

export function Topbar({ title }: { title?: string }) {
  const {
    sidebarCollapsed, toggleSidebar, notifications, activeRole,
    markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount, theme, setTheme, can,
  } = useAppStore();

  const unread = getUnreadNotificationCount();
  const canCreate = can('issues.create');

  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleSidebar}>
        {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </Button>

      {title && (
        <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
      )}

      <div className="flex-1" />

      <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-muted-foreground hidden sm:flex">
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="text-xs bg-muted px-1 py-0.5 rounded font-mono ml-1">⌘K</kbd>
      </Button>

      {/* New Issue — role-conditional */}
      {canCreate ? (
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Issue</span>
        </Button>
      ) : (
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground/40" disabled>
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Read-only</span>
        </Button>
      )}

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                {unread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={cn(
                  'px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0',
                  !n.read && 'bg-blue-500/5'
                )}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                  <div className={cn('flex-1', n.read && 'pl-3.5')}>
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      {/* Role Switcher */}
      <RoleSwitcher />
    </header>
  );
}
