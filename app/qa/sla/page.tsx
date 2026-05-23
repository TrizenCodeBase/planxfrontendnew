'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle2, XCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const slaTargets = [
  { id: 's1', name: 'Critical Bug Response', target: '1h', actual: '0h 45m', compliance: 95, total: 20, met: 19, breached: 1, trend: 'up' },
  { id: 's2', name: 'Bug Triage Time', target: '4h', actual: '3h 20m', compliance: 88, total: 45, met: 40, breached: 5, trend: 'up' },
  { id: 's3', name: 'Testing Turnaround', target: '24h', actual: '18h', compliance: 92, total: 35, met: 32, breached: 3, trend: 'stable' },
  { id: 's4', name: 'Verification Gate', target: '8h', actual: '6h 30m', compliance: 85, total: 28, met: 24, breached: 4, trend: 'down' },
  { id: 's5', name: 'Regression Fix Time', target: '48h', actual: '36h', compliance: 78, total: 15, met: 12, breached: 3, trend: 'up' },
];

const recentBreaches = [
  { id: 'b1', issueKey: 'PX-112', sla: 'Critical Bug Response', breachedAt: '2026-05-22 14:30', duration: '2h 15m', reason: 'QA team at capacity' },
  { id: 'b2', issueKey: 'PX-108', sla: 'Verification Gate', breachedAt: '2026-05-21 09:00', duration: '12h', reason: 'Awaiting deployment to staging' },
  { id: 'b3', issueKey: 'PX-098', sla: 'Bug Triage Time', breachedAt: '2026-05-20 16:45', duration: '6h 30m', reason: 'Unlabeled issue missed triage queue' },
];

function ComplianceBar({ compliance }: { compliance: number }) {
  const color = compliance >= 90 ? 'bg-green-500' : compliance >= 80 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = compliance >= 90 ? 'text-green-500' : compliance >= 80 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${compliance}%` }} />
      </div>
      <span className={cn('text-xs font-medium w-10 text-right', textColor)}>{compliance}%</span>
    </div>
  );
}

export default function SLAPage() {
  const { can } = useAppStore();

  if (!can('qa.sla_tracking')) {
    return <AppLayout title="SLA Tracking"><AccessDenied feature="SLA Tracking" /></AppLayout>;
  }

  const overallCompliance = Math.round(slaTargets.reduce((a, s) => a + s.compliance, 0) / slaTargets.length);
  const totalBreached = slaTargets.reduce((a, s) => a + s.breached, 0);

  return (
    <AppLayout title="SLA Tracking">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">SLA Tracking</h2>
            <p className="text-sm text-muted-foreground">Quality response time compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className={cn('text-2xl font-bold', overallCompliance >= 90 ? 'text-green-500' : overallCompliance >= 80 ? 'text-yellow-500' : 'text-red-500')}>
                {overallCompliance}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Overall Compliance</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{slaTargets.reduce((a, s) => a + s.met, 0)}</div>
              <div className="text-xs text-muted-foreground mt-1">SLAs Met</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{totalBreached}</div>
              <div className="text-xs text-muted-foreground mt-1">Breaches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{recentBreaches.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Recent Breaches</div>
            </CardContent>
          </Card>
        </div>

        {/* SLA targets */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> SLA Targets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {slaTargets.map((sla) => (
              <div key={sla.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{sla.name}</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                      Target: {sla.target}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-green-500">
                      Avg: {sla.actual}
                    </Badge>
                  </div>
                  <ComplianceBar compliance={sla.compliance} />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 w-32">
                  <span className="text-green-500">{sla.met} met</span>
                  <span className="text-red-500">{sla.breached} breached</span>
                </div>
                {sla.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
                ) : sla.trend === 'down' ? (
                  <TrendingUp className="w-4 h-4 text-red-500 shrink-0 rotate-180" />
                ) : (
                  <div className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground text-xs">—</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent breaches */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-500"><AlertTriangle className="w-4 h-4" /> Recent Breaches</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentBreaches.map((breach) => (
              <div key={breach.id} className="flex items-start gap-4 px-5 py-3 border-b border-border last:border-0">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">{breach.issueKey}</span>
                    <span className="text-sm font-medium">{breach.sla}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Breached at {breach.breachedAt} — exceeded by {breach.duration}
                  </div>
                  <div className="text-xs text-red-500/80 mt-0.5">
                    Reason: {breach.reason}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
