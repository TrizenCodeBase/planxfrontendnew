import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'

export function SystemAdminSecurity() {
  const { auditLogs, sessions, toast, setToast, revokeSession } = usePlanXStore()

  return (
    <div>
      <PageHeader title="Security" description="Audit logs and active session management" />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <Card title="Audit logs" className="mb-4">
        <Table>
          <TableHead>
            <TableHeaderCell>Timestamp</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
            <TableHeaderCell>Actor</TableHeaderCell>
            <TableHeaderCell>Target</TableHeaderCell>
            <TableHeaderCell>IP</TableHeaderCell>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-xs">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell className="text-[var(--color-text-muted)]">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card title="Session management">
        <Table>
          <TableHead>
            <TableHeaderCell>User</TableHeaderCell>
            <TableHeaderCell>Device</TableHeaderCell>
            <TableHeaderCell>IP</TableHeaderCell>
            <TableHeaderCell>Last active</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  {s.userName}
                  {s.current && <span className="ml-2 text-xs text-emerald-600">(current)</span>}
                </TableCell>
                <TableCell>{s.device}</TableCell>
                <TableCell>{s.ip}</TableCell>
                <TableCell className="text-xs">{new Date(s.lastActive).toLocaleString()}</TableCell>
                <TableCell>
                  {!s.current && (
                    <Button variant="danger" size="sm" onClick={() => revokeSession(s.id)}>
                      Revoke
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
