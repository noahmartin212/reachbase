// Email Management System Types

export type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'bounced' | 'failed';
export type EmailDirection = 'outbound' | 'inbound';
export type EmailEventType = 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed' | 'spam_report';
export type BounceType = 'hard' | 'soft' | 'spam' | 'unsubscribe';

export interface Email {
  id: string;
  workspace_id: string;

  // Direction
  direction: EmailDirection;

  // Contact/Recipient Info
  contact_id?: string;
  contact_name: string;
  contact_email: string;
  contact_company?: string;

  // Sender Info (for inbound emails)
  sender_name?: string;
  sender_email?: string;

  // Email Content
  subject: string;
  body_html: string;
  body_plain?: string;

  // Status
  status: EmailStatus;

  // Template & Sequence Association
  template_id?: string;
  template_name?: string;
  sequence_id?: string;
  sequence_name?: string;
  sequence_step?: number;

  // Campaign Info
  campaign_id?: string;
  campaign_name?: string;

  // Tracking
  opened: boolean;
  open_count: number;
  first_opened_at?: Date;
  last_opened_at?: Date;

  clicked: boolean;
  click_count: number;
  first_clicked_at?: Date;
  last_clicked_at?: Date;

  replied: boolean;
  reply_count: number;
  first_replied_at?: Date;
  last_replied_at?: Date;

  bounced: boolean;
  bounce_type?: BounceType;
  bounce_reason?: string;
  bounced_at?: Date;

  unsubscribed: boolean;
  unsubscribed_at?: Date;

  spam_reported: boolean;
  spam_reported_at?: Date;

  // Threading
  thread_id?: string;
  parent_email_id?: string;
  is_reply: boolean;

  // Scheduling
  scheduled_at?: Date;
  sent_at?: Date;
  delivered_at?: Date;

  // Metadata
  sent_by: string;
  created_at: Date;
  updated_at: Date;

  // Provider Info
  provider: 'sendgrid' | 'aws_ses' | 'smtp' | 'manual';
  provider_message_id?: string;

  // Additional fields
  tags: string[];
  custom_fields: Record<string, any>;
}

export interface EmailEvent {
  id: string;
  email_id: string;

  event_type: EmailEventType;
  event_data?: Record<string, any>;

  // Location & Device (for opens/clicks)
  ip_address?: string;
  user_agent?: string;
  location?: string;
  device?: string;

  occurred_at: Date;
  created_at: Date;
}

export interface EmailThread {
  thread_id: string;
  contact_id: string;
  contact_name: string;
  contact_email: string;
  contact_company?: string;

  subject: string;

  // Counts
  email_count: number;
  outbound_count: number;
  inbound_count: number;

  // Status
  last_email_direction: EmailDirection;
  last_email_status: EmailStatus;
  last_email_at: Date;

  // Tracking
  has_reply: boolean;
  first_reply_at?: Date;

  // Associated with
  sequence_id?: string;
  sequence_name?: string;

  created_at: Date;
  updated_at: Date;
}

export interface EmailStatistics {
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;

  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  bounce_rate: number;

  avg_time_to_open_hours?: number;
  avg_time_to_click_hours?: number;
  avg_time_to_reply_hours?: number;
}

// DTO Types for API requests

export interface CreateEmailDTO {
  contact_email: string;
  contact_name: string;
  subject: string;
  body_html: string;
  body_plain?: string;
  template_id?: string;
  sequence_id?: string;
  campaign_id?: string;
  scheduled_at?: Date;
  tags?: string[];
}

export interface UpdateEmailDTO {
  subject?: string;
  body_html?: string;
  body_plain?: string;
  scheduled_at?: Date;
  status?: EmailStatus;
  tags?: string[];
}

export interface EmailFilters {
  status?: EmailStatus;
  direction?: EmailDirection;
  contact_id?: string;
  sequence_id?: string;
  campaign_id?: string;
  template_id?: string;
  opened?: boolean;
  clicked?: boolean;
  replied?: boolean;
  bounced?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  tags?: string[];
}

export interface EmailListQuery extends EmailFilters {
  page?: number;
  limit?: number;
  sort_by?: 'sent_at' | 'created_at' | 'contact_name' | 'subject' | 'opened' | 'clicked' | 'replied';
  sort_order?: 'asc' | 'desc';
}

export interface EmailWithThread extends Email {
  thread_emails?: Email[];
  thread_count?: number;
}

export interface EmailAnalytics {
  statistics: EmailStatistics;
  sends_over_time: {
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
  }[];
  top_performing_templates: {
    template_id: string;
    template_name: string;
    sends: number;
    open_rate: number;
    reply_rate: number;
  }[];
  engagement_by_hour: {
    hour: number;
    opens: number;
    clicks: number;
  }[];
}
