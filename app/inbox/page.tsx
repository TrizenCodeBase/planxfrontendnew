'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, MessageSquare, UserPlus, GitCommit, Settings, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/lib/types';

const typeIcons = {
  mention: MessageSquare,
  assignment: UserPlus,
  comment: MessageSquare,
  status_change: GitCommit,
  system: Bell,
};

const typeColors = {
  mention: 'text-blue-500 bg-blue-500/10',
  assignment: 'text-green-500 bg-green-500/10',
  comment: 'text-blue-400 bg-blue-400/10',
  status_change: 'text-yellow-500 bg-yellow-500/10',
  system: 'text-muted-foreground bg-muted',
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { markNotificationRead } = useAppStore();
  const Icon = typeIcons[notification.type] ?? Bell;
  const colorClass = typeColors[notification.type] ?? typeColors.system;

  return (
    <div
      onClick={() => markNotificationRead(notification.id)}
      className={cn(
        'flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border last:border-0',
        !notification.read && 'bg-blue-500/3'
      )}
    >
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium">{notification.title}</span>
          {!notification.read && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-muted-foreground/60">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
          {notification.issueKey && (
            <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
              {notification.issueKey}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const { notifications, markAllNotificationsRead, getUnreadNotificationCount } = useAppStore();
  const unread = getUnreadNotificationCount();
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <AppLayout title="Inbox">
      <div className="p-6 max-w-[700px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Inbox</h2>
            {unread > 0 && (
              <Badge className="bg-blue-500 text-white border-0 text-xs">{unread}</Badge>
            )}
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={markAllNotificationsRead}>
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {unread === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <CheckCheck className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium">You&apos;re all caught up</p>
            <p className="text-sm text-muted-foreground mt-1">No unread notifications</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
            <div className="px-5 py-3 border-b border-border bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unread</span>
            </div>
            {unreadNotifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}

        {readNotifications.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Earlier</span>
            </div>
            {readNotifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
