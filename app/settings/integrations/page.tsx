'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied, ReadOnlyBadge } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockIntegrations } from '@/lib/mock-data';
import { Integration } from '@/lib/types';
import {
  Github, GitBranch, MessageSquare, Headphones, Bug, Figma,
  Plug, CheckCircle2, AlertCircle, RefreshCw, MoreHorizontal,
  ExternalLink, Zap, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github, GitBranch, MessageSquare, Headphones, Bug, Figma,
};

const statusConfig = {
  connected: { label: 'Connected', className: 'bg-green-500/10 text-green-500 border-0', icon: CheckCircle2 },
  disconnected: { label: 'Not connected', className: 'bg-muted text-muted-foreground border-0', icon: Plug },
  error: { label: 'Error', className: 'bg-red-500/10 text-red-500 border-0', icon: AlertCircle },
};

function IntegrationCard({ integration }: { integration: Integration }) {
  const [connecting, setConnecting] = useState(false);
  const Icon = iconMap[integration.icon] ?? Plug;
  const status = statusConfig[integration.status];
  const StatusIcon = status.icon;

  const handleConnect = async () => {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setConnecting(false);
  };

  return (
    <Card className="group hover:border-blue-500/30 transition-all duration-150">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{integration.name}</div>
              <Badge className={cn('text-xs mt-1', status.className)}>
                <StatusIcon className="w-2.5 h-2.5 mr-1" />
                {status.label}
              </Badge>
            </div>
          </div>
          {integration.status === 'connected' && (
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {integration.description}
        </p>

        {integration.syncedAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Clock className="w-3 h-3" />
            Synced {formatDistanceToNow(new Date(integration.syncedAt), { addSuffix: true })}
          </div>
        )}

        {integration.status === 'error' && (
          <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-500/10 rounded-md px-2.5 py-1.5 mb-3">
            <AlertCircle className="w-3 h-3 shrink-0" />
            Connection error. Re-authenticate to fix.
          </div>
        )}

        <div className="flex gap-2">
          {integration.status === 'connected' ? (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1 flex-1">
                <RefreshCw className="w-3 h-3" /> Sync now
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <ExternalLink className="w-3 h-3" /> Configure
              </Button>
            </>
          ) : integration.status === 'error' ? (
            <Button size="sm" className="text-xs flex-1 gap-1" onClick={handleConnect} disabled={connecting}>
              {connecting ? <><RefreshCw className="w-3 h-3 animate-spin" /> Reconnecting...</> : 'Reconnect'}
            </Button>
          ) : (
            <Button size="sm" className="text-xs flex-1 gap-1" onClick={handleConnect} disabled={connecting}>
              {connecting ? <><RefreshCw className="w-3 h-3 animate-spin" /> Connecting...</> : <><Plug className="w-3 h-3" /> Connect</>}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function IntegrationsPage() {
  const { can } = useAppStore();
  const connected = mockIntegrations.filter((i) => i.status === 'connected');

  if (!can('integrations.view')) {
    return <AppLayout title="Integrations"><AccessDenied feature="Integrations" /></AppLayout>;
  }
  const available = mockIntegrations.filter((i) => i.status !== 'connected');

  return (
    <AppLayout title="Integrations">
      <div className="p-6 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Integration Center</h2>
            <p className="text-sm text-muted-foreground">Connect your tools and automate workflows</p>
          </div>
          <Badge className="gap-1.5 bg-blue-500/10 text-blue-500 border-0">
            {connected.length} connected
          </Badge>
        </div>

        {/* Webhooks Banner */}
        <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Custom Webhooks</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Send real-time events to any URL when issues change, sprints start, or team actions occur.
              </div>
            </div>
            <Button size="sm" className="text-xs gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5" /> Configure Webhooks
            </Button>
          </CardContent>
        </Card>

        {/* Connected */}
        {connected.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Connected ({connected.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connected.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </div>
        )}

        {/* Available */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
