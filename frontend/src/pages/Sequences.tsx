import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  FireIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { SequenceBuilder } from '../components/SequenceBuilder';

type ViewMode = 'templates' | 'active' | 'all';
type TemplateCategory = 'all' | 'cold_outreach' | 'nurture' | 'demo_followup' | 'reengagement';

interface SequenceStep {
  id: string;
  type: 'email' | 'task' | 'wait';
  subject?: string;
  body?: string;
  taskDescription?: string;
  waitDays?: number;
}

interface CreateSequenceForm {
  name: string;
  description: string;
  category: string;
  steps: SequenceStep[];
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject_line: string;
  body_html: string;
  category: string;
  tags: string[];
  persona: string;
  industry: string;
  performance?: {
    open_rate: number;
    click_rate: number;
    reply_rate: number;
  };
}

const Sequences: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('templates');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [formData, setFormData] = useState<CreateSequenceForm>({
    name: '',
    description: '',
    category: 'cold_outreach',
    steps: [
      {
        id: '1',
        type: 'email',
        subject: '',
        body: '',
      },
    ],
  });

  // Template selection state
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [availableTemplates, setAvailableTemplates] = useState<EmailTemplate[]>([]);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Use sequence workflow state
  const [showUseSequenceModal, setShowUseSequenceModal] = useState(false);
  const [selectedSequenceForUse, setSelectedSequenceForUse] = useState<any>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactSearch, setContactSearch] = useState('');
  const [campaignName, setCampaignName] = useState('');

  // View sequence details state
  const [showSequenceDetails, setShowSequenceDetails] = useState(false);
  const [selectedSequenceForView, setSelectedSequenceForView] = useState<any>(null);

  // Visual builder state
  const [showVisualBuilder, setShowVisualBuilder] = useState(false);
  const [builderSequenceName, setBuilderSequenceName] = useState('');

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const response = await fetch('http://localhost:3001/api/templates');
        const data = await response.json();
        setAvailableTemplates(data.templates || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  // Template data organized by category
  const templates = [
    // Cold Outreach templates - BLUE family (cold/initial contact)
    {
      id: 1,
      name: 'Enterprise Cold Outreach',
      category: 'cold_outreach' as TemplateCategory,
      persona: 'C-Level Executives',
      description: 'Multi-touch sequence for breaking into enterprise accounts with personalized value props',
      steps: 6,
      avgReplyRate: '18%',
      bestFor: 'Enterprise sales, new logo acquisition',
      icon: RocketLaunchIcon,
      color: 'blue', // Primary cold outreach color
      emailSteps: [
        { day: 1, subject: 'Quick question about {{companyName}}\'s growth strategy', type: 'Initial Outreach' },
        { day: 3, subject: 'Following up - relevant case study', type: 'Value Add' },
        { day: 7, subject: 'Different approach: {{pain_point}} solution', type: 'Different Angle' },
        { day: 10, subject: 'Last try - worth 15 minutes?', type: 'Final Attempt' },
        { day: 14, subject: 'Breaking up is hard to do', type: 'Breakup Email' },
        { day: 21, subject: 'New feature: thought of you', type: 'Re-engagement' },
      ],
    },
    {
      id: 2,
      name: 'SDR Cold Prospecting',
      category: 'cold_outreach' as TemplateCategory,
      persona: 'Mid-Market',
      description: 'High-volume cold outreach with A/B tested subject lines and quick value delivery',
      steps: 5,
      avgReplyRate: '22%',
      bestFor: 'SDR teams, pipeline generation',
      icon: RocketLaunchIcon,
      color: 'indigo', // Variant of blue for cold outreach
      emailSteps: [
        { day: 1, subject: "Saw you're hiring for {{role}} - quick idea", type: 'Initial Outreach' },
        { day: 2, subject: 'Re: {{companyName}} + our solution', type: 'Quick Follow-up' },
        { day: 5, subject: '3 companies like yours using this', type: 'Social Proof' },
        { day: 8, subject: 'Last thing - 2 minute video', type: 'Video Outreach' },
        { day: 12, subject: 'Closing the loop', type: 'Final Touch' },
      ],
    },
    {
      id: 3,
      name: 'Technical Buyer Outreach',
      category: 'cold_outreach' as TemplateCategory,
      persona: 'Engineering Leaders',
      description: 'Technical approach for CTOs, VPs of Engineering with product deep-dives',
      steps: 4,
      avgReplyRate: '28%',
      bestFor: 'Technical products, developer tools',
      icon: RocketLaunchIcon,
      color: 'blue', // Consistent cold outreach color
    },
    // Lead Nurturing templates - GREEN family (growth/development)
    {
      id: 4,
      name: 'MQL to SQL Nurture',
      category: 'nurture' as TemplateCategory,
      persona: 'Marketing Qualified Leads',
      description: 'Progressive nurture sequence with educational content and case studies',
      steps: 7,
      avgReplyRate: '31%',
      bestFor: 'Marketing-generated leads, longer sales cycles',
      icon: SparklesIcon,
      color: 'green', // Growth and nurturing
    },
    {
      id: 5,
      name: 'Trial User Engagement',
      category: 'nurture' as TemplateCategory,
      persona: 'Free Trial Users',
      description: 'Guide trial users through key features with tactical tips and success stories',
      steps: 5,
      avgReplyRate: '42%',
      bestFor: 'Product-led growth, freemium conversion',
      icon: SparklesIcon,
      color: 'teal', // Variant for active trial engagement
    },
    {
      id: 6,
      name: 'Warm Lead Follow-up',
      category: 'nurture' as TemplateCategory,
      persona: 'Engaged Prospects',
      description: 'Multi-channel follow-up for prospects who showed interest but didn\'t convert',
      steps: 4,
      avgReplyRate: '35%',
      bestFor: 'Engaged prospects, post-event follow-up',
      icon: SparklesIcon,
      color: 'green', // Consistent nurture color
    },
    // Demo Follow-up templates - ORANGE/RED family (hot/urgent)
    {
      id: 7,
      name: 'Post-Demo Follow-up',
      category: 'demo_followup' as TemplateCategory,
      persona: 'Demo Attendees',
      description: 'Structured follow-up after demo with custom deck, pricing, and next steps',
      steps: 5,
      avgReplyRate: '45%',
      bestFor: 'Demo-driven sales, closing pipeline',
      icon: FireIcon,
      color: 'orange', // Hot opportunity, close to closing
      emailSteps: [
        { day: 1, subject: 'Thanks for the demo - custom deck attached', type: 'Immediate Follow-up' },
        { day: 2, subject: 'Pricing breakdown for {{companyName}}', type: 'Pricing Details' },
        { day: 4, subject: 'Answering your security questions', type: 'Address Concerns' },
        { day: 7, subject: 'Next steps to get started', type: 'Call to Action' },
        { day: 10, subject: 'Ready when you are', type: 'Gentle Nudge' },
      ],
    },
    {
      id: 8,
      name: 'No-Show Demo Recovery',
      category: 'demo_followup' as TemplateCategory,
      persona: 'Demo No-Shows',
      description: 'Re-engage prospects who missed scheduled demos with flexible rescheduling',
      steps: 3,
      avgReplyRate: '24%',
      bestFor: 'Demo recovery, calendar reschedules',
      icon: FireIcon,
      color: 'red', // Urgent - need to recover quickly
    },
    {
      id: 9,
      name: 'Multi-Stakeholder Demo',
      category: 'demo_followup' as TemplateCategory,
      persona: 'Buying Committee',
      description: 'Coordinate multi-stakeholder demos with decision makers and champions',
      steps: 4,
      avgReplyRate: '38%',
      bestFor: 'Enterprise sales, complex buying committees',
      icon: FireIcon,
      color: 'orange', // Hot opportunity
    },
    // Re-engagement templates - PURPLE family (revival/reactivation)
    {
      id: 10,
      name: 'Dormant Account Revival',
      category: 'reengagement' as TemplateCategory,
      persona: 'Churned Customers',
      description: 'Win-back sequence for churned customers with new features and improvements',
      steps: 4,
      avgReplyRate: '16%',
      bestFor: 'Customer win-back, churn reduction',
      icon: ArrowPathIcon,
      color: 'purple', // Revival and transformation
    },
    {
      id: 11,
      name: 'Stalled Deal Revival',
      category: 'reengagement' as TemplateCategory,
      persona: 'Stalled Opportunities',
      description: 'Re-activate deals that went dark with fresh angles and updated ROI',
      steps: 3,
      avgReplyRate: '19%',
      bestFor: 'Pipeline revival, deal acceleration',
      icon: ArrowPathIcon,
      color: 'purple', // Consistent revival color
    },
    {
      id: 12,
      name: 'Cold Lead Reactivation',
      category: 'reengagement' as TemplateCategory,
      persona: 'Old Leads',
      description: 'Breathe life into old leads with new messaging, social proof, and timing',
      steps: 4,
      avgReplyRate: '21%',
      bestFor: 'Database reactivation, lead recycling',
      icon: ArrowPathIcon,
      color: 'purple', // Consistent revival color
    },
  ];

  // Mock contacts for sequence workflow
  const mockContacts = [
    { id: '1', name: 'John Smith', email: 'john@enterprise.com', company: 'Enterprise Corp' },
    { id: '2', name: 'Jane Doe', email: 'jane@techstart.com', company: 'TechStart Inc' },
    { id: '3', name: 'Mike Johnson', email: 'mike@innovate.io', company: 'Innovate Solutions' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@growth.co', company: 'Growth Partners' },
    { id: '5', name: 'David Brown', email: 'david@venture.com', company: 'Venture Capital LLC' },
    { id: '6', name: 'Emily Davis', email: 'emily@scale.io', company: 'Scale Ventures' },
    { id: '7', name: 'Robert Miller', email: 'robert@engage.com', company: 'Engage Marketing' },
    { id: '8', name: 'Lisa Anderson', email: 'lisa@connect.io', company: 'Connect CRM' },
  ];

  // Active sequences (user's running campaigns)
  const activeSequences = [
    {
      id: 101,
      name: 'Q4 Enterprise Outreach',
      template: 'Enterprise Decision Maker Outreach',
      status: 'active',
      contacts: 125,
      sent: 458,
      opened: 245,
      replied: 56,
      replyRate: '12.2%',
      createdAt: '2025-10-15',
    },
    {
      id: 102,
      name: 'Product Demo Follow-up',
      template: 'SaaS Platform Demo Request',
      status: 'active',
      contacts: 89,
      sent: 267,
      opened: 189,
      replied: 48,
      replyRate: '18.0%',
      createdAt: '2025-10-20',
    },
    {
      id: 103,
      name: 'Cold Outreach - Tech',
      template: 'Technical Decision Maker',
      status: 'paused',
      contacts: 156,
      sent: 623,
      opened: 312,
      replied: 71,
      replyRate: '11.4%',
      createdAt: '2025-09-28',
    },
  ];

  // Sequence creation handlers
  const handleAddStep = (type: 'email' | 'task' | 'wait') => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type,
      ...(type === 'email' && { subject: '', body: '' }),
      ...(type === 'task' && { taskDescription: '' }),
      ...(type === 'wait' && { waitDays: 1 }),
    };
    setFormData({ ...formData, steps: [...formData.steps, newStep] });
  };

  const handleUpdateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setFormData({
      ...formData,
      steps: formData.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    });
  };

  const handleRemoveStep = (stepId: string) => {
    if (formData.steps.length > 1) {
      setFormData({
        ...formData,
        steps: formData.steps.filter(step => step.id !== stepId),
      });
    }
  };

  const handleCreateSequence = async () => {
    console.log('Creating sequence:', formData);
    // TODO: Implement API call
    setShowCreateModal(false);
    setCreateStep(1);
    setFormData({
      name: '',
      description: '',
      category: 'cold_outreach',
      steps: [
        {
          id: '1',
          type: 'email',
          subject: '',
          body: '',
        },
      ],
    });
  };

  // Template selection handlers
  const handleOpenTemplatePicker = (stepId: string) => {
    setCurrentStepId(stepId);
    setShowTemplatePicker(true);
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    // Strip HTML tags from body_html for plain text display
    const plainBody = template.body_html.replace(/<[^>]*>/g, '');

    handleUpdateStep(currentStepId, {
      subject: template.subject_line,
      body: plainBody,
    });
    setShowTemplatePicker(false);
    setTemplateSearchQuery('');
  };

  const filteredEmailTemplates = availableTemplates.filter(template =>
    template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(templateSearchQuery.toLowerCase())
  );

  const canProceedToNextStep = () => {
    switch (createStep) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.steps.every(step => {
          if (step.type === 'email') {
            return step.subject?.trim() && step.body?.trim();
          }
          if (step.type === 'task') {
            return step.taskDescription?.trim();
          }
          if (step.type === 'wait') {
            return step.waitDays && step.waitDays > 0;
          }
          return false;
        });
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Use sequence workflow handlers
  const handleUseSequence = (template: any) => {
    setSelectedSequenceForUse(template);
    setCampaignName(`${template.name} Campaign`);
    setShowUseSequenceModal(true);
  };

  const handleViewSequenceDetails = (template: any) => {
    setSelectedSequenceForView(template);
    setShowSequenceDetails(true);
  };

  const handleStartCampaign = () => {
    console.log('[DEMO MODE] Campaign setup:', {
      sequenceName: selectedSequenceForUse?.name,
      campaignName: campaignName,
      contactCount: selectedContacts.length,
      contacts: selectedContacts,
    });

    // Show success message for demo
    alert(
      `✅ Campaign Setup Complete (Demo Mode)\n\n` +
      `Campaign: "${campaignName}"\n` +
      `Sequence: ${selectedSequenceForUse?.name}\n` +
      `Contacts: ${selectedContacts.length}\n` +
      `Steps: ${selectedSequenceForUse?.steps} emails\n\n` +
      `In production, this would:\n` +
      `• Schedule ${selectedSequenceForUse?.steps} emails per contact\n` +
      `• Track opens, clicks, and replies\n` +
      `• Automatically pause on reply\n` +
      `• Show in Active Campaigns tab`
    );

    setShowUseSequenceModal(false);
    setSelectedContacts([]);
    setContactSearch('');
    setCampaignName('');
  };

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.company.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const filteredTemplates = templates
    .filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.persona.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Only randomize when "All Templates" is selected
      if (selectedCategory === 'all') {
        // Use template id as seed for consistent "random" order
        const hashA = a.id * 2654435761 % 2147483647;
        const hashB = b.id * 2654435761 % 2147483647;
        return hashA - hashB;
      }
      // Keep original order for filtered categories
      return 0;
    });

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
      lime: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Sequences</h1>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === 'templates' ? 'Choose from proven templates or create your own' :
             viewMode === 'active' ? 'Manage your active campaigns' :
             'View all sequences'}
          </p>
        </div>
        <button
          onClick={() => {
            setBuilderSequenceName('New Sequence');
            setShowVisualBuilder(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New Sequence
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setViewMode('templates')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'templates'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SparklesIcon className="w-5 h-5 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setViewMode('active')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'active'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PlayIcon className="w-5 h-5 inline mr-2" />
            Active ({activeSequences.filter(s => s.status === 'active').length})
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'all'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FunnelIcon className="w-5 h-5 inline mr-2" />
            All Sequences ({activeSequences.length})
          </button>
        </nav>
      </div>

      {/* Templates View */}
      {viewMode === 'templates' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                selectedCategory === 'all'
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Templates
            </button>
            <button
              onClick={() => setSelectedCategory('cold_outreach')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'cold_outreach'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <RocketLaunchIcon className="w-4 h-4 mr-1" />
              Cold Outreach
            </button>
            <button
              onClick={() => setSelectedCategory('nurture')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'nurture'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SparklesIcon className="w-4 h-4 mr-1" />
              Lead Nurturing
            </button>
            <button
              onClick={() => setSelectedCategory('demo_followup')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'demo_followup'
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FireIcon className="w-4 h-4 mr-1" />
              Demo Follow-up
            </button>
            <button
              onClick={() => setSelectedCategory('reengagement')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'reengagement'
                  ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Re-engagement
            </button>
          </div>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const colors = getColorClasses(template.color);
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all p-6 cursor-pointer hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">Persona:</span>
                      <span className="ml-1">{template.persona}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">Steps:</span>
                      <span className="ml-1">{template.steps} emails</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ChartBarIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">Avg Reply Rate:</span>
                      <span className="ml-1 text-green-600 font-semibold">{template.avgReplyRate}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">Best for:</p>
                    <p className="text-sm text-gray-700">{template.bestFor}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewSequenceDetails(template)}
                      className="flex-1 px-4 py-2 border-2 border-primary-600 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleUseSequence(template)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Use This
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Sequences View */}
      {viewMode === 'active' && (
        <div className="space-y-4">
          {activeSequences.filter(s => s.status === 'active').map((sequence) => (
            <div key={sequence.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Based on: {sequence.template}</p>
                  <p className="text-xs text-gray-400 mt-1">Created: {sequence.createdAt}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                    <PauseIcon className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-200">
                    View Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Contacts</p>
                  <p className="text-xl font-bold text-gray-900">{sequence.contacts}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Sent</p>
                  <p className="text-xl font-bold text-blue-700">{sequence.sent}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Opened</p>
                  <p className="text-xl font-bold text-green-700">{sequence.opened}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Replied</p>
                  <p className="text-xl font-bold text-purple-700">{sequence.replied}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Reply Rate</p>
                  <p className="text-xl font-bold text-yellow-700">{sequence.replyRate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Sequences View */}
      {viewMode === 'all' && (
        <div className="space-y-4">
          {activeSequences.map((sequence) => (
            <div key={sequence.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      sequence.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sequence.status.charAt(0).toUpperCase() + sequence.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Template: {sequence.template}</p>
                </div>
                <div className="flex space-x-2">
                  {sequence.status === 'active' ? (
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center">
                      <PauseIcon className="w-4 h-4 mr-1" />
                      Pause
                    </button>
                  ) : (
                    <button className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 flex items-center">
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Resume
                    </button>
                  )}
                  <button className="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
                    View Analytics
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Contacts</p>
                  <p className="text-lg font-semibold text-gray-900">{sequence.contacts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sent</p>
                  <p className="text-lg font-semibold text-gray-900">{sequence.sent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Opened</p>
                  <p className="text-lg font-semibold text-gray-900">{sequence.opened}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Replied</p>
                  <p className="text-lg font-semibold text-gray-900">{sequence.replied}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reply Rate</p>
                  <p className="text-lg font-semibold text-green-600">{sequence.replyRate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Sequence Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Sequence</h2>
                <p className="text-sm text-gray-500 mt-1">Step {createStep} of 3</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateStep(1);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    createStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {createStep > 1 ? <CheckIcon className="w-6 h-6" /> : '1'}
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${createStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                </div>
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    createStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {createStep > 2 ? <CheckIcon className="w-6 h-6" /> : '2'}
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${createStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  createStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
              {/* Step 1: Basic Info */}
              {createStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sequence Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Q4 Enterprise Outreach"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description of this sequence's purpose"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="cold_outreach">Cold Outreach</option>
                          <option value="nurture">Lead Nurturing</option>
                          <option value="demo_followup">Demo Follow-up</option>
                          <option value="reengagement">Re-engagement</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Sequence Steps */}
              {createStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sequence Steps</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddStep('email')}
                        className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center"
                      >
                        <EnvelopeIcon className="w-4 h-4 mr-1" />
                        Add Email
                      </button>
                      <button
                        onClick={() => handleAddStep('wait')}
                        className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center"
                      >
                        <ClockIcon className="w-4 h-4 mr-1" />
                        Add Wait
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formData.steps.map((step, index) => (
                      <div key={step.id} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {step.type === 'email' ? 'Email' : step.type === 'task' ? 'Task' : 'Wait Period'}
                            </span>
                          </div>
                          {formData.steps.length > 1 && (
                            <button
                              onClick={() => handleRemoveStep(step.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {step.type === 'email' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-medium text-gray-600">Email Content</label>
                              <button
                                onClick={() => handleOpenTemplatePicker(step.id)}
                                className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 flex items-center"
                              >
                                <DocumentTextIcon className="w-3 h-3 mr-1" />
                                Use Template
                              </button>
                            </div>
                            <input
                              type="text"
                              value={step.subject || ''}
                              onChange={(e) => handleUpdateStep(step.id, { subject: e.target.value })}
                              placeholder="Email subject line"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            />
                            <textarea
                              value={step.body || ''}
                              onChange={(e) => handleUpdateStep(step.id, { body: e.target.value })}
                              placeholder="Email body..."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-mono"
                            />
                          </div>
                        )}

                        {step.type === 'wait' && (
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">Wait for</span>
                            <input
                              type="number"
                              min="1"
                              value={step.waitDays || 1}
                              onChange={(e) => handleUpdateStep(step.id, { waitDays: parseInt(e.target.value) })}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            />
                            <span className="text-sm text-gray-600">days before next step</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Review & Settings */}
              {createStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Sequence</h3>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sequence Name</p>
                        <p className="text-lg font-semibold text-gray-900">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-gray-700">{formData.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p className="text-gray-700 capitalize">{formData.category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">Steps</p>
                        <div className="space-y-2">
                          {formData.steps.map((step, index) => (
                            <div key={step.id} className="flex items-start space-x-3 text-sm">
                              <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                {step.type === 'email' && (
                                  <div>
                                    <p className="font-medium text-gray-900">Email: {step.subject}</p>
                                    <p className="text-gray-600 text-xs line-clamp-2">{step.body}</p>
                                  </div>
                                )}
                                {step.type === 'wait' && (
                                  <p className="text-gray-700">Wait {step.waitDays} day(s)</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> After creating this sequence, you'll be able to add contacts and start the campaign from the Active Sequences tab.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setCreateStep(Math.max(1, createStep - 1))}
                disabled={createStep === 1}
                className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                  createStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateStep(1);
                  }}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                {createStep < 3 ? (
                  <button
                    onClick={() => setCreateStep(createStep + 1)}
                    disabled={!canProceedToNextStep()}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                      canProceedToNextStep()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreateSequence}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Create Sequence
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Email Template</h2>
                <p className="text-sm text-gray-500 mt-1">Select a template to use in your sequence</p>
              </div>
              <button
                onClick={() => {
                  setShowTemplatePicker(false);
                  setTemplateSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pt-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Template List */}
            <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {loadingTemplates ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredEmailTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No templates found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEmailTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-400 cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">{template.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          template.category === 'cold_outreach' ? 'bg-blue-100 text-blue-700' :
                          template.category === 'demo' ? 'bg-purple-100 text-purple-700' :
                          template.category === 'lead_nurturing' ? 'bg-green-100 text-green-700' :
                          template.category === 'closing' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {template.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Subject:</p>
                        <p className="text-sm text-gray-900 italic">"{template.subject_line}"</p>
                      </div>
                      {template.performance && (
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-1">Open:</span>
                            <span>{template.performance.open_rate}%</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-1">Reply:</span>
                            <span className={template.performance.reply_rate >= 25 ? 'text-green-600 font-semibold' : ''}>
                              {template.performance.reply_rate}%
                            </span>
                          </div>
                        </div>
                      )}
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowTemplatePicker(false);
                  setTemplateSearchQuery('');
                }}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Sequence Modal */}
      {showUseSequenceModal && selectedSequenceForUse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Start Campaign</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedSequenceForUse.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowUseSequenceModal(false);
                  setSelectedContacts([]);
                  setContactSearch('');
                  setCampaignName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Campaign Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Sequence Preview */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sequence Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(selectedSequenceForUse.color).bg}`}>
                      {(() => {
                        const Icon = selectedSequenceForUse.icon;
                        return <Icon className={`w-5 h-5 ${getColorClasses(selectedSequenceForUse.color).text}`} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{selectedSequenceForUse.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedSequenceForUse.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      <span>{selectedSequenceForUse.steps} emails</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      <span>{selectedSequenceForUse.persona}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ChartBarIcon className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-green-600 font-semibold">{selectedSequenceForUse.avgReplyRate} reply rate</span>
                    </div>
                  </div>

                  {/* Email Steps Timeline */}
                  {selectedSequenceForUse.emailSteps && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Email Flow</p>
                      <div className="space-y-2">
                        {selectedSequenceForUse.emailSteps.map((step: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3 text-sm">
                            <div className="flex-shrink-0 w-16 text-xs font-medium text-gray-500">
                              Day {step.day}
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-2 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-primary-600">{step.type}</span>
                                <EnvelopeIcon className="w-3 h-3 text-gray-400" />
                              </div>
                              <p className="text-xs text-gray-700 mt-1">{step.subject}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Select Contacts ({selectedContacts.length} selected)
                </h3>

                {/* Search */}
                <div className="mb-4 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Contact List */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedContacts.includes(contact.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => toggleContact(contact.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            <p className="text-xs text-gray-500">{contact.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {selectedContacts.length} {selectedContacts.length === 1 ? 'contact' : 'contacts'} selected
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowUseSequenceModal(false);
                    setSelectedContacts([]);
                    setContactSearch('');
                    setCampaignName('');
                  }}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartCampaign}
                  disabled={selectedContacts.length === 0 || !campaignName.trim()}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                    selectedContacts.length > 0 && campaignName.trim()
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Start Campaign {selectedContacts.length > 0 && `with ${selectedContacts.length}`}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded">Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sequence Details Modal */}
      {showSequenceDetails && selectedSequenceForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(selectedSequenceForView.color).bg}`}>
                  {(() => {
                    const Icon = selectedSequenceForView.icon;
                    return <Icon className={`w-6 h-6 ${getColorClasses(selectedSequenceForView.color).text}`} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSequenceForView.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedSequenceForView.description}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSequenceDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Stats Overview */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{selectedSequenceForView.steps}</p>
                  <p className="text-xs text-blue-600 font-medium">Email Steps</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <ChartBarIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">{selectedSequenceForView.avgReplyRate}</p>
                  <p className="text-xs text-green-600 font-medium">Avg Reply Rate</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <UserGroupIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{selectedSequenceForView.persona}</p>
                  <p className="text-xs text-purple-600 font-medium">Target Persona</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <SparklesIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-900 capitalize">{selectedSequenceForView.category.replace('_', ' ')}</p>
                  <p className="text-xs text-orange-600 font-medium">Category</p>
                </div>
              </div>

              {/* Best For Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Best For</h3>
                <p className="text-gray-700">{selectedSequenceForView.bestFor}</p>
              </div>

              {/* Email Flow Timeline */}
              {selectedSequenceForView.emailSteps && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Email Flow</h3>
                  <div className="space-y-4">
                    {selectedSequenceForView.emailSteps.map((step: any, index: number) => (
                      <div key={index} className="relative pl-8 pb-4 border-l-2 border-gray-300 last:border-l-0 last:pb-0">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary-600 border-4 border-white transform -translate-x-1/2" />

                        <div className="bg-white rounded-lg p-5 border-2 border-gray-200 hover:border-primary-300 transition-all shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                DAY {step.day}
                              </span>
                              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                {step.type}
                              </span>
                            </div>
                            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                          </div>

                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Subject Line:</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                            {step.subject}
                          </p>

                          {/* Mock body preview */}
                          <div className="mt-3">
                            <h4 className="text-xs font-semibold text-gray-600 mb-1">Email Preview:</h4>
                            <p className="text-xs text-gray-500 italic">
                              Personalized content with dynamic fields like company name, pain points, and value propositions...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* If no email steps */}
              {!selectedSequenceForView.emailSteps && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <SparklesIcon className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <p className="text-sm text-yellow-800 font-medium">
                    This sequence template has {selectedSequenceForView.steps} email steps.
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Detailed email flow coming soon for this template.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowSequenceDetails(false)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSequenceDetails(false);
                  handleUseSequence(selectedSequenceForView);
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center space-x-2"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                <span>Use This Sequence</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Sequence Builder Modal */}
      {showVisualBuilder && createPortal(
        <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-black/50 z-50 p-12">
          <div className="bg-white w-full h-full flex flex-col overflow-hidden rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-3 border-b bg-white flex-shrink-0">
              <input
                type="text"
                value={builderSequenceName}
                onChange={(e) => setBuilderSequenceName(e.target.value)}
                className="text-lg font-bold text-gray-900 border-0 focus:ring-0 px-2 py-1 rounded hover:bg-gray-50"
                placeholder="Sequence Name"
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    console.log('Sequence saved');
                    setShowVisualBuilder(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => {
                    setShowVisualBuilder(false);
                    setShowUseSequenceModal(true);
                    setSelectedSequenceForUse({
                      id: 'new',
                      name: builderSequenceName,
                      description: 'New sequence',
                      status: 'draft',
                      color: 'blue',
                      steps: [],
                      stats: { total_contacts: 0, active: 0, completed: 0, replied: 0 },
                      performance: { open_rate: 0, reply_rate: 0, click_rate: 0 },
                      created_at: new Date().toISOString(),
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <RocketLaunchIcon className="w-4 h-4" />
                  <span>Launch Sequence</span>
                </button>
                <button
                  onClick={() => setShowVisualBuilder(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl px-3"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <SequenceBuilder
                sequenceName={builderSequenceName}
                onSave={(steps) => {
                  console.log('Sequence saved:', { steps });
                  setShowVisualBuilder(false);
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Sequences;
