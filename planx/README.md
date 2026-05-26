# PlanX

Frontend-only enterprise SaaS demo with role-based access and mock CRUD (persisted in localStorage).

## Quick Start

```bash
cd planx
npm install
npm run dev
```

### Full stack (organizations + email)

Run three services (separate repos under `lovable.worktrees`):

```bash
# 1. Mail service (port 4001) — Resend
cd ../planx-mail-service && cp .env.example .env && npm install && npm run dev

# 2. Backend (port 4000) — MongoDB
cd ../planx-backend && cp .env.example .env && npm install && npm run seed && npm run dev

# 3. Frontend (port 5173)
cd planx && npm run dev
```

Configure `RESEND_API_KEY` and verify `support@trizenventures.com` in Resend. Set `MONGODB_URI` in the backend (MongoDB Atlas).

System admin email copy: **support@trizehr.com**. Invites send from **support@trizenventures.com**.

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| System Admin | demo@trizenventures.com | demo123 |
| Company Admin | admin@trizenventures.com | admin123 |
| Manager | supervisor@trizenventures.com | supervisor123 |
| Employee | employee@trizenventures.com | employee123 |
| Viewer | viewer@trizenventures.com | viewer123 |

## Features by Role

### System Admin (`/system-admin`)
- Platform dashboard (orgs, users, free vs paid)
- Organization management (create, edit, suspend, delete, stats, auto admin invite)
- User management (create, filter, edit, change roles, delete, auto invite email toast)
- Billing (free/paid counts, upgrade/downgrade plans, payment history)
- Security (audit logs, session revoke)

### Admin (`/admin`)
- Workspace dashboard
- Create/delete projects, project settings
- Invite/remove collaborators, assign roles
- Label management (add/delete)
- Roles & permissions reference

### Manager (`/manager`)
- Sprint board (drag status, assign tasks)
- Create/manage sprints
- Backlog (create tasks, assign, add to sprint)
- Epic management (CRUD)
- Basic reports (charts)

### Member (`/member`)
- My tasks + create tasks
- Kanban with status updates
- Task details + comments

### Viewer (`/viewer`)
- Read-only board
- Read-only task details
- Comments only
