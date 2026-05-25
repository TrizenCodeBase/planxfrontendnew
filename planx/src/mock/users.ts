import type { Collaborator } from '@/types'

import type { AuthUser, UserRole } from '@/types/auth'



export interface MockCredential {

  email: string

  password: string

  user: AuthUser

}



export const MOCK_CREDENTIALS: MockCredential[] = [

  {

    email: 'demo@trizenventures.com',

    password: 'demo123',

    user: {

      id: 'u-sys-1',

      email: 'demo@trizenventures.com',

      name: 'System Administrator',

      role: 'SYSTEM_ADMIN',

    },

  },

  {

    email: 'admin@trizenventures.com',

    password: 'admin123',

    user: {

      id: 'u-adm-1',

      email: 'admin@trizenventures.com',

      name: 'Company Admin',

      role: 'ADMIN',

      organizationId: 'org-1',

    },

  },

  {

    email: 'supervisor@trizenventures.com',

    password: 'supervisor123',

    user: {

      id: 'u-mgr-1',

      email: 'supervisor@trizenventures.com',

      name: 'Team Manager',

      role: 'MANAGER',

      organizationId: 'org-1',

    },

  },

  {

    email: 'employee@trizenventures.com',

    password: 'employee123',

    user: {

      id: 'u-mem-1',

      email: 'employee@trizenventures.com',

      name: 'Alex Employee',

      role: 'MEMBER',

      organizationId: 'org-1',

    },

  },

  {

    email: 'viewer@trizenventures.com',

    password: 'viewer123',

    user: {

      id: 'u-view-1',

      email: 'viewer@trizenventures.com',

      name: 'Read Only Viewer',

      role: 'VIEWER',

      organizationId: 'org-1',

    },

  },

]



export const collaborators: Collaborator[] = [

  {

    id: 'u-adm-1',

    name: 'Company Admin',

    email: 'admin@trizenventures.com',

    role: 'ADMIN',

    department: 'Operations',

    status: 'active',

    organizationId: 'org-1',

  },

  {

    id: 'u-mgr-1',

    name: 'Team Manager',

    email: 'supervisor@trizenventures.com',

    role: 'MANAGER',

    department: 'Engineering',

    status: 'active',

    organizationId: 'org-1',

  },

  {

    id: 'u-mem-1',

    name: 'Alex Employee',

    email: 'employee@trizenventures.com',

    role: 'MEMBER',

    department: 'Engineering',

    status: 'active',

    organizationId: 'org-1',

  },

  {

    id: 'u-mem-2',

    name: 'Jordan Lee',

    email: 'jordan@trizenventures.com',

    role: 'MEMBER',

    department: 'Design',

    status: 'active',

    organizationId: 'org-1',

  },

  {

    id: 'u-mem-3',

    name: 'Sam Rivera',

    email: 'sam@trizenventures.com',

    role: 'MEMBER',

    department: 'Marketing',

    status: 'inactive',

    organizationId: 'org-1',

  },

]



export const ROLE_LABELS: Record<UserRole, string> = {

  SYSTEM_ADMIN: 'System Admin',

  ADMIN: 'Company Admin',

  MANAGER: 'Manager',

  MEMBER: 'Employee',

  VIEWER: 'Viewer',

}



export const ORG_ROLE_OPTIONS = [

  { value: 'ADMIN', label: 'Company Admin' },

  { value: 'MANAGER', label: 'Manager' },

  { value: 'MEMBER', label: 'Employee' },

  { value: 'VIEWER', label: 'Viewer' },

]


