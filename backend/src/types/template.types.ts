// Template Management System Types

export type TemplateStatus = 'draft' | 'active' | 'archived';
export type AccessLevel = 'personal' | 'team' | 'company';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TemplateCategory =
  | 'cold_outreach'
  | 'lead_nurturing'
  | 'discovery'
  | 'demo'
  | 'proposal'
  | 'closing'
  | 'post_sale'
  | 'retention';

export type BuyerPersona =
  | 'c_level'
  | 'vp_director'
  | 'manager'
  | 'individual_contributor'
  | 'procurement'
  | 'technical';

export type Industry =
  | 'saas'
  | 'financial_services'
  | 'healthcare'
  | 'ecommerce'
  | 'manufacturing'
  | 'real_estate'
  | 'education'
  | 'consulting';

export type CompanySize = 'smb' | 'mid_market' | 'enterprise';

export type CampaignType =
  | 'lead_generation'
  | 'event_promotion'
  | 'content_distribution'
  | 'reengagement'
  | 'referral';

export type Tone = 'professional' | 'casual' | 'urgent' | 'educational' | 'humorous';

export type SnippetType =
  | 'intro'
  | 'value_prop'
  | 'social_proof'
  | 'cta'
  | 'pain_point'
  | 'closing'
  | 'custom';

export type VariantType = 'subject_line' | 'opening' | 'cta' | 'body_length';

export interface Template {
  id: string;
  workspace_id: string;

  // Basic Info
  name: string;
  description?: string;
  subject_line: string;
  body_html: string;
  body_plain?: string;

  // Categorization
  category?: TemplateCategory;
  tags: string[];
  persona?: BuyerPersona;
  industry?: Industry;
  company_size?: CompanySize;
  sales_stage?: TemplateCategory;
  campaign_type?: CampaignType;
  tone?: Tone;
  language: string;

  // Status and Access
  status: TemplateStatus;
  access_level: AccessLevel;

  // Versioning
  version: number;
  parent_template_id?: string;

  // Approval
  approval_status?: ApprovalStatus;
  approved_by?: string;
  approved_at?: Date;
  approval_notes?: string;

  // Ownership
  created_by: string;
  created_at: Date;
  updated_at: Date;
  last_used_at?: Date;
  use_count: number;

  // Metadata
  custom_fields: Record<string, any>;
  is_public: boolean;
}

export interface TemplatePerformance {
  id: string;
  template_id: string;

  // Metrics
  sends: number;
  opens: number;
  clicks: number;
  replies: number;
  bounces: number;
  conversions: number;

  // Rates
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  bounce_rate: number;
  conversion_rate: number;

  // Time metrics
  avg_time_to_reply_hours?: number;

  // Best times
  best_send_day?: string;
  best_send_hour?: number;

  calculated_at: Date;
}

export interface TemplateVariant {
  id: string;
  template_id: string;

  variant_type: VariantType;
  variant_name: string;
  content: string;

  // Performance
  sends: number;
  opens: number;
  clicks: number;
  replies: number;

  // Rates
  open_rate: number;
  reply_rate: number;

  // Winner status
  is_winner: boolean;
  confidence_level?: number;

  created_at: Date;
  updated_at: Date;
}

export interface TemplateSnippet {
  id: string;
  workspace_id: string;

  name: string;
  content: string;
  snippet_type?: SnippetType;

  tags: string[];
  use_count: number;

  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface TemplateCollection {
  id: string;
  workspace_id: string;

  name: string;
  description?: string;

  collection_type: 'system' | 'custom';

  created_by: string;
  is_public: boolean;

  created_at: Date;
  updated_at: Date;
}

export interface TemplateCollectionItem {
  collection_id: string;
  template_id: string;
  sort_order: number;
  added_at: Date;
}

export interface TemplateFavorite {
  user_id: string;
  template_id: string;
  favorited_at: Date;
}

export interface TemplateUsageHistory {
  id: string;
  template_id: string;
  user_id: string;

  variant_used?: string;

  // Recipient info
  recipient_persona?: BuyerPersona;
  recipient_industry?: Industry;
  recipient_company_size?: CompanySize;

  // Outcome
  was_sent: boolean;
  was_opened: boolean;
  was_clicked: boolean;
  was_replied: boolean;

  sent_at: Date;
  opened_at?: Date;
  clicked_at?: Date;
  replied_at?: Date;
}

// DTO Types for API requests

export interface CreateTemplateDTO {
  name: string;
  description?: string;
  subject_line: string;
  body_html: string;
  body_plain?: string;
  category?: TemplateCategory;
  tags?: string[];
  persona?: BuyerPersona;
  industry?: Industry;
  company_size?: CompanySize;
  sales_stage?: TemplateCategory;
  campaign_type?: CampaignType;
  tone?: Tone;
  language?: string;
  access_level?: AccessLevel;
  custom_fields?: Record<string, any>;
}

export interface UpdateTemplateDTO {
  name?: string;
  description?: string;
  subject_line?: string;
  body_html?: string;
  body_plain?: string;
  category?: TemplateCategory;
  tags?: string[];
  persona?: BuyerPersona;
  industry?: Industry;
  company_size?: CompanySize;
  sales_stage?: TemplateCategory;
  campaign_type?: CampaignType;
  tone?: Tone;
  language?: string;
  status?: TemplateStatus;
  access_level?: AccessLevel;
  custom_fields?: Record<string, any>;
}

export interface TemplateFilters {
  category?: TemplateCategory;
  persona?: BuyerPersona;
  industry?: Industry;
  company_size?: CompanySize;
  sales_stage?: TemplateCategory;
  campaign_type?: CampaignType;
  tone?: Tone;
  status?: TemplateStatus;
  access_level?: AccessLevel;
  tags?: string[];
  created_by?: string;
  min_reply_rate?: number;
  max_reply_rate?: number;
  is_favorite?: boolean;
  search?: string;
}

export interface TemplateListQuery extends TemplateFilters {
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'last_used_at' | 'use_count' | 'reply_rate';
  sort_order?: 'asc' | 'desc';
}

export interface CreateSnippetDTO {
  name: string;
  content: string;
  snippet_type?: SnippetType;
  tags?: string[];
}

export interface UpdateSnippetDTO {
  name?: string;
  content?: string;
  snippet_type?: SnippetType;
  tags?: string[];
}

export interface CreateVariantDTO {
  variant_type: VariantType;
  variant_name: string;
  content: string;
}

export interface CreateCollectionDTO {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface TemplateWithPerformance extends Template {
  performance?: TemplatePerformance;
  is_favorite?: boolean;
}

export interface TemplateAnalytics {
  template: Template;
  performance: TemplatePerformance;
  variants: TemplateVariant[];
  usage_over_time: {
    date: string;
    sends: number;
    opens: number;
    replies: number;
  }[];
  top_performing_variants: TemplateVariant[];
  recommendations: string[];
}

// Variable System Types

export interface TemplateVariable {
  key: string;
  label: string;
  category: 'contact' | 'company' | 'sender' | 'contextual' | 'custom';
  example: string;
  description?: string;
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Contact Variables
  { key: 'firstName', label: 'First Name', category: 'contact', example: 'John' },
  { key: 'lastName', label: 'Last Name', category: 'contact', example: 'Smith' },
  { key: 'fullName', label: 'Full Name', category: 'contact', example: 'John Smith' },
  { key: 'email', label: 'Email', category: 'contact', example: 'john@example.com' },
  { key: 'phone', label: 'Phone', category: 'contact', example: '+1 (555) 123-4567' },
  { key: 'jobTitle', label: 'Job Title', category: 'contact', example: 'CEO' },
  { key: 'department', label: 'Department', category: 'contact', example: 'Sales' },
  { key: 'linkedInURL', label: 'LinkedIn URL', category: 'contact', example: 'linkedin.com/in/johnsmith' },

  // Company Variables
  { key: 'companyName', label: 'Company Name', category: 'company', example: 'Acme Corp' },
  { key: 'companyWebsite', label: 'Company Website', category: 'company', example: 'acme.com' },
  { key: 'companyIndustry', label: 'Company Industry', category: 'company', example: 'SaaS' },
  { key: 'companySize', label: 'Company Size', category: 'company', example: '500-1000' },
  { key: 'companyLocation', label: 'Company Location', category: 'company', example: 'San Francisco, CA' },

  // Sender Variables
  { key: 'senderFirstName', label: 'Your First Name', category: 'sender', example: 'Jane' },
  { key: 'senderLastName', label: 'Your Last Name', category: 'sender', example: 'Doe' },
  { key: 'senderTitle', label: 'Your Title', category: 'sender', example: 'Account Executive' },
  { key: 'senderPhone', label: 'Your Phone', category: 'sender', example: '+1 (555) 987-6543' },
  { key: 'senderEmail', label: 'Your Email', category: 'sender', example: 'jane@company.com' },
  { key: 'senderCalendarLink', label: 'Your Calendar Link', category: 'sender', example: 'calendly.com/janedoe' },

  // Contextual Variables
  { key: 'referralSource', label: 'Referral Source', category: 'contextual', example: 'LinkedIn' },
  { key: 'mutualConnection', label: 'Mutual Connection', category: 'contextual', example: 'Bob Johnson' },
];
