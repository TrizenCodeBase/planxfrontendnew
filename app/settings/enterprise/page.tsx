'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAuditLogs } from '@/lib/mock-data';
import {
  Shield, Key, Users, Monitor, Clock, Globe, AlertTriangle,
  CheckCircle2, Download, RefreshCw, Plus, Trash2, Eye, Lock,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const activeSessions = [
  { id: 's1', device: 'Chrome on macOS', location: 'San Francisco, CA', ip: '192.168.1.45', lastActive: '2026-05-22T09:15:00Z', current: true },
  { id: 's2', device: 'Firefox on Windows', location: 'New York, NY', ip: '10.0.0.12', lastActive: '2026-05-21T18:30:00Z', current: false },
  { id: 's3', device: 'Safari on iPhone', location: 'San Francisco, CA', ip: '192.168.1.87', lastActive: '2026-05-20T10:00:00Z', current: false },
];

const ipAllowlist = [
  { id: 'ip1', cidr: '192.168.1.0/24', label: 'Office Network', addedAt: '2026-03-15' },
  { id: 'ip2', cidr: '10.0.0.0/8', label: 'VPN Range', addedAt: '2026-04-01' },
];

function AuditLogRow({ log }: { log: typeof mockAuditLogs[0] }) {
  const actionLabels: Record<string, string> = {
    'issue.status_changed': 'Issue status changed',
    'member.role_changed': 'Member role changed',
    'integration.connected': 'Integration connected',
    'settings.sso_configured': 'SSO configured',
    'sprint.created': 'Sprint created',
  };

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border last:border-0">
      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
        <AvatarFallback className="text-xs bg-blue-500/20 text-blue-400 font-semibold">
          {log.actor.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{log.actor.name}</span>
          <span className="text-sm text-muted-foreground">{actionLabels[log.action] ?? log.action}</span>
          <span className="font-mono text-xs text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{log.target}</span>
        </div>
        {log.metadata && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(' → ')}
          </div>
        )}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/60">
          <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
          <span>{log.ipAddress}</span>
          <span>{log.userAgent}</span>
        </div>
      </div>
    </div>
  );
}

export default function EnterprisePage() {
  const { can } = useAppStore();
  const [ssoEnabled, setSsoEnabled] = useState(false);

  if (!can('enterprise.manage')) {
    return <AppLayout title="Enterprise"><AccessDenied feature="Enterprise Settings" /></AppLayout>;
  }
  const [mfaRequired, setMfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('8h');
  const [ipRestriction, setIpRestriction] = useState(false);
  const [newIp, setNewIp] = useState('');

  return (
    <AppLayout title="Enterprise Settings">
      <div className="p-6 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Enterprise Settings</h2>
            <p className="text-sm text-muted-foreground">Security, compliance, and access management</p>
          </div>
          <Badge className="gap-1.5 bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Shield className="w-3.5 h-3.5" />
            Enterprise Plan
          </Badge>
        </div>

        <Tabs defaultValue="security">
          <TabsList className="mb-6">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            {/* SSO */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-500" />
                    <CardTitle className="text-sm">Single Sign-On (SSO)</CardTitle>
                  </div>
                  <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
                </div>
                <CardDescription>Configure SAML 2.0 or OIDC for enterprise authentication</CardDescription>
              </CardHeader>
              {ssoEnabled && (
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Provider</Label>
                      <Select defaultValue="okta">
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="okta">Okta</SelectItem>
                          <SelectItem value="azure">Azure AD</SelectItem>
                          <SelectItem value="google">Google Workspace</SelectItem>
                          <SelectItem value="onelogin">OneLogin</SelectItem>
                          <SelectItem value="custom">Custom SAML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Protocol</Label>
                      <Select defaultValue="saml">
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saml">SAML 2.0</SelectItem>
                          <SelectItem value="oidc">OIDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Identity Provider URL</Label>
                    <Input placeholder="https://your-org.okta.com/app/..." className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Entity ID / Audience URI</Label>
                    <Input placeholder="https://planx.io/saml/metadata" className="h-9 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="text-xs">Save SSO Configuration</Button>
                    <Button variant="outline" size="sm" className="text-xs">Test Connection</Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* MFA */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Require MFA for all members</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Users must complete MFA setup within 24 hours of login
                      </div>
                    </div>
                  </div>
                  <Switch checked={mfaRequired} onCheckedChange={setMfaRequired} />
                </div>
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <CardTitle className="text-sm">Session Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Session Timeout</Label>
                    <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="4h">4 hours</SelectItem>
                        <SelectItem value="8h">8 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="never">Never (not recommended)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Max Concurrent Sessions</Label>
                    <Select defaultValue="5">
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 session</SelectItem>
                        <SelectItem value="3">3 sessions</SelectItem>
                        <SelectItem value="5">5 sessions</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="sm" className="text-xs">Save Session Settings</Button>
              </CardContent>
            </Card>

            {/* IP Allowlist */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <CardTitle className="text-sm">IP Allowlist</CardTitle>
                  </div>
                  <Switch checked={ipRestriction} onCheckedChange={setIpRestriction} />
                </div>
                <CardDescription>Restrict access to specific IP ranges</CardDescription>
              </CardHeader>
              {ipRestriction && (
                <CardContent className="space-y-3 pt-0">
                  {ipAllowlist.map((ip) => (
                    <div key={ip.id} className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{ip.cidr}</span>
                          <span className="text-xs text-muted-foreground">{ip.label}</span>
                        </div>
                        <div className="text-xs text-muted-foreground/60 mt-0.5">Added {ip.addedAt}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="192.168.1.0/24"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      className="h-9 text-sm font-mono"
                    />
                    <Button size="sm" className="text-xs gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-500" />
                    <CardTitle className="text-sm">Active Sessions</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs text-red-500 hover:text-red-600">
                    Revoke all sessions
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0">
                    <Monitor className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{session.device}</span>
                        {session.current && (
                          <Badge className="text-xs bg-green-500/10 text-green-500 border-0">Current</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {session.location} · {session.ip}
                      </div>
                      <div className="text-xs text-muted-foreground/60 mt-0.5">
                        Last active {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 h-7">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Audit Logs</CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {mockAuditLogs.map((log) => (
                  <AuditLogRow key={log.id} log={log} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'SOC 2 Type II', status: 'compliant', note: 'Last audit: Jan 2026' },
                  { label: 'GDPR', status: 'compliant', note: 'DPA available on request' },
                  { label: 'HIPAA', status: 'partial', note: 'BAA available for enterprise' },
                  { label: 'ISO 27001', status: 'in_progress', note: 'Audit scheduled Q3 2026' },
                ].map(({ label, status, note }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{note}</div>
                    </div>
                    <Badge className={cn(
                      'text-xs border-0',
                      status === 'compliant' ? 'bg-green-500/10 text-green-500' :
                      status === 'partial' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    )}>
                      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Audit logs', value: '2 years' },
                  { label: 'Deleted issues', value: '90 days' },
                  { label: 'User data after deletion', value: '30 days' },
                  { label: 'Activity feeds', value: '1 year' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{value}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                    </div>
                  </div>
                ))}
                <Button size="sm" className="text-xs">Save Retention Policy</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
