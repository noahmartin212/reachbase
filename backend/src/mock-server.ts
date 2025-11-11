import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Mock server running - Database not connected',
  });
});

// API documentation
app.get('/api/docs', (_req: Request, res: Response) => {
  res.json({
    message: 'Outreach Clone API - Mock Mode',
    note: 'This is a mock server for frontend development. Database is not connected.',
    endpoints: {
      'GET /health': 'Health check',
      'GET /api/docs': 'This documentation',
      'POST /api/auth/login': 'Mock login (returns demo token)',
      'POST /api/auth/register': 'Mock registration (returns demo token)',
    },
  });
});

// Mock auth endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required',
    });
  }

  return res.json({
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-1',
      email: email,
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
      workspaceId: 'workspace-1',
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, firstName, lastName, workspaceName } = req.body;

  if (!email || !firstName || !lastName || !workspaceName) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required',
    });
  }

  return res.json({
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-1',
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: 'admin',
      workspaceId: 'workspace-1',
    },
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required',
    });
  }

  return res.json({
    message: 'Password reset link sent to ' + email,
  });
});

// Mock user endpoints
app.get('/api/users/me', (_req: Request, res: Response) => {
  res.json({
    id: 'user-1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'admin',
    workspaceId: 'workspace-1',
  });
});

// ==================== TEMPLATE MOCK ENDPOINTS ====================

// Mock templates data
const mockTemplates = [
  {
    id: 'template-1',
    workspace_id: 'workspace-1',
    name: 'Enterprise Decision Maker Outreach',
    description: 'Tailored messaging for C-suite executives focusing on ROI and strategic value',
    subject_line: 'Quick question about {{companyName}}\'s revenue goals',
    body_html: '<p>Hi {{firstName}},</p><p>I noticed {{companyName}} recently...</p>',
    body_plain: 'Hi {{firstName}},\n\nI noticed {{companyName}} recently...',
    category: 'cold_outreach',
    tags: ['enterprise', 'c-level', 'roi'],
    persona: 'c_level',
    industry: 'saas',
    company_size: 'enterprise',
    sales_stage: 'cold_outreach',
    campaign_type: 'lead_generation',
    tone: 'professional',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-15'),
    updated_at: new Date('2025-01-15'),
    use_count: 45,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 150,
      opens: 68,
      clicks: 28,
      replies: 33,
      open_rate: 45.3,
      click_rate: 18.7,
      reply_rate: 22.0,
    }
  },
  {
    id: 'template-2',
    workspace_id: 'workspace-1',
    name: 'Technical Decision Maker - Product Demo',
    description: 'Technical approach for CTOs, VPs of Engineering with product deep-dives',
    subject_line: 'Solving {{companyName}}\'s {{painPoint}} challenge',
    body_html: '<p>Hi {{firstName}},</p><p>I saw your recent post about...</p>',
    body_plain: 'Hi {{firstName}},\n\nI saw your recent post about...',
    category: 'demo',
    tags: ['technical', 'engineering', 'demo'],
    persona: 'technical',
    industry: 'saas',
    company_size: 'mid_market',
    sales_stage: 'demo',
    campaign_type: 'lead_generation',
    tone: 'educational',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-10'),
    updated_at: new Date('2025-01-12'),
    use_count: 67,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 200,
      opens: 92,
      clicks: 45,
      replies: 56,
      open_rate: 46.0,
      click_rate: 22.5,
      reply_rate: 28.0,
    }
  },
  {
    id: 'template-3',
    workspace_id: 'workspace-1',
    name: 'SMB Owner Quick Win',
    description: 'Direct, value-focused messaging for time-constrained SMB owners',
    subject_line: '3 ways to increase {{companyName}}\'s revenue this quarter',
    body_html: '<p>Hi {{firstName}},</p><p>Quick note - I help businesses like {{companyName}}...</p>',
    body_plain: 'Hi {{firstName}},\n\nQuick note - I help businesses like {{companyName}}...',
    category: 'cold_outreach',
    tags: ['smb', 'quick-win', 'revenue'],
    persona: 'c_level',
    industry: 'ecommerce',
    company_size: 'smb',
    sales_stage: 'cold_outreach',
    campaign_type: 'lead_generation',
    tone: 'casual',
    language: 'en',
    status: 'active',
    access_level: 'personal',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-05'),
    updated_at: new Date('2025-01-05'),
    use_count: 28,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 85,
      opens: 32,
      clicks: 12,
      replies: 16,
      open_rate: 37.6,
      click_rate: 14.1,
      reply_rate: 18.8,
    }
  },
  {
    id: 'template-4',
    workspace_id: 'workspace-1',
    name: 'VP Sales Lead Nurture - Case Study',
    description: 'Share relevant case studies with sales leaders to build credibility',
    subject_line: 'How {{competitorName}} increased pipeline by 45%',
    body_html: '<p>Hi {{firstName}},</p><p>I thought you\'d find this interesting - one of your competitors...</p>',
    body_plain: 'Hi {{firstName}},\n\nI thought you\'d find this interesting - one of your competitors...',
    category: 'lead_nurturing',
    tags: ['case-study', 'pipeline', 'vp-sales'],
    persona: 'vp_director',
    industry: 'saas',
    company_size: 'mid_market',
    sales_stage: 'lead_nurturing',
    campaign_type: 'content_distribution',
    tone: 'professional',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-18'),
    updated_at: new Date('2025-01-18'),
    use_count: 34,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 120,
      opens: 56,
      clicks: 31,
      replies: 19,
      open_rate: 46.7,
      click_rate: 25.8,
      reply_rate: 15.8,
    }
  },
  {
    id: 'template-5',
    workspace_id: 'workspace-1',
    name: 'Manager Onboarding Follow-up',
    description: 'Post-demo follow-up for managers focusing on team adoption',
    subject_line: 'Next steps for rolling out to your team',
    body_html: '<p>Hi {{firstName}},</p><p>Great speaking with you yesterday about {{companyName}}\'s needs...</p>',
    body_plain: 'Hi {{firstName}},\n\nGreat speaking with you yesterday about {{companyName}}\'s needs...',
    category: 'demo',
    tags: ['follow-up', 'onboarding', 'team'],
    persona: 'manager',
    industry: 'saas',
    company_size: 'mid_market',
    sales_stage: 'demo',
    campaign_type: 'lead_generation',
    tone: 'casual',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-14'),
    updated_at: new Date('2025-01-16'),
    use_count: 51,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 175,
      opens: 89,
      clicks: 42,
      replies: 47,
      open_rate: 50.9,
      click_rate: 24.0,
      reply_rate: 26.9,
    }
  },
  {
    id: 'template-6',
    workspace_id: 'workspace-1',
    name: 'Healthcare Compliance Cold Outreach',
    description: 'HIPAA-focused messaging for healthcare industry decision makers',
    subject_line: 'HIPAA-compliant solution for {{companyName}}',
    body_html: '<p>Hi {{firstName}},</p><p>With healthcare compliance requirements getting stricter...</p>',
    body_plain: 'Hi {{firstName}},\n\nWith healthcare compliance requirements getting stricter...',
    category: 'cold_outreach',
    tags: ['healthcare', 'compliance', 'hipaa'],
    persona: 'c_level',
    industry: 'healthcare',
    company_size: 'enterprise',
    sales_stage: 'cold_outreach',
    campaign_type: 'lead_generation',
    tone: 'professional',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-12'),
    updated_at: new Date('2025-01-12'),
    use_count: 22,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 95,
      opens: 41,
      clicks: 15,
      replies: 12,
      open_rate: 43.2,
      click_rate: 15.8,
      reply_rate: 12.6,
    }
  },
  {
    id: 'template-7',
    workspace_id: 'workspace-1',
    name: 'E-commerce Peak Season Prep',
    description: 'Timely outreach for e-commerce businesses before peak shopping season',
    subject_line: 'Is {{companyName}} ready for Q4?',
    body_html: '<p>Hi {{firstName}},</p><p>Q4 is around the corner and I wanted to reach out...</p>',
    body_plain: 'Hi {{firstName}},\n\nQ4 is around the corner and I wanted to reach out...',
    category: 'cold_outreach',
    tags: ['ecommerce', 'seasonal', 'urgency'],
    persona: 'vp_director',
    industry: 'ecommerce',
    company_size: 'mid_market',
    sales_stage: 'cold_outreach',
    campaign_type: 'lead_generation',
    tone: 'urgent',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-08'),
    updated_at: new Date('2025-01-08'),
    use_count: 41,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 140,
      opens: 67,
      clicks: 29,
      replies: 31,
      open_rate: 47.9,
      click_rate: 20.7,
      reply_rate: 22.1,
    }
  },
  {
    id: 'template-8',
    workspace_id: 'workspace-1',
    name: 'Financial Services Security Brief',
    description: 'Security-focused messaging for financial services industry',
    subject_line: 'Enhancing security for {{companyName}}\'s client data',
    body_html: '<p>Hi {{firstName}},</p><p>In the financial services space, data security is paramount...</p>',
    body_plain: 'Hi {{firstName}},\n\nIn the financial services space, data security is paramount...',
    category: 'cold_outreach',
    tags: ['fintech', 'security', 'compliance'],
    persona: 'technical',
    industry: 'financial_services',
    company_size: 'enterprise',
    sales_stage: 'cold_outreach',
    campaign_type: 'lead_generation',
    tone: 'professional',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-11'),
    updated_at: new Date('2025-01-13'),
    use_count: 19,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 78,
      opens: 38,
      clicks: 17,
      replies: 11,
      open_rate: 48.7,
      click_rate: 21.8,
      reply_rate: 14.1,
    }
  },
  {
    id: 'template-9',
    workspace_id: 'workspace-1',
    name: 'Product Demo - Feature Deep Dive',
    description: 'Technical demo follow-up highlighting specific features',
    subject_line: 'Demo recording + {{featureName}} details',
    body_html: '<p>Hi {{firstName}},</p><p>Thanks for joining the demo. As promised, here\'s the recording...</p>',
    body_plain: 'Hi {{firstName}},\n\nThanks for joining the demo. As promised, here\'s the recording...',
    category: 'demo',
    tags: ['demo-followup', 'recording', 'features'],
    persona: 'technical',
    industry: 'saas',
    company_size: 'enterprise',
    sales_stage: 'demo',
    campaign_type: 'lead_generation',
    tone: 'educational',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-17'),
    updated_at: new Date('2025-01-17'),
    use_count: 63,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 210,
      opens: 112,
      clicks: 68,
      replies: 59,
      open_rate: 53.3,
      click_rate: 32.4,
      reply_rate: 28.1,
    }
  },
  {
    id: 'template-10',
    workspace_id: 'workspace-1',
    name: 'Warm Lead Nurture - ROI Calculator',
    description: 'Share ROI calculator with engaged leads to move them forward',
    subject_line: 'Calculate {{companyName}}\'s potential ROI',
    body_html: '<p>Hi {{firstName}},</p><p>I put together a quick ROI calculator for {{companyName}}...</p>',
    body_plain: 'Hi {{firstName}},\n\nI put together a quick ROI calculator for {{companyName}}...',
    category: 'lead_nurturing',
    tags: ['roi', 'calculator', 'value'],
    persona: 'c_level',
    industry: 'saas',
    company_size: 'mid_market',
    sales_stage: 'lead_nurturing',
    campaign_type: 'content_distribution',
    tone: 'professional',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-16'),
    updated_at: new Date('2025-01-18'),
    use_count: 38,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 130,
      opens: 71,
      clicks: 44,
      replies: 34,
      open_rate: 54.6,
      click_rate: 33.8,
      reply_rate: 26.2,
    }
  },
  {
    id: 'template-11',
    workspace_id: 'workspace-1',
    name: 'Contract Closing - Urgency',
    description: 'Final push for deals near close with time-sensitive incentive',
    subject_line: 'Last chance: {{discount}}% discount expires {{date}}',
    body_html: '<p>Hi {{firstName}},</p><p>Just a quick reminder that our Q4 promotion ends...</p>',
    body_plain: 'Hi {{firstName}},\n\nJust a quick reminder that our Q4 promotion ends...',
    category: 'closing',
    tags: ['closing', 'discount', 'urgency'],
    persona: 'c_level',
    industry: 'saas',
    company_size: 'enterprise',
    sales_stage: 'closing',
    campaign_type: 'lead_generation',
    tone: 'urgent',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-19'),
    updated_at: new Date('2025-01-19'),
    use_count: 15,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 52,
      opens: 31,
      clicks: 18,
      replies: 14,
      open_rate: 59.6,
      click_rate: 34.6,
      reply_rate: 26.9,
    }
  },
  {
    id: 'template-12',
    workspace_id: 'workspace-1',
    name: 'LinkedIn Connection Follow-up',
    description: 'Move LinkedIn connections to email conversation',
    subject_line: 'Following up from LinkedIn',
    body_html: '<p>Hi {{firstName}},</p><p>Thanks for connecting on LinkedIn! I noticed we\'re both in...</p>',
    body_plain: 'Hi {{firstName}},\n\nThanks for connecting on LinkedIn! I noticed we\'re both in...',
    category: 'cold_outreach',
    tags: ['linkedin', 'social-selling', 'warm'],
    persona: 'manager',
    industry: 'saas',
    company_size: 'smb',
    sales_stage: 'cold_outreach',
    campaign_type: 'lead_generation',
    tone: 'casual',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-13'),
    updated_at: new Date('2025-01-14'),
    use_count: 72,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 245,
      opens: 118,
      clicks: 52,
      replies: 64,
      open_rate: 48.2,
      click_rate: 21.2,
      reply_rate: 26.1,
    }
  },
  {
    id: 'template-13',
    workspace_id: 'workspace-1',
    name: 'Conference Follow-up',
    description: 'Follow up with prospects met at industry conferences',
    subject_line: 'Great meeting you at {{eventName}}',
    body_html: '<p>Hi {{firstName}},</p><p>It was great chatting with you at {{eventName}} last week...</p>',
    body_plain: 'Hi {{firstName}},\n\nIt was great chatting with you at {{eventName}} last week...',
    category: 'lead_nurturing',
    tags: ['event', 'conference', 'warm-intro'],
    persona: 'vp_director',
    industry: 'saas',
    company_size: 'mid_market',
    sales_stage: 'lead_nurturing',
    campaign_type: 'event_promotion',
    tone: 'casual',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-09'),
    updated_at: new Date('2025-01-10'),
    use_count: 29,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 98,
      opens: 62,
      clicks: 38,
      replies: 41,
      open_rate: 63.3,
      click_rate: 38.8,
      reply_rate: 41.8,
    }
  },
  {
    id: 'template-14',
    workspace_id: 'workspace-1',
    name: 'Re-engagement - Dormant Leads',
    description: 'Win back leads who have gone cold',
    subject_line: 'Still interested in solving {{painPoint}}?',
    body_html: '<p>Hi {{firstName}},</p><p>We spoke a few months ago about {{companyName}}\'s challenges with...</p>',
    body_plain: 'Hi {{firstName}},\n\nWe spoke a few months ago about {{companyName}}\'s challenges with...',
    category: 'lead_nurturing',
    tags: ['reengagement', 'dormant', 'revival'],
    persona: 'manager',
    industry: 'ecommerce',
    company_size: 'smb',
    sales_stage: 'lead_nurturing',
    campaign_type: 'reengagement',
    tone: 'casual',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-07'),
    updated_at: new Date('2025-01-08'),
    use_count: 44,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 165,
      opens: 58,
      clicks: 22,
      replies: 18,
      open_rate: 35.2,
      click_rate: 13.3,
      reply_rate: 10.9,
    }
  },
  {
    id: 'template-15',
    workspace_id: 'workspace-1',
    name: 'Pricing & Packaging Discussion',
    description: 'Share pricing details with qualified prospects',
    subject_line: 'Pricing options for {{companyName}}',
    body_html: '<p>Hi {{firstName}},</p><p>Based on our conversation, I\'ve put together pricing options...</p>',
    body_plain: 'Hi {{firstName}},\n\nBased on our conversation, I\'ve put together pricing options...',
    category: 'closing',
    tags: ['pricing', 'proposal', 'custom'],
    persona: 'c_level',
    industry: 'saas',
    company_size: 'enterprise',
    sales_stage: 'closing',
    campaign_type: 'lead_generation',
    tone: 'professional',
    language: 'en',
    status: 'active',
    access_level: 'team',
    version: 1,
    created_by: 'user-1',
    created_at: new Date('2025-01-20'),
    updated_at: new Date('2025-01-20'),
    use_count: 27,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 89,
      opens: 52,
      clicks: 34,
      replies: 23,
      open_rate: 58.4,
      click_rate: 38.2,
      reply_rate: 25.8,
    }
  }
];

const mockSnippets = [
  {
    id: 'snippet-1',
    workspace_id: 'workspace-1',
    name: 'CEO Value Prop',
    content: 'As a CEO, you\'re focused on bottom-line results. Our platform has helped companies like {{companyName}} increase revenue by an average of 30% in the first quarter.',
    snippet_type: 'value_prop',
    tags: ['ceo', 'roi', 'revenue'],
    use_count: 45,
    created_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'snippet-2',
    workspace_id: 'workspace-1',
    name: 'Social Proof - Enterprise',
    content: 'Companies like Salesforce, HubSpot, and Zendesk trust us to power their outreach.',
    snippet_type: 'social_proof',
    tags: ['enterprise', 'logos', 'trust'],
    use_count: 67,
    created_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'snippet-3',
    workspace_id: 'workspace-1',
    name: 'CTA - Book Demo',
    content: 'Would you be open to a quick 15-minute call this week to see how this could work for {{companyName}}?',
    snippet_type: 'cta',
    tags: ['demo', 'call', 'meeting'],
    use_count: 89,
    created_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
  }
];

// GET /api/templates - List templates with filters
app.get('/api/templates', (req: Request, res: Response) => {
  const { search, category, persona, industry, status, page = 1, limit = 20 } = req.query;

  let filtered = [...mockTemplates];

  if (search) {
    const searchLower = String(search).toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower)
    );
  }

  if (category) filtered = filtered.filter(t => t.category === category);
  if (persona) filtered = filtered.filter(t => t.persona === persona);
  if (industry) filtered = filtered.filter(t => t.industry === industry);
  if (status) filtered = filtered.filter(t => t.status === status);

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  return res.json({
    templates: filtered.slice(start, end),
    total: filtered.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(filtered.length / limitNum)
  });
});

// GET /api/templates/top-performers - Get top performing templates (MUST be before :id route)
app.get('/api/templates/top-performers', (_req: Request, res: Response) => {
  const sorted = [...mockTemplates].sort((a, b) =>
    b.performance.reply_rate - a.performance.reply_rate
  ).slice(0, 10);

  return res.json(sorted);
});

// GET /api/templates/:id/performance - Get performance metrics (MUST be before :id route)
app.get('/api/templates/:id/performance', (req: Request, res: Response) => {
  const template = mockTemplates.find(t => t.id === req.params.id);

  if (!template) {
    return res.status(404).json({
      status: 'error',
      message: 'Template not found'
    });
  }

  return res.json(template.performance);
});

// POST /api/templates/:id/duplicate - Duplicate template (MUST be before :id route)
app.post('/api/templates/:id/duplicate', (req: Request, res: Response) => {
  const template = mockTemplates.find(t => t.id === req.params.id);

  if (!template) {
    return res.status(404).json({
      status: 'error',
      message: 'Template not found'
    });
  }

  const duplicated = {
    ...template,
    id: `template-${mockTemplates.length + 1}`,
    name: `${template.name} (Copy)`,
    created_at: new Date(),
    updated_at: new Date(),
    use_count: 0,
  };

  mockTemplates.push(duplicated);
  return res.status(201).json(duplicated);
});

// POST /api/templates/:id/favorite - Add to favorites (MUST be before :id route)
app.post('/api/templates/:id/favorite', (_req: Request, res: Response) => {
  return res.json({ message: 'Template added to favorites' });
});

// DELETE /api/templates/:id/favorite - Remove from favorites (MUST be before :id route)
app.delete('/api/templates/:id/favorite', (_req: Request, res: Response) => {
  return res.json({ message: 'Template removed from favorites' });
});

// GET /api/templates/:id - Get single template
app.get('/api/templates/:id', (req: Request, res: Response) => {
  const template = mockTemplates.find(t => t.id === req.params.id);

  if (!template) {
    return res.status(404).json({
      status: 'error',
      message: 'Template not found'
    });
  }

  return res.json(template);
});

// POST /api/templates - Create new template
app.post('/api/templates', (req: Request, res: Response) => {
  const newTemplate = {
    id: `template-${mockTemplates.length + 1}`,
    workspace_id: 'workspace-1',
    ...req.body,
    created_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
    use_count: 0,
    version: 1,
    is_public: false,
    custom_fields: {},
    performance: {
      sends: 0,
      opens: 0,
      clicks: 0,
      replies: 0,
      open_rate: 0,
      click_rate: 0,
      reply_rate: 0,
    }
  };

  mockTemplates.push(newTemplate);
  return res.status(201).json(newTemplate);
});

// PUT /api/templates/:id - Update template
app.put('/api/templates/:id', (req: Request, res: Response) => {
  const index = mockTemplates.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Template not found'
    });
  }

  mockTemplates[index] = {
    ...mockTemplates[index],
    ...req.body,
    updated_at: new Date(),
  };

  return res.json(mockTemplates[index]);
});

// DELETE /api/templates/:id - Delete template
app.delete('/api/templates/:id', (req: Request, res: Response) => {
  const index = mockTemplates.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Template not found'
    });
  }

  mockTemplates.splice(index, 1);
  return res.json({ message: 'Template deleted successfully' });
});

// ==================== SNIPPET ENDPOINTS ====================

// GET /api/snippets - List snippets
app.get('/api/snippets', (req: Request, res: Response) => {
  const { snippet_type } = req.query;

  let filtered = [...mockSnippets];

  if (snippet_type) {
    filtered = filtered.filter(s => s.snippet_type === snippet_type);
  }

  return res.json(filtered);
});

// POST /api/snippets - Create snippet
app.post('/api/snippets', (req: Request, res: Response) => {
  const newSnippet = {
    id: `snippet-${mockSnippets.length + 1}`,
    workspace_id: 'workspace-1',
    ...req.body,
    use_count: 0,
    created_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  mockSnippets.push(newSnippet);
  return res.status(201).json(newSnippet);
});

// PUT /api/snippets/:id - Update snippet
app.put('/api/snippets/:id', (req: Request, res: Response) => {
  const index = mockSnippets.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Snippet not found'
    });
  }

  mockSnippets[index] = {
    ...mockSnippets[index],
    ...req.body,
    updated_at: new Date(),
  };

  return res.json(mockSnippets[index]);
});

// DELETE /api/snippets/:id - Delete snippet
app.delete('/api/snippets/:id', (req: Request, res: Response) => {
  const index = mockSnippets.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Snippet not found'
    });
  }

  mockSnippets.splice(index, 1);
  return res.json({ message: 'Snippet deleted successfully' });
});

// ==================== EMAIL DATA ====================

import { Email, EmailEvent } from './types/email.types';

const mockEmails: Email[] = [
  // Recent sent emails with various statuses
  {
    id: 'email-1',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-1',
    contact_name: 'Sarah Johnson',
    contact_email: 'sarah.johnson@techcorp.com',
    contact_company: 'TechCorp Inc',
    subject: 'Quick question about your Q1 pipeline goals',
    body_html: '<p>Hi Sarah,</p><p>I noticed your team has been...</p>',
    body_plain: 'Hi Sarah,\n\nI noticed your team has been...',
    status: 'delivered',
    template_id: 'template-1',
    template_name: 'Enterprise Decision Maker Outreach',
    sequence_id: 'seq-1',
    sequence_name: 'Q4 Enterprise Outreach',
    sequence_step: 1,
    opened: true,
    open_count: 3,
    first_opened_at: new Date('2025-01-19T09:15:00'),
    last_opened_at: new Date('2025-01-19T14:30:00'),
    clicked: true,
    click_count: 1,
    first_clicked_at: new Date('2025-01-19T09:20:00'),
    replied: true,
    reply_count: 1,
    first_replied_at: new Date('2025-01-19T11:45:00'),
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-1',
    is_reply: false,
    sent_at: new Date('2025-01-19T08:00:00'),
    delivered_at: new Date('2025-01-19T08:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-19T07:55:00'),
    updated_at: new Date('2025-01-19T11:45:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-001',
    tags: ['enterprise', 'q1-campaign'],
    custom_fields: {}
  },
  {
    id: 'email-2',
    workspace_id: 'workspace-1',
    direction: 'inbound',
    contact_id: 'contact-1',
    contact_name: 'Sarah Johnson',
    contact_email: 'sarah.johnson@techcorp.com',
    contact_company: 'TechCorp Inc',
    sender_name: 'Sarah Johnson',
    sender_email: 'sarah.johnson@techcorp.com',
    subject: 'Re: Quick question about your Q1 pipeline goals',
    body_html: '<p>Hi there,</p><p>Thanks for reaching out! I\'d love to discuss...</p>',
    body_plain: 'Hi there,\n\nThanks for reaching out! I\'d love to discuss...',
    status: 'delivered',
    opened: false,
    open_count: 0,
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-1',
    parent_email_id: 'email-1',
    is_reply: true,
    sent_at: new Date('2025-01-19T11:45:00'),
    delivered_at: new Date('2025-01-19T11:45:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-19T11:45:00'),
    updated_at: new Date('2025-01-19T11:45:00'),
    provider: 'sendgrid',
    tags: ['enterprise', 'q1-campaign'],
    custom_fields: {}
  },
  {
    id: 'email-3',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-2',
    contact_name: 'Michael Chen',
    contact_email: 'mchen@innovate.io',
    contact_company: 'Innovate.io',
    subject: 'How Innovate.io can boost engineering velocity by 40%',
    body_html: '<p>Hi Michael,</p><p>I saw your recent post about...</p>',
    body_plain: 'Hi Michael,\n\nI saw your recent post about...',
    status: 'delivered',
    template_id: 'template-2',
    template_name: 'Technical Decision Maker - Product Demo',
    sequence_id: 'seq-1',
    sequence_name: 'Q4 Enterprise Outreach',
    sequence_step: 1,
    opened: true,
    open_count: 5,
    first_opened_at: new Date('2025-01-19T10:30:00'),
    last_opened_at: new Date('2025-01-19T16:45:00'),
    clicked: true,
    click_count: 3,
    first_clicked_at: new Date('2025-01-19T10:35:00'),
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-2',
    is_reply: false,
    sent_at: new Date('2025-01-19T10:00:00'),
    delivered_at: new Date('2025-01-19T10:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-19T09:55:00'),
    updated_at: new Date('2025-01-19T16:45:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-002',
    tags: ['technical', 'engineering'],
    custom_fields: {}
  },
  {
    id: 'email-4',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-3',
    contact_name: 'Lisa Rodriguez',
    contact_email: 'lisa.r@startupxyz.com',
    contact_company: 'StartupXYZ',
    subject: 'Quick win: Increase your outbound reply rate this week',
    body_html: '<p>Hi Lisa,</p><p>Quick question - are you happy with...</p>',
    body_plain: 'Hi Lisa,\n\nQuick question - are you happy with...',
    status: 'delivered',
    template_id: 'template-3',
    template_name: 'SMB Owner Quick Win',
    sequence_id: 'seq-2',
    sequence_name: 'SMB Outreach Campaign',
    sequence_step: 1,
    opened: true,
    open_count: 1,
    first_opened_at: new Date('2025-01-19T13:20:00'),
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-3',
    is_reply: false,
    sent_at: new Date('2025-01-19T12:00:00'),
    delivered_at: new Date('2025-01-19T12:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-19T11:55:00'),
    updated_at: new Date('2025-01-19T13:20:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-003',
    tags: ['smb', 'quick-win'],
    custom_fields: {}
  },
  {
    id: 'email-5',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-4',
    contact_name: 'David Park',
    contact_email: 'dpark@globalcorp.com',
    contact_company: 'GlobalCorp',
    subject: 'Following up on our demo last week',
    body_html: '<p>Hi David,</p><p>Thanks for taking the time...</p>',
    body_plain: 'Hi David,\n\nThanks for taking the time...',
    status: 'delivered',
    template_id: 'template-5',
    template_name: 'Post-Demo Follow-up',
    opened: false,
    open_count: 0,
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-4',
    is_reply: false,
    sent_at: new Date('2025-01-19T14:00:00'),
    delivered_at: new Date('2025-01-19T14:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-19T13:55:00'),
    updated_at: new Date('2025-01-19T14:01:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-004',
    tags: ['demo-followup'],
    custom_fields: {}
  },
  {
    id: 'email-6',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-5',
    contact_name: 'Jennifer Martinez',
    contact_email: 'jmartinez@bounce-test.com',
    contact_company: 'Test Company',
    subject: 'Exploring partnership opportunities',
    body_html: '<p>Hi Jennifer,</p><p>I wanted to reach out...</p>',
    body_plain: 'Hi Jennifer,\n\nI wanted to reach out...',
    status: 'bounced',
    opened: false,
    open_count: 0,
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: true,
    bounce_type: 'hard',
    bounce_reason: 'Email address does not exist',
    bounced_at: new Date('2025-01-18T09:05:00'),
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-5',
    is_reply: false,
    sent_at: new Date('2025-01-18T09:00:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-18T08:55:00'),
    updated_at: new Date('2025-01-18T09:05:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-005',
    tags: ['cold-outreach'],
    custom_fields: {}
  },
  {
    id: 'email-7',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-6',
    contact_name: 'Robert Taylor',
    contact_email: 'rtaylor@enterprise.com',
    contact_company: 'Enterprise Solutions',
    subject: 'Case study: How similar companies saved $500K/year',
    body_html: '<p>Hi Robert,</p><p>I thought you might be interested...</p>',
    body_plain: 'Hi Robert,\n\nI thought you might be interested...',
    status: 'delivered',
    template_id: 'template-4',
    template_name: 'VP Sales Lead Nurture - Case Study',
    sequence_id: 'seq-3',
    sequence_name: 'VP Sales Nurture',
    sequence_step: 2,
    opened: true,
    open_count: 2,
    first_opened_at: new Date('2025-01-18T11:30:00'),
    last_opened_at: new Date('2025-01-18T15:20:00'),
    clicked: true,
    click_count: 1,
    first_clicked_at: new Date('2025-01-18T11:35:00'),
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-6',
    is_reply: false,
    sent_at: new Date('2025-01-18T11:00:00'),
    delivered_at: new Date('2025-01-18T11:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-18T10:55:00'),
    updated_at: new Date('2025-01-18T15:20:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-006',
    tags: ['case-study', 'vp-sales'],
    custom_fields: {}
  },
  {
    id: 'email-8',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-7',
    contact_name: 'Amanda White',
    contact_email: 'awhite@scheduling-test.com',
    contact_company: 'Schedule Test Co',
    subject: 'Scheduled: Product roadmap discussion',
    body_html: '<p>Hi Amanda,</p><p>Looking forward to our call...</p>',
    body_plain: 'Hi Amanda,\n\nLooking forward to our call...',
    status: 'scheduled',
    opened: false,
    open_count: 0,
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-7',
    is_reply: false,
    scheduled_at: new Date('2025-01-20T10:00:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-19T16:00:00'),
    updated_at: new Date('2025-01-19T16:00:00'),
    provider: 'sendgrid',
    tags: ['scheduled'],
    custom_fields: {}
  },
  {
    id: 'email-9',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-8',
    contact_name: 'Kevin Brown',
    contact_email: 'kbrown@techsolutions.io',
    contact_company: 'Tech Solutions',
    subject: 'Your free trial expires in 3 days',
    body_html: '<p>Hi Kevin,</p><p>Just a friendly reminder...</p>',
    body_plain: 'Hi Kevin,\n\nJust a friendly reminder...',
    status: 'delivered',
    template_id: 'template-6',
    template_name: 'Trial Expiration Reminder',
    opened: true,
    open_count: 1,
    first_opened_at: new Date('2025-01-18T08:15:00'),
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-8',
    is_reply: false,
    sent_at: new Date('2025-01-18T08:00:00'),
    delivered_at: new Date('2025-01-18T08:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-18T07:55:00'),
    updated_at: new Date('2025-01-18T08:15:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-007',
    tags: ['trial', 'reminder'],
    custom_fields: {}
  },
  {
    id: 'email-10',
    workspace_id: 'workspace-1',
    direction: 'outbound',
    contact_id: 'contact-9',
    contact_name: 'Patricia Green',
    contact_email: 'pgreen@bigcompany.com',
    contact_company: 'Big Company Inc',
    subject: 'Have you considered automating your outreach?',
    body_html: '<p>Hi Patricia,</p><p>I noticed your company has been growing...</p>',
    body_plain: 'Hi Patricia,\n\nI noticed your company has been growing...',
    status: 'delivered',
    template_id: 'template-7',
    template_name: 'Growth Company Outreach',
    sequence_id: 'seq-4',
    sequence_name: 'Mid-Market Growth',
    sequence_step: 1,
    opened: false,
    open_count: 0,
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    thread_id: 'thread-9',
    is_reply: false,
    sent_at: new Date('2025-01-17T15:00:00'),
    delivered_at: new Date('2025-01-17T15:01:00'),
    sent_by: 'user-1',
    created_at: new Date('2025-01-17T14:55:00'),
    updated_at: new Date('2025-01-17T15:01:00'),
    provider: 'sendgrid',
    provider_message_id: 'sg-msg-008',
    tags: ['mid-market', 'automation'],
    custom_fields: {}
  },
];

const mockEmailEvents: EmailEvent[] = [
  {
    id: 'event-1',
    email_id: 'email-1',
    event_type: 'opened',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0',
    location: 'San Francisco, CA',
    device: 'Desktop',
    occurred_at: new Date('2025-01-19T09:15:00'),
    created_at: new Date('2025-01-19T09:15:00')
  },
  {
    id: 'event-2',
    email_id: 'email-1',
    event_type: 'clicked',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0',
    location: 'San Francisco, CA',
    device: 'Desktop',
    occurred_at: new Date('2025-01-19T09:20:00'),
    created_at: new Date('2025-01-19T09:20:00')
  },
  {
    id: 'event-3',
    email_id: 'email-1',
    event_type: 'replied',
    occurred_at: new Date('2025-01-19T11:45:00'),
    created_at: new Date('2025-01-19T11:45:00')
  },
];

// ==================== EMAIL ENDPOINTS ====================

// GET /api/emails - List emails with filters
app.get('/api/emails', (req: Request, res: Response) => {
  const {
    status,
    direction,
    opened,
    clicked,
    replied,
    bounced,
    search,
    page = '1',
    limit = '25',
    sort_by = 'sent_at',
    sort_order = 'desc'
  } = req.query;

  let filtered = [...mockEmails];

  // Apply filters
  if (status) {
    filtered = filtered.filter(e => e.status === status);
  }
  if (direction) {
    filtered = filtered.filter(e => e.direction === direction);
  }
  if (opened === 'true') {
    filtered = filtered.filter(e => e.opened);
  }
  if (clicked === 'true') {
    filtered = filtered.filter(e => e.clicked);
  }
  if (replied === 'true') {
    filtered = filtered.filter(e => e.replied);
  }
  if (bounced === 'true') {
    filtered = filtered.filter(e => e.bounced);
  }
  if (search) {
    const searchLower = (search as string).toLowerCase();
    filtered = filtered.filter(e =>
      e.contact_name.toLowerCase().includes(searchLower) ||
      e.contact_email.toLowerCase().includes(searchLower) ||
      e.subject.toLowerCase().includes(searchLower) ||
      (e.contact_company && e.contact_company.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sort_by) {
      case 'sent_at':
        aVal = a.sent_at?.getTime() || 0;
        bVal = b.sent_at?.getTime() || 0;
        break;
      case 'contact_name':
        aVal = a.contact_name;
        bVal = b.contact_name;
        break;
      case 'subject':
        aVal = a.subject;
        bVal = b.subject;
        break;
      default:
        aVal = a.created_at.getTime();
        bVal = b.created_at.getTime();
    }

    if (sort_order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedEmails = filtered.slice(startIndex, endIndex);

  return res.json({
    emails: paginatedEmails,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum)
    }
  });
});

// GET /api/emails/stats - Get email statistics
app.get('/api/emails/stats', (_req: Request, res: Response) => {
  const total_sent = mockEmails.filter(e => e.status === 'sent' || e.status === 'delivered').length;
  const total_delivered = mockEmails.filter(e => e.status === 'delivered').length;
  const total_bounced = mockEmails.filter(e => e.bounced).length;
  const total_opened = mockEmails.filter(e => e.opened).length;
  const total_clicked = mockEmails.filter(e => e.clicked).length;
  const total_replied = mockEmails.filter(e => e.replied).length;

  return res.json({
    total_sent,
    total_delivered,
    total_bounced,
    total_opened,
    total_clicked,
    total_replied,
    delivery_rate: total_sent > 0 ? ((total_delivered / total_sent) * 100).toFixed(1) : '0.0',
    open_rate: total_delivered > 0 ? ((total_opened / total_delivered) * 100).toFixed(1) : '0.0',
    click_rate: total_opened > 0 ? ((total_clicked / total_opened) * 100).toFixed(1) : '0.0',
    reply_rate: total_delivered > 0 ? ((total_replied / total_delivered) * 100).toFixed(1) : '0.0',
    bounce_rate: total_sent > 0 ? ((total_bounced / total_sent) * 100).toFixed(1) : '0.0',
  });
});

// GET /api/emails/:id - Get single email
app.get('/api/emails/:id', (req: Request, res: Response) => {
  const email = mockEmails.find(e => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({
      status: 'error',
      message: 'Email not found'
    });
  }
  return res.json(email);
});

// GET /api/emails/:id/events - Get email events
app.get('/api/emails/:id/events', (req: Request, res: Response) => {
  const events = mockEmailEvents.filter(e => e.email_id === req.params.id);
  return res.json(events);
});

// GET /api/emails/thread/:threadId - Get emails in thread
app.get('/api/emails/thread/:threadId', (req: Request, res: Response) => {
  const threadEmails = mockEmails
    .filter(e => e.thread_id === req.params.threadId)
    .sort((a, b) => (a.sent_at?.getTime() || 0) - (b.sent_at?.getTime() || 0));
  return res.json(threadEmails);
});

// POST /api/emails - Create/send email
app.post('/api/emails', (req: Request, res: Response) => {
  const newEmail: Email = {
    id: `email-${mockEmails.length + 1}`,
    workspace_id: 'workspace-1',
    direction: 'outbound',
    ...req.body,
    status: req.body.scheduled_at ? 'scheduled' : 'sent',
    opened: false,
    open_count: 0,
    clicked: false,
    click_count: 0,
    replied: false,
    reply_count: 0,
    bounced: false,
    unsubscribed: false,
    spam_reported: false,
    is_reply: false,
    thread_id: `thread-${mockEmails.length + 1}`,
    sent_at: req.body.scheduled_at ? undefined : new Date(),
    sent_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
    provider: 'sendgrid',
    tags: req.body.tags || [],
    custom_fields: {}
  };

  mockEmails.push(newEmail);
  return res.status(201).json(newEmail);
});

// Catch all for unimplemented endpoints
app.all('/api/*', (req: Request, res: Response) => {
  res.status(501).json({
    status: 'error',
    message: 'This endpoint is not yet implemented in the mock server',
    endpoint: req.path,
    method: req.method,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Mock Backend Server Started');
  console.log('='.repeat(60));
  console.log(`Port: ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`API Docs: http://localhost:${PORT}/api/docs`);
  console.log('');
  console.log('⚠️  NOTE: This is a MOCK server for frontend development');
  console.log('   Database is NOT connected. All responses are mocked.');
  console.log('='.repeat(60));
});

export default app;
