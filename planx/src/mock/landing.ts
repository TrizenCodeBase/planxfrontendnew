export const TRUST_COMPANIES = [
  'Trizen Ventures',
  'Nova Labs',
  'Helix Systems',
  'Northwind Digital',
  'Apex Collective',
]

export const CURRENT_FEATURES = [
  { title: 'Sprint Management', description: 'Plan iterations, track velocity, and ship on schedule across teams.' },
  { title: 'Kanban Boards', description: 'Visualize work-in-progress with customizable columns and WIP limits.' },
  { title: 'Backlog Planning', description: 'Prioritize epics and stories with drag-and-drop grooming workflows.' },
  { title: 'Organization Management', description: 'Structure workspaces, departments, and cross-functional programs.' },
  { title: 'Analytics', description: 'Real-time dashboards for throughput, cycle time, and team health.' },
  { title: 'Role-Based Access', description: 'Granular permissions for admins, managers, members, and viewers.' },
  { title: 'Audit Logs', description: 'Immutable activity history for compliance and incident review.' },
  { title: 'Session Management', description: 'Monitor active sessions and enforce secure sign-out policies.' },
]

export const AI_FEATURES = [
  { title: 'AI Sprint Planning', badge: 'Coming Soon', description: 'Auto-suggest sprint scope from backlog signals and capacity.' },
  { title: 'AI Task Summaries', badge: 'AI Powered', description: 'Condense long threads into actionable updates for stakeholders.' },
  { title: 'AI Workload Prediction', badge: 'Beta', description: 'Forecast bottlenecks before deadlines slip.' },
  { title: 'AI Productivity Insights', badge: 'Coming Soon', description: 'Surface patterns in delivery pace across squads.' },
  { title: 'AI Meeting Notes', badge: 'AI Powered', description: 'Turn standups into tracked follow-ups inside PlanX.' },
  { title: 'AI Risk Detection', badge: 'Beta', description: 'Flag blocked dependencies and scope creep early.' },
]

export const INTEGRATIONS = ['Slack', 'GitHub', 'Google Meet', 'Zoom', 'Figma', 'Notion']

export const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$29',
    period: 'per user / month',
    description: 'For growing teams getting structured.',
    features: ['Up to 25 users', 'Kanban & backlog', 'Basic analytics', 'Email support'],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$59',
    period: 'per user / month',
    description: 'For departments scaling delivery.',
    features: ['Unlimited projects', 'Sprint management', 'Advanced analytics', 'Role-based access', 'Priority support'],
    cta: 'Talk to sales',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contracts',
    description: 'For organizations with compliance needs.',
    features: ['Audit logs & SSO', 'Dedicated success manager', 'Custom SLAs', 'Session management', 'AI roadmap access'],
    cta: 'Contact enterprise',
    highlighted: false,
  },
]

export const TESTIMONIALS = [
  {
    quote: 'PlanX replaced three tools for our product org. Sprint planning alone saved us six hours a week.',
    name: 'Priya Sharma',
    role: 'VP Engineering',
    company: 'Nova Labs',
  },
  {
    quote: 'Role permissions and audit logs made our security review straightforward. We onboarded 120 users in a week.',
    name: 'Marcus Chen',
    role: 'IT Director',
    company: 'Helix Systems',
  },
  {
    quote: 'The analytics widgets give leadership a single view of delivery without chasing spreadsheets.',
    name: 'Elena Vasquez',
    role: 'Head of Operations',
    company: 'Trizen Ventures',
  },
]

export const DEMO_CONTACT = {
  email: 'trizenhr@gmail.com',
  phone: '+1 (555) 482-0194',
  address: '1200 Innovation Way, Suite 400, Austin, TX 78701',
  hours: 'Mon–Fri, 9:00 AM – 6:00 PM CST',
}

export const SECURITY_FEATURES = [
  {
    title: 'Audit Logs',
    description: 'Every permission change, export, and login is recorded with actor and timestamp.',
  },
  {
    title: 'Session Tracking',
    description: 'View active devices, revoke sessions remotely, and enforce idle timeouts.',
  },
  {
    title: 'Role Permissions',
    description: 'Map System Admin, Manager, Member, and Viewer roles to least-privilege policies.',
  },
  {
    title: 'Secure Organization Access',
    description: 'Isolate workspaces by organization with billing and policy boundaries.',
  },
]

export const DASHBOARD_STATS = [
  { label: 'Sprint velocity', value: '42 pts', change: '+12% vs last sprint' },
  { label: 'Cycle time', value: '3.2d', change: '−0.4d improvement' },
  { label: 'Active orgs', value: '18', change: '4 new this quarter' },
  { label: 'On-time delivery', value: '94%', change: 'Enterprise avg. 89%' },
]

export const KANBAN_PREVIEW = [
  { column: 'Backlog', items: ['API auth refactor', 'Design tokens'] },
  { column: 'In progress', items: ['Sprint 14 board', 'RBAC audit'] },
  { column: 'Review', items: ['Analytics export'] },
  { column: 'Done', items: ['Org onboarding', 'Session mgmt'] },
]

export const SPRINT_BURNDOWN = [38, 34, 30, 26, 22, 18, 14, 10, 8, 6]

export const FOOTER_LINKS = {
  Product: ['Overview', 'Pricing', 'Roadmap', 'Changelog'],
  Features: ['Sprints', 'Kanban', 'Analytics', 'AI (coming soon)'],
  Security: ['Audit logs', 'Sessions', 'Roles', 'Compliance'],
  Company: ['About Trizen', 'Careers', 'Contact', 'Privacy'],
}
