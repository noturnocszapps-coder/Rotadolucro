export const ROLES = {
  PASSENGER: 'passenger',
  DRIVER: 'driver',
  ADMIN: 'admin',
} as const;

export const DRIVER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const REQUEST_STATUS = {
  OPEN: 'open',
  FILLED: 'filled',
  CANCELLED: 'cancelled',
} as const;

export const REPORT_REASONS = {
  INAPPROPRIATE_BEHAVIOR: 'inappropriate_behavior',
  HARASSMENT: 'harassment',
  SCAM: 'scam',
  SAFETY_CONCERN: 'safety_concern',
  NO_SHOW: 'no_show',
  OTHER: 'other',
} as const;

export const REPORT_STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
} as const;

export const MODERATION_ACTIONS = {
  WARN: 'warn',
  SUSPEND: 'suspend',
  BLOCK: 'block',
  RESOLVE: 'resolve',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  RECORDS: '/records',
  FREIGHT: '/freight',
  SIMULATOR: '/simulator',
  REPORTS: '/reports',
  EXPENSES: '/expenses',
  FUEL: '/fuel',
  ADMIN_DASHBOARD: '/admin/dashboard',
  TERMS: '/terms',
  // Compatibility Aliases
  PASSENGER_DASHBOARD: '/dashboard',
  DRIVER_DASHBOARD: '/dashboard',
  DRIVER_ONBOARDING: '/dashboard',
  REQUEST_NEW: '/records/new',
  CHAT: (id: string) => `/dashboard`,
} as const;

export const LEGAL_VERSION = '1.0.0';
