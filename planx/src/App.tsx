import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { LandingPage } from '@/pages/LandingPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SystemAdminDashboard } from '@/pages/system-admin/Dashboard'
import { SystemAdminOrganizations } from '@/pages/system-admin/Organizations'
import { SystemAdminUsers } from '@/pages/system-admin/Users'
import { SystemAdminBilling } from '@/pages/system-admin/Billing'
import { SystemAdminSecurity } from '@/pages/system-admin/Security'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { AdminProjects } from '@/pages/admin/Projects'
import { AdminCollaborators } from '@/pages/admin/Collaborators'
import { AdminRoles } from '@/pages/admin/Roles'
import { AdminLabels } from '@/pages/admin/Labels'
import { AdminSettings } from '@/pages/admin/Settings'
import { ManagerSprintBoard } from '@/pages/manager/SprintBoard'
import { ManagerSprints } from '@/pages/manager/Sprints'
import { ManagerBacklog } from '@/pages/manager/Backlog'
import { ManagerEpics } from '@/pages/manager/Epics'
import { ManagerReports } from '@/pages/manager/Reports'
import { MemberMyIssues } from '@/pages/member/MyIssues'
import { MemberKanban } from '@/pages/member/Kanban'
import { MemberIssueDetails } from '@/pages/member/IssueDetails'
import { ViewerBoard } from '@/pages/viewer/Board'
import { ViewerIssueDetails } from '@/pages/viewer/IssueDetails'
import { useAuth } from '@/hooks/useAuth'

function RootRedirect() {
  const { user, homePath } = useAuth()
  if (user) return <Navigate to={homePath} replace />
  return <LandingPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/system-admin" element={<SystemAdminDashboard />} />
            <Route path="/system-admin/organizations" element={<SystemAdminOrganizations />} />
            <Route path="/system-admin/users" element={<SystemAdminUsers />} />
            <Route path="/system-admin/billing" element={<SystemAdminBilling />} />
            <Route path="/system-admin/security" element={<SystemAdminSecurity />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/collaborators" element={<AdminCollaborators />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/labels" element={<AdminLabels />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['MANAGER']}><AppLayout /></ProtectedRoute>}>
            <Route path="/manager" element={<ManagerSprintBoard />} />
            <Route path="/manager/sprints" element={<ManagerSprints />} />
            <Route path="/manager/backlog" element={<ManagerBacklog />} />
            <Route path="/manager/epics" element={<ManagerEpics />} />
            <Route path="/manager/reports" element={<ManagerReports />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['MEMBER']}><AppLayout /></ProtectedRoute>}>
            <Route path="/member" element={<MemberMyIssues />} />
            <Route path="/member/kanban" element={<MemberKanban />} />
            <Route path="/member/issues/:issueId" element={<MemberIssueDetails />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['VIEWER']}><AppLayout /></ProtectedRoute>}>
            <Route path="/viewer" element={<ViewerBoard />} />
            <Route path="/viewer/issues/:issueId" element={<ViewerIssueDetails />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
