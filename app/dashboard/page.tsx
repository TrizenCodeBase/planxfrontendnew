'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockIssues, mockSprints, velocityData, burndownData, issueDistribution, teamActivityData } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import { ROLE_META } from '@/lib/permissions';
import { ReadOnlyBadge, OwnOnlyBadge, LimitedBadge } from '@/components/layout/permission-guard';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { StatusBadge, PriorityBadge } from '@/components/issues/issue-badge';
import {
  TrendingUp, TrendingDown, CheckCircle2,
  AlertCircle, Users, ArrowRight, Sparkles,
  Target, Activity, Shield, Bug, Code2, Eye,
  Clock, GitCommit, GitPullRequest, Timer,
  Server, Cpu, HardDrive, Wifi, AlertTriangle,
  Settings2, FolderKanban, ShieldCheck,
  Gauge, Zap, TestTube, XCircle, PlayCircle,
  Lock, BarChart3, Package, GitMerge, RotateCcw, UserPlus, Plug, Layers, Plus,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

function RoleGreeting() {
  const { effectiveRole, currentUser } = useAppStore();
  const meta = ROLE_META[effectiveRole];
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">{timeGreeting}, {currentUser.name.split(' ')[0]}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={cn('text-xs border-0', meta.bgColor, meta.color)}>{meta.label}</Badge>
          <span className="text-muted-foreground text-sm">{meta.subtitle}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {meta.quickActions.slice(0, 3).map((action) => {
          const IconMap: Record<string, any> = { Plus: AlertCircle, Zap, Sparkles, Shield, Bug, Eye, Timer, GitPullRequest, CheckCircle2, RotateCcw, UserPlus: Users, Gauge, Package, GitMerge, Plug: Zap };
          const Icon = IconMap[action.icon] ?? Zap;
          return (
            <Link key={action.label} href={action.href}>
              <Button variant="outline" size="sm" className={cn('gap-1.5', action.color)}>
                <Icon className="w-3.5 h-3.5" />
                {action.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// 1. SUPER ADMIN DASHBOARD
function SuperAdminDashboard() {
  const { issues } = useAppStore();
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Workspace Users', value: '24', sub: '5 online', trend: '+3 this month', up: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'System Uptime', value: '99.9%', sub: 'Last 30 days', trend: 'Healthy', up: true, icon: Server, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Security Alerts', value: '2', sub: '1 critical', trend: 'Needs review', up: false, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { title: 'AI Insights', value: '12', sub: '3 high impact', trend: 'Pending review', up: true, icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((s) => (
          <Card key={s.title}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
            <div className={`text-xs mt-1.5 flex items-center gap-1 ${s.up ? 'text-green-500' : 'text-red-500'}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{s.trend}
            </div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /><CardTitle className="text-sm font-semibold">System Health</CardTitle>
            <Badge className="text-xs bg-green-500/10 text-green-500 border-0 ml-auto">All operational</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'API', value: '45ms', icon: Cpu },
              { label: 'Database', value: '99.9%', icon: HardDrive },
              { label: 'CDN', value: '12ms', icon: Wifi },
            ].map((svc) => (
              <div key={svc.label} className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <svc.icon className="w-4 h-4 text-green-500 shrink-0" />
                <div><div className="text-xs font-medium">{svc.label}</div><div className="text-xs text-muted-foreground">{svc.value}</div></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sprint Velocity</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={200}>
            <BarChart data={velocityData} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="committed" name="Committed" fill="hsl(var(--muted))" radius={[3,3,0,0]} />
              <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Audit Activity</CardTitle>
              <Link href="/settings/enterprise"><Button variant="ghost" size="sm" className="h-7 text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="p-0"><div className="divide-y divide-border">
            {[
              { action: 'Issue status changed', target: 'PX-002', user: 'AC', time: '2h ago' },
              { action: 'Member role changed', target: 'jordan@planx.io', user: 'AC', time: '1d ago' },
              { action: 'SSO configured', target: 'Okta', user: 'AC', time: '3d ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5 text-xs">
                <Avatar className="w-5 h-5 shrink-0"><AvatarFallback className="text-xs bg-blue-500/20 text-blue-400">{log.user}</AvatarFallback></Avatar>
                <span className="text-muted-foreground flex-1">{log.action}</span>
                <span className="font-mono text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{log.target}</span>
                <span className="text-muted-foreground/60">{log.time}</span>
              </div>
            ))}
          </div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: '5', icon: Users },
          { label: 'API Calls Today', value: '12.4k', icon: Cpu },
          { label: 'Storage Used', value: '2.3 GB', icon: HardDrive },
          { label: 'SLA Compliance', value: '99.7%', icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}><CardContent className="p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
            <div><div className="text-lg font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}

// 2. ADMIN DASHBOARD
function AdminDashboard() {
  const { issues, can } = useAppStore();
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Active Workflows', value: '7', sub: '2 need updates', icon: GitMerge, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { title: 'Custom Fields', value: '14', sub: '3 new this week', icon: Settings2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Automations', value: '23', sub: '5 triggered today', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { title: 'Releases', value: '4', sub: '1 pending deploy', icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((s) => (
          <Card key={s.title}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Workflow Status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {['Bug Lifecycle', 'Feature Flow', 'Release Pipeline', 'Hotfix Process'].map((wf, i) => (
              <div key={wf} className="flex items-center gap-3">
                <GitMerge className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="flex-1 text-sm">{wf}</span>
                <Badge className={cn('text-xs border-0', i < 3 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500')}>
                  {i < 3 ? 'Active' : 'Draft'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Automations</CardTitle></CardHeader>
          <CardContent className="p-0"><div className="divide-y divide-border">
            {[
              { name: 'Auto-assign urgent bugs', trigger: 'Issue created', runs: 45 },
              { name: 'Sprint auto-close', trigger: 'Sprint end date', runs: 12 },
              { name: 'Stale issue reminder', trigger: '7 days idle', runs: 28 },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                <Zap className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                <span className="flex-1 font-medium">{a.name}</span>
                <span className="text-muted-foreground">{a.trigger}</span>
                <span className="font-mono text-muted-foreground">{a.runs} runs</span>
              </div>
            ))}
          </div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sprint Velocity</CardTitle></CardHeader>
        <CardContent><ResponsiveContainer width="100%" height={200}>
          <BarChart data={velocityData} barSize={22} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="sprint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="committed" name="Committed" fill="hsl(var(--muted))" radius={[3,3,0,0]} />
            <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer></CardContent>
      </Card>
    </>
  );
}

// 3. MANAGER DASHBOARD
function ManagerDashboard() {
  const { issues } = useAppStore();
  const activeSprint = mockSprints.find((s) => s.status === 'active');
  const sprintIssues = issues.filter((i) => i.sprintId === activeSprint?.id);
  const totalPts = sprintIssues.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
  const donePts = sprintIssues.filter((i) => i.status === 'done').reduce((s, i) => s + (i.storyPoints ?? 0), 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Sprint Progress', value: '52%', sub: `${donePts}/${totalPts} pts`, trend: '+8%', up: true, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Team Workload', value: '85%', sub: '4 active', trend: 'Balanced', up: true, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Velocity', value: '39 pts', sub: '5-sprint avg', trend: '+12%', up: true, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { title: 'Open Issues', value: '18', sub: '6 urgent', trend: '3 overdue', up: false, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((s) => (
          <Card key={s.title}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
            <div className={`text-xs mt-1.5 flex items-center gap-1 ${s.up ? 'text-green-500' : 'text-red-500'}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{s.trend}
            </div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sprint Velocity</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={220}>
            <BarChart data={velocityData} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="committed" name="Committed" fill="hsl(var(--muted))" radius={[3,3,0,0]} />
              <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Team Capacity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Alex Chen', allocated: 13, capacity: 13, role: 'Dev' },
              { name: 'Jordan Lee', allocated: 8, capacity: 10, role: 'Dev' },
              { name: 'Sam Rivera', allocated: 11, capacity: 10, role: 'Manager' },
              { name: 'Morgan Kim', allocated: 5, capacity: 8, role: 'QA' },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-blue-500/20 text-blue-400">{m.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{m.name}</span>
                    <span className={cn(m.allocated > m.capacity ? 'text-red-500' : 'text-muted-foreground')}>{m.allocated}/{m.capacity} pts</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', m.allocated > m.capacity ? 'bg-red-500' : 'bg-blue-500')} style={{ width: `${Math.min((m.allocated / m.capacity) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Recent Issues</CardTitle>
            <Link href="/projects/px/backlog"><Button variant="ghost" size="sm" className="h-7 text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </div></CardHeader>
          <CardContent className="p-0"><div className="divide-y divide-border">
            {issues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                <PriorityBadge priority={issue.priority} /><StatusBadge status={issue.status} />
                <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{issue.key}</span>
                <span className="flex-1 text-sm truncate">{issue.title}</span>
                {issue.assignee && <Avatar className="w-5 h-5 shrink-0"><AvatarFallback className="text-xs bg-blue-500/20 text-blue-400">{issue.assignee.avatar}</AvatarFallback></Avatar>}
              </div>
            ))}
          </div></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sprint 23</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Progress</span><span className="font-medium">{totalPts > 0 ? Math.round((donePts / totalPts) * 100) : 0}%</span></div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalPts > 0 ? (donePts / totalPts) * 100 : 0}%` }} /></div>
            </div>
            {[
              { label: 'In Progress', count: issues.filter(i => i.status === 'in_progress').length, color: 'bg-blue-500' },
              { label: 'In Review', count: issues.filter(i => i.status === 'in_review').length, color: 'bg-yellow-500' },
              { label: 'Done', count: issues.filter(i => i.status === 'done').length, color: 'bg-green-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-2 text-xs"><div className={`w-2 h-2 rounded-full ${color}`} /><span className="flex-1 text-muted-foreground">{label}</span><span className="font-medium">{count}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// 4. DEVELOPER DASHBOARD
function DeveloperDashboard() {
  const { issues, currentUser } = useAppStore();
  const myIssues = issues.filter((i) => i.assignee?.id === currentUser.id);
  const inProgress = myIssues.filter((i) => i.status === 'in_progress');
  const inReview = myIssues.filter((i) => i.status === 'in_review');
  const todo = myIssues.filter((i) => i.status === 'todo' || i.status === 'backlog');

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Active Tasks', value: String(inProgress.length + inReview.length), sub: `${inProgress.length} in progress`, icon: Code2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Current Sprint', value: 'S23', sub: '11 days left', icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Pull Requests', value: '3', sub: '1 ready for review', icon: GitPullRequest, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { title: 'Time Tracked', value: '6.5h', sub: 'Today', icon: Timer, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((s) => (
          <Card key={s.title}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">In Progress</CardTitle><Badge className="text-xs bg-blue-500/10 text-blue-500 border-0">{inProgress.length}</Badge></div></CardHeader>
          <CardContent className="p-0">
            {inProgress.length > 0 ? inProgress.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 border-b border-border last:border-0">
                <PriorityBadge priority={issue.priority} />
                <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{issue.key}</span>
                <span className="flex-1 text-sm truncate">{issue.title}</span>
                {issue.storyPoints !== undefined && <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground">{issue.storyPoints}</span>}
              </div>
            )) : <div className="px-4 py-6 text-center text-sm text-muted-foreground">No tasks in progress</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Up Next</CardTitle><Badge className="text-xs bg-muted text-muted-foreground border-0">{todo.length}</Badge></div></CardHeader>
          <CardContent className="p-0">
            {todo.length > 0 ? todo.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 border-b border-border last:border-0">
                <PriorityBadge priority={issue.priority} />
                <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{issue.key}</span>
                <span className="flex-1 text-sm truncate">{issue.title}</span>
              </div>
            )) : <div className="px-4 py-6 text-center text-sm text-muted-foreground">All caught up</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader>
        <CardContent className="p-0"><div className="divide-y divide-border">
          {[
            { icon: GitPullRequest, text: 'PR #142 ready for review', sub: 'feat: OAuth2 SSO', time: '15m ago', color: 'text-green-500' },
            { icon: GitCommit, text: 'Pushed 3 commits', sub: 'PX-001, PX-004', time: '2h ago', color: 'text-blue-500' },
            { icon: Timer, text: 'Time tracked: 6.5h', sub: 'OAuth2 implementation', time: 'Today', color: 'text-orange-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-2.5">
              <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
              <div className="flex-1 min-w-0"><div className="text-sm truncate">{item.text}</div><div className="text-xs text-muted-foreground">{item.sub}</div></div>
              <span className="text-xs text-muted-foreground/60 shrink-0">{item.time}</span>
            </div>
          ))}
        </div></CardContent>
      </Card>
    </>
  );
}

// 5. QA DASHBOARD
function QADashboard() {
  const { issues } = useAppStore();
  const bugs = issues.filter((i) => i.type === 'bug');
  const openBugs = bugs.filter((i) => i.status !== 'done' && i.status !== 'cancelled');
  const inReview = issues.filter((i) => i.status === 'in_review');

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Open Bugs', value: String(openBugs.length), sub: `${bugs.filter(b => b.priority === 'urgent').length} critical`, icon: Bug, color: 'text-red-500', bg: 'bg-red-500/10' },
          { title: 'Verification Queue', value: String(inReview.length), sub: 'Awaiting sign-off', icon: TestTube, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { title: 'Reopened', value: '3', sub: 'This sprint', icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { title: 'Pass Rate', value: '94%', sub: 'Last 30 days', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((s) => (
          <Card key={s.title}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Open Bugs</CardTitle><Badge className="text-xs bg-red-500/10 text-red-500 border-0">{openBugs.length}</Badge></div></CardHeader>
          <CardContent className="p-0">
            {openBugs.length > 0 ? openBugs.map((bug) => (
              <div key={bug.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 border-b border-border last:border-0">
                <Bug className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{bug.key}</span>
                <span className="flex-1 text-sm truncate">{bug.title}</span>
                <PriorityBadge priority={bug.priority} />
              </div>
            )) : <div className="px-4 py-6 text-center text-sm text-muted-foreground">No open bugs</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Verification Queue</CardTitle><Badge className="text-xs bg-yellow-500/10 text-yellow-500 border-0">{inReview.length}</Badge></div></CardHeader>
          <CardContent className="p-0">
            {inReview.length > 0 ? inReview.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 border-b border-border last:border-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{issue.key}</span>
                <span className="flex-1 text-sm truncate">{issue.title}</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-green-500"><CheckCircle2 className="w-3 h-3" /> Verify</Button>
              </div>
            )) : <div className="px-4 py-6 text-center text-sm text-muted-foreground">Nothing to verify</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">QA Metrics</CardTitle></CardHeader>
        <CardContent><div className="grid grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Tests Run', value: '142', icon: TestTube },
            { label: 'Passed', value: '133', icon: CheckCircle2 },
            { label: 'Failed', value: '9', icon: XCircle },
            { label: 'Flaky', value: '3', icon: AlertTriangle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-muted/50 rounded-lg p-3 text-center"><Icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /><div className="text-lg font-bold">{value}</div><div className="text-muted-foreground">{label}</div></div>
          ))}
        </div></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">SLA Health</CardTitle></CardHeader>
        <CardContent><div className="grid grid-cols-3 gap-3">
          {[
            { label: 'P1 Response', value: '< 1h', status: 'green' },
            { label: 'P2 Response', value: '< 4h', status: 'green' },
            { label: 'Bug Resolution', value: '< 3d', status: 'yellow' },
          ].map(({ label, value, status }) => (
            <div key={label} className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">{label}</div>
              <div className="text-lg font-bold">{value}</div>
              <div className={cn('w-2 h-2 rounded-full mt-1', status === 'green' ? 'bg-green-500' : 'bg-yellow-500')} />
            </div>
          ))}
        </div></CardContent>
      </Card>
    </>
  );
}

// 6. VIEWER DASHBOARD
function ViewerDashboard() {
  const { issues } = useAppStore();
  const doneIssues = issues.filter((i) => i.status === 'done');
  const totalPoints = issues.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
  const donePoints = doneIssues.reduce((s, i) => s + (i.storyPoints ?? 0), 0);

  return (
    <>
      <div className="flex items-center gap-2 mb-2"><ReadOnlyBadge /></div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Project Progress', value: `${Math.round((donePoints / totalPoints) * 100)}%`, sub: `${donePoints}/${totalPoints} pts`, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Sprint Status', value: 'Active', sub: 'Sprint 23', icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Issues', value: String(issues.length), sub: `${doneIssues.length} done`, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((s) => (
          <Card key={s.title}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3"><span className="text-sm text-muted-foreground">{s.title}</span><div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div></div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Release Progress</CardTitle><ReadOnlyBadge /></div></CardHeader>
          <CardContent className="space-y-4">
            <div><div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Overall</span><span className="font-medium">{Math.round((donePoints / totalPoints) * 100)}%</span></div>
              <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(donePoints / totalPoints) * 100}%` }} /></div>
            </div>
            {[
              { label: 'Features', done: 12, total: 20 },
              { label: 'Bugs', done: 8, total: 10 },
              { label: 'Improvements', done: 5, total: 8 },
            ].map(({ label, done, total }) => (
              <div key={label}><div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-medium">{done}/{total}</span></div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(done / total) * 100}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-sm font-semibold">Sprint Summary</CardTitle><ReadOnlyBadge /></div></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={200}>
            <BarChart data={velocityData} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer></CardContent>
        </Card>
      </div>
    </>
  );
}

// --- Main Dashboard Router ---
export default function DashboardPage() {
  const { effectiveRole } = useAppStore();

  const dashboardMap: Record<string, React.ReactNode> = {
    super_admin: <SuperAdminDashboard />,
    admin: <AdminDashboard />,
    manager: <ManagerDashboard />,
    developer: <DeveloperDashboard />,
    qa: <QADashboard />,
    viewer: <ViewerDashboard />,
  };

  const meta = ROLE_META[effectiveRole];

  return (
    <AppLayout title={meta.dashboardTitle}>
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <RoleGreeting />
        {dashboardMap[effectiveRole] ?? <ManagerDashboard />}
      </div>
    </AppLayout>
  );
}
