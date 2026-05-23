'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, CheckCircle2, XCircle, RotateCcw, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const verificationQueue = [
  { id: 'v1', issueKey: 'PX-142', title: 'Real-time notifications', testedBy: 'Casey Patel', testResult: 'passed', verifiedBy: null, date: '2026-05-23', notes: 'All notifications delivered within 500ms' },
  { id: 'v2', issueKey: 'PX-138', title: 'Auth token refresh loop', testedBy: 'Casey Patel', testResult: 'failed', verifiedBy: null, date: '2026-05-23', notes: 'Still occurring on iOS 18.4 Safari' },
  { id: 'v3', issueKey: 'PX-130', title: 'Permission engine refactor', testedBy: 'Casey Patel', testResult: 'passed', verifiedBy: 'Sam Rivera', date: '2026-05-22', notes: 'All 6 roles verified, transitions correct' },
  { id: 'v4', issueKey: 'PX-125', title: 'Next.js upgrade smoke test', testedBy: 'Casey Patel', testResult: 'passed', verifiedBy: 'Alex Chen', date: '2026-05-22', notes: 'All pages render correctly' },
  { id: 'v5', issueKey: 'PX-135', title: 'Board drag-drop fix', testedBy: 'Casey Patel', testResult: 'passed', verifiedBy: null, date: '2026-05-23', notes: 'Works on all browsers and mobile' },
];

const resultConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  passed: { label: 'Passed', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-500', icon: XCircle },
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
};

export default function VerificationPage() {
  const { can } = useAppStore();

  if (!can('qa.verify')) {
    return <AppLayout title="Verification"><AccessDenied feature="Verification Queue" /></AppLayout>;
  }

  const unverified = verificationQueue.filter(v => !v.verifiedBy);
  const verified = verificationQueue.filter(v => v.verifiedBy);

  return (
    <AppLayout title="Verification">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Verification Queue</h2>
            <p className="text-sm text-muted-foreground">Final gate before promotion to Done</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{unverified.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Awaiting Verification</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{verified.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Verified</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{verificationQueue.filter(v => v.testResult === 'failed').length}</div>
              <div className="text-xs text-muted-foreground mt-1">Failed Tests</div>
            </CardContent>
          </Card>
        </div>

        {/* Unverified items */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500" /> Awaiting Verification ({unverified.length})
          </h3>
          <div className="space-y-3">
            {unverified.map((item) => {
              const config = resultConfig[item.testResult];
              const ResultIcon = config?.icon ?? Clock;
              return (
                <Card key={item.id} className="hover:border-blue-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                        <CheckSquare className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{item.issueKey}</span>
                          <span className="text-sm font-medium">{item.title}</span>
                          <Badge className={cn('text-[10px] h-4 px-1.5 border-0', config?.color)}>
                            <ResultIcon className="w-2.5 h-2.5 mr-0.5" />
                            {config?.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Tested by {item.testedBy} on {item.date}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                          <MessageSquare className="w-3 h-3" /> {item.notes}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.testResult === 'passed' && (
                          <Button size="sm" className="text-xs gap-1 h-7 bg-green-600 hover:bg-green-700">
                            <ShieldCheck className="w-3 h-3" /> Verify & Promote
                          </Button>
                        )}
                        {item.testResult === 'failed' && (
                          <Button size="sm" variant="outline" className="text-xs gap-1 h-7 text-orange-500">
                            <RotateCcw className="w-3 h-3" /> Reopen Issue
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Verified items */}
        {verified.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified ({verified.length})
            </h3>
            <Card>
              <CardContent className="p-0">
                {verified.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{item.issueKey}</span>
                    <span className="text-sm flex-1">{item.title}</span>
                    <span className="text-xs text-muted-foreground">by {item.verifiedBy}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
