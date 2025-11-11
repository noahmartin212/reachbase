-- Migration: Template Management System
-- Version: 004
-- Description: Create tables for email templates, snippets, collections, and performance tracking

-- =============================================
-- TEMPLATES TABLE
-- =============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject_line TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_plain TEXT,

  -- Categorization
  category VARCHAR(100), -- cold_outreach, lead_nurturing, discovery, demo, proposal, closing, post_sale, retention
  tags TEXT[] DEFAULT '{}',
  persona VARCHAR(100), -- c_level, vp_director, manager, individual_contributor, procurement, technical
  industry VARCHAR(100), -- saas, financial_services, healthcare, ecommerce, manufacturing, real_estate, education, consulting
  company_size VARCHAR(50), -- smb, mid_market, enterprise
  sales_stage VARCHAR(100), -- cold_outreach, lead_nurturing, discovery, demo, proposal, closing, post_sale, retention
  campaign_type VARCHAR(100), -- lead_generation, event_promotion, content_distribution, reengagement, referral
  tone VARCHAR(50), -- professional, casual, urgent, educational, humorous
  language VARCHAR(10) DEFAULT 'en',

  -- Status and Access Control
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, archived
  access_level VARCHAR(20) DEFAULT 'personal', -- personal, team, company

  -- Versioning
  version INT DEFAULT 1,
  parent_template_id UUID REFERENCES templates(id) ON DELETE SET NULL,

  -- Approval Workflow
  approval_status VARCHAR(20), -- pending, approved, rejected
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  approval_notes TEXT,

  -- Ownership and Tracking
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  use_count INT DEFAULT 0,

  -- Metadata
  custom_fields JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,

  CONSTRAINT unique_template_name_per_workspace UNIQUE(workspace_id, name)
);

-- =============================================
-- TEMPLATE PERFORMANCE TABLE
-- =============================================
CREATE TABLE template_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,

  -- Aggregate Metrics
  sends INT DEFAULT 0,
  opens INT DEFAULT 0,
  clicks INT DEFAULT 0,
  replies INT DEFAULT 0,
  bounces INT DEFAULT 0,
  conversions INT DEFAULT 0,

  -- Calculated Rates (stored for performance)
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  reply_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,

  -- Time Metrics
  avg_time_to_reply_hours DECIMAL(10,2),

  -- Best Performance Times
  best_send_day VARCHAR(10), -- monday, tuesday, etc.
  best_send_hour INT, -- 0-23

  calculated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_performance_per_template UNIQUE(template_id)
);

-- =============================================
-- TEMPLATE VARIANTS (A/B Testing)
-- =============================================
CREATE TABLE template_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,

  variant_type VARCHAR(50) NOT NULL, -- subject_line, opening, cta, body_length
  variant_name VARCHAR(100) NOT NULL, -- "Variant A", "Variant B", etc.
  content TEXT NOT NULL,

  -- Performance
  sends INT DEFAULT 0,
  opens INT DEFAULT 0,
  clicks INT DEFAULT 0,
  replies INT DEFAULT 0,

  -- Calculated Rates
  open_rate DECIMAL(5,2) DEFAULT 0,
  reply_rate DECIMAL(5,2) DEFAULT 0,

  -- Winner Status
  is_winner BOOLEAN DEFAULT false,
  confidence_level DECIMAL(5,2), -- Statistical confidence percentage

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_variant_per_template UNIQUE(template_id, variant_type, variant_name)
);

-- =============================================
-- TEMPLATE SNIPPETS
-- =============================================
CREATE TABLE template_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  snippet_type VARCHAR(50), -- intro, value_prop, social_proof, cta, pain_point, closing, custom

  tags TEXT[] DEFAULT '{}',
  use_count INT DEFAULT 0,

  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_snippet_name_per_workspace UNIQUE(workspace_id, name)
);

-- =============================================
-- TEMPLATE COLLECTIONS
-- =============================================
CREATE TABLE template_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  description TEXT,

  collection_type VARCHAR(50) DEFAULT 'custom', -- system, custom

  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_collection_name_per_workspace UNIQUE(workspace_id, name)
);

-- =============================================
-- TEMPLATE COLLECTION ITEMS (Many-to-Many)
-- =============================================
CREATE TABLE template_collection_items (
  collection_id UUID NOT NULL REFERENCES template_collections(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  added_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (collection_id, template_id)
);

-- =============================================
-- TEMPLATE FAVORITES (User-specific)
-- =============================================
CREATE TABLE template_favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  favorited_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (user_id, template_id)
);

-- =============================================
-- TEMPLATE USAGE HISTORY
-- =============================================
CREATE TABLE template_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  variant_used VARCHAR(100), -- Which A/B variant was used

  -- Recipient Info (for analytics)
  recipient_persona VARCHAR(100),
  recipient_industry VARCHAR(100),
  recipient_company_size VARCHAR(50),

  -- Outcome
  was_sent BOOLEAN DEFAULT true,
  was_opened BOOLEAN DEFAULT false,
  was_clicked BOOLEAN DEFAULT false,
  was_replied BOOLEAN DEFAULT false,

  sent_at TIMESTAMP DEFAULT NOW(),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Templates indexes
CREATE INDEX idx_templates_workspace ON templates(workspace_id);
CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_tags ON templates USING gin(tags);
CREATE INDEX idx_templates_created_by ON templates(created_by);
CREATE INDEX idx_templates_access_level ON templates(access_level);
CREATE INDEX idx_templates_persona ON templates(persona);
CREATE INDEX idx_templates_industry ON templates(industry);
CREATE INDEX idx_templates_sales_stage ON templates(sales_stage);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);
CREATE INDEX idx_templates_last_used_at ON templates(last_used_at DESC);

-- Template performance indexes
CREATE INDEX idx_template_performance_template ON template_performance(template_id);
CREATE INDEX idx_template_performance_reply_rate ON template_performance(reply_rate DESC);
CREATE INDEX idx_template_performance_open_rate ON template_performance(open_rate DESC);

-- Template variants indexes
CREATE INDEX idx_template_variants_template ON template_variants(template_id);
CREATE INDEX idx_template_variants_type ON template_variants(variant_type);

-- Snippets indexes
CREATE INDEX idx_snippets_workspace ON template_snippets(workspace_id);
CREATE INDEX idx_snippets_type ON template_snippets(snippet_type);
CREATE INDEX idx_snippets_tags ON template_snippets USING gin(tags);

-- Collections indexes
CREATE INDEX idx_collections_workspace ON template_collections(workspace_id);
CREATE INDEX idx_collections_created_by ON template_collections(created_by);
CREATE INDEX idx_collection_items_collection ON template_collection_items(collection_id);
CREATE INDEX idx_collection_items_template ON template_collection_items(template_id);

-- Favorites indexes
CREATE INDEX idx_favorites_user ON template_favorites(user_id);
CREATE INDEX idx_favorites_template ON template_favorites(template_id);

-- Usage history indexes
CREATE INDEX idx_usage_history_template ON template_usage_history(template_id);
CREATE INDEX idx_usage_history_user ON template_usage_history(user_id);
CREATE INDEX idx_usage_history_sent_at ON template_usage_history(sent_at DESC);

-- =============================================
-- TRIGGERS FOR AUTO-UPDATE
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at();

CREATE TRIGGER template_snippets_updated_at
  BEFORE UPDATE ON template_snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at();

CREATE TRIGGER template_collections_updated_at
  BEFORE UPDATE ON template_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at();

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert sample templates (will use workspace_id and user_id from existing data)
-- Note: This assumes workspace and user with these IDs exist
-- In production, this would be handled by the application

COMMENT ON TABLE templates IS 'Email templates with categorization and metadata';
COMMENT ON TABLE template_performance IS 'Aggregated performance metrics for templates';
COMMENT ON TABLE template_variants IS 'A/B test variants for templates';
COMMENT ON TABLE template_snippets IS 'Reusable content snippets';
COMMENT ON TABLE template_collections IS 'Organized collections of templates';
COMMENT ON TABLE template_collection_items IS 'Many-to-many relationship between collections and templates';
COMMENT ON TABLE template_favorites IS 'User-specific template favorites';
COMMENT ON TABLE template_usage_history IS 'Historical record of template usage and outcomes';
