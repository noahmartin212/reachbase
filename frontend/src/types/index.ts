export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'sales_rep';
  workspaceId: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  workspaceId: string;
  accountId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  phone?: string;
  mobile?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  status: 'new' | 'contacted' | 'engaged' | 'qualified' | 'opportunity' | 'customer' | 'churned';
  ownerId?: string;
  tags: string[];
  customFields: Record<string, any>;
  unsubscribed: boolean;
  bounced: boolean;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  workspaceId: string;
  name: string;
  domain?: string;
  industry?: string;
  employeeCount?: string;
  annualRevenue?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  website?: string;
  description?: string;
  ownerId?: string;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Sequence {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  createdBy: string;
  stepsCount: number;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SequenceStep {
  id: string;
  sequenceId: string;
  stepNumber: number;
  subject: string;
  body: string;
  delayDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  workspaceId: string;
  contactId: string;
  userId: string;
  emailAccountId: string;
  sequenceId?: string;
  subject: string;
  body: string;
  toAddress: string;
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  userId: string;
  contactId?: string;
  accountId?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalContacts: number;
  activeSequences: number;
  emailsSentToday: number;
  openRate: number;
  replyRate: number;
  tasksToday: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'note' | 'email';
  subject: string;
  description?: string;
  contactId?: string;
  accountId?: string;
  occurredAt: string;
  createdAt: string;
}
