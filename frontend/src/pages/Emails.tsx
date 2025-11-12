import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ChatBubbleLeftRightIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  XMarkIcon,
  SparklesIcon,
  LightBulbIcon,
  PlusIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'bounced' | 'failed';
type EmailDirection = 'outbound' | 'inbound';

interface Email {
  id: string;
  direction: EmailDirection;
  contact_name: string;
  contact_email: string;
  contact_company?: string;
  subject: string;
  body_html: string;
  body_plain?: string;
  status: EmailStatus;
  template_name?: string;
  sequence_name?: string;
  sequence_step?: number;
  opened: boolean;
  open_count: number;
  first_opened_at?: string;
  clicked: boolean;
  click_count: number;
  replied: boolean;
  reply_count: number;
  bounced: boolean;
  bounce_reason?: string;
  thread_id?: string;
  sent_at?: string;
  scheduled_at?: string;
  tags: string[];
  aiReplyLikelihood?: number;
  aiBestSendTime?: string;
  aiSubjectScore?: number;
  aiSubjectFeedback?: string;
  aiInsights?: string;
}

interface EmailStats {
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  delivery_rate: string;
  open_rate: string;
  click_rate: string;
  reply_rate: string;
  bounce_rate: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'active' | 'lead' | 'prospect' | 'customer';
  engagement: 'high' | 'medium' | 'low';
  lastContact: string;
  starred: boolean;
  tags: string[];
  aiScore: number;
  aiReasoning: string;
  bestTimeToContact?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject_line: string;
  body_html: string;
  category: string;
  persona: string;
  industry: string;
  tags: string[];
  use_count: number;
  performance?: {
    sends: number;
    open_rate: number;
    reply_rate: number;
  };
}

interface ComposeEmailForm {
  recipients: Contact[];
  template: EmailTemplate | null;
  subject: string;
  body: string;
  sendAt: 'now' | 'schedule';
  scheduledDate: string;
  scheduledTime: string;
  createFollowUpTask: boolean;
  taskDueDate: string;
}

const Emails: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('today');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [engagementFilter, setEngagementFilter] = useState<string>('all');

  // Compose email modal states
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeStep, setComposeStep] = useState<1 | 2 | 3>(1);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<EmailTemplate[]>([]);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [composeForm, setComposeForm] = useState<ComposeEmailForm>({
    recipients: [],
    template: null,
    subject: '',
    body: '',
    sendAt: 'now',
    scheduledDate: '',
    scheduledTime: '',
    createFollowUpTask: false,
    taskDueDate: '',
  });

  // AI scoring states
  const [aiSubjectScore, setAiSubjectScore] = useState<number>(0);
  const [aiSubjectFeedback, setAiSubjectFeedback] = useState<string>('');
  const [aiReplyLikelihood, setAiReplyLikelihood] = useState<number>(0);
  const [aiSuggestedSendTime, setAiSuggestedSendTime] = useState<string>('');

  useEffect(() => {
    fetchEmails();
    fetchStats();
  }, [statusFilter, directionFilter, engagementFilter, searchQuery, timePeriod]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (directionFilter !== 'all') params.append('direction', directionFilter);
      if (engagementFilter === 'opened') params.append('opened', 'true');
      if (engagementFilter === 'clicked') params.append('clicked', 'true');
      if (engagementFilter === 'replied') params.append('replied', 'true');
      if (engagementFilter === 'bounced') params.append('bounced', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`http://localhost:3001/api/emails?${params.toString()}`);
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/emails/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'scheduled':
        return 'bg-purple-100 text-purple-700';
      case 'bounced':
        return 'bg-red-100 text-red-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: EmailStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'sent':
        return <EnvelopeIcon className="w-4 h-4" />;
      case 'scheduled':
        return <ClockIcon className="w-4 h-4" />;
      case 'bounced':
        return <XCircleIcon className="w-4 h-4" />;
      case 'draft':
        return <EnvelopeIcon className="w-4 h-4" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <EnvelopeIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM d, h:mm a');
    } catch {
      return '-';
    }
  };

  const getReplyLikelihoodColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getSubjectScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Compose modal functions
  const openComposeModal = () => {
    setShowComposeModal(true);
    setComposeStep(1);
    // Fetch contacts and templates
    fetchContactsForCompose();
    fetchTemplatesForCompose();
  };

  const closeComposeModal = () => {
    setShowComposeModal(false);
    setComposeStep(1);
    setComposeForm({
      recipients: [],
      template: null,
      subject: '',
      body: '',
      sendAt: 'now',
      scheduledDate: '',
      scheduledTime: '',
      createFollowUpTask: false,
      taskDueDate: '',
    });
    setContactSearchQuery('');
    setTemplateSearchQuery('');
    setAiSubjectScore(0);
    setAiSubjectFeedback('');
    setAiReplyLikelihood(0);
    setAiSuggestedSendTime('');
  };

  const fetchContactsForCompose = async () => {
    try {
      // Mock contacts data for now
      const mockContacts: Contact[] = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@enterprisecorp.com',
          phone: '+1 (555) 123-4567',
          company: 'Enterprise Corp',
          title: 'VP of Sales',
          status: 'customer',
          engagement: 'high',
          lastContact: '2 hours ago',
          starred: true,
          tags: ['high-value', 'decision-maker'],
          aiScore: 95,
          aiReasoning: 'Highly engaged customer with decision-making authority.',
          bestTimeToContact: 'Tue-Thu, 2-4 PM',
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@acmeinc.com',
          phone: '+1 (555) 234-5678',
          company: 'Acme Inc',
          title: 'Director of Marketing',
          status: 'prospect',
          engagement: 'high',
          lastContact: '1 day ago',
          starred: true,
          tags: ['proposal-sent'],
          aiScore: 88,
          aiReasoning: 'Proposal sent with strong engagement.',
          bestTimeToContact: 'Mon-Wed, 10 AM-12 PM',
        },
        {
          id: 3,
          name: 'Sarah Johnson',
          email: 'sarah.j@techstart.io',
          phone: '+1 (555) 345-6789',
          company: 'TechStart',
          title: 'CEO',
          status: 'lead',
          engagement: 'medium',
          lastContact: '3 days ago',
          starred: false,
          tags: ['demo-scheduled'],
          aiScore: 72,
          aiReasoning: 'Demo scheduled indicates interest.',
          bestTimeToContact: 'Wed-Fri, 8-10 AM',
        },
      ];
      setAvailableContacts(mockContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchTemplatesForCompose = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/templates');
      const data = await response.json();
      setAvailableTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const toggleRecipient = (contact: Contact) => {
    const isSelected = composeForm.recipients.find(r => r.id === contact.id);
    if (isSelected) {
      setComposeForm({
        ...composeForm,
        recipients: composeForm.recipients.filter(r => r.id !== contact.id),
      });
    } else {
      setComposeForm({
        ...composeForm,
        recipients: [...composeForm.recipients, contact],
      });
    }
  };

  const selectTemplate = (template: EmailTemplate) => {
    // Replace HTML tags with plain text for body
    const plainBody = template.body_html.replace(/<[^>]*>/g, '');

    setComposeForm({
      ...composeForm,
      template,
      subject: template.subject_line,
      body: plainBody,
    });
    setShowTemplatePicker(false);
    setTemplateSearchQuery('');

    // Calculate AI score for template subject
    calculateAiSubjectScore(template.subject_line);
  };

  const replaceVariables = (text: string, contact: Contact): string => {
    return text
      .replace(/\{\{firstName\}\}/g, contact.name.split(' ')[0])
      .replace(/\{\{lastName\}\}/g, contact.name.split(' ')[1] || '')
      .replace(/\{\{name\}\}/g, contact.name)
      .replace(/\{\{companyName\}\}/g, contact.company)
      .replace(/\{\{jobTitle\}\}/g, contact.title)
      .replace(/\{\{email\}\}/g, contact.email);
  };

  const calculateAiSubjectScore = (subject: string) => {
    // Mock AI scoring based on subject line characteristics
    let score = 50;
    let feedback = '';

    // Length check
    if (subject.length >= 20 && subject.length <= 50) {
      score += 15;
    } else {
      feedback += 'Consider keeping subject line between 20-50 characters. ';
    }

    // Personalization check
    if (subject.includes('{{') || subject.toLowerCase().includes('your')) {
      score += 15;
      feedback += 'Great use of personalization! ';
    } else {
      feedback += 'Add personalization for better engagement. ';
    }

    // Question check
    if (subject.includes('?')) {
      score += 10;
      feedback += 'Questions can increase open rates. ';
    }

    // Urgency/Action words
    const actionWords = ['quick', 'today', 'now', 'limited', 'exclusive'];
    if (actionWords.some(word => subject.toLowerCase().includes(word))) {
      score += 10;
    }

    setAiSubjectScore(Math.min(score, 100));
    setAiSubjectFeedback(feedback.trim());
  };

  const calculateAiReplyLikelihood = () => {
    // Mock AI reply likelihood based on recipients and content
    let likelihood = 50;

    // High engagement contacts boost likelihood
    const avgAiScore = composeForm.recipients.reduce((sum, r) => sum + r.aiScore, 0) / composeForm.recipients.length;
    likelihood += (avgAiScore - 50) / 2;

    // Subject score affects likelihood
    likelihood += (aiSubjectScore - 50) / 5;

    // Body length check
    if (composeForm.body.length >= 100 && composeForm.body.length <= 500) {
      likelihood += 10;
    }

    // Personalization in body
    if (composeForm.body.includes('{{')) {
      likelihood += 5;
    }

    setAiReplyLikelihood(Math.min(Math.max(Math.round(likelihood), 0), 100));
  };

  const suggestBestSendTime = () => {
    if (composeForm.recipients.length === 0) return;

    // Use the best time from the first recipient (in real app, would analyze all)
    const bestTime = composeForm.recipients[0].bestTimeToContact || 'Tue-Thu, 2-4 PM';
    setAiSuggestedSendTime(bestTime);
  };

  const handleNextStep = () => {
    if (composeStep === 1 && composeForm.recipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }
    if (composeStep === 2) {
      if (!composeForm.subject || !composeForm.body) {
        alert('Please enter subject and body');
        return;
      }
      // Calculate AI insights before moving to step 3
      calculateAiReplyLikelihood();
      suggestBestSendTime();
    }
    setComposeStep((composeStep + 1) as 1 | 2 | 3);
  };

  const handlePrevStep = () => {
    setComposeStep((composeStep - 1) as 1 | 2 | 3);
  };

  const handleSendEmail = async () => {
    try {
      // Mock send email API call
      console.log('Sending email:', composeForm);

      // In real app, would call API for each recipient
      for (const recipient of composeForm.recipients) {
        const personalizedSubject = replaceVariables(composeForm.subject, recipient);
        const personalizedBody = replaceVariables(composeForm.body, recipient);

        const emailData = {
          to: recipient.email,
          subject: personalizedSubject,
          body: personalizedBody,
          scheduled_at: composeForm.sendAt === 'schedule'
            ? `${composeForm.scheduledDate}T${composeForm.scheduledTime}`
            : null,
          template_id: composeForm.template?.id,
        };

        console.log('Email data for', recipient.name, ':', emailData);
      }

      alert(`Email ${composeForm.sendAt === 'schedule' ? 'scheduled' : 'sent'} successfully to ${composeForm.recipients.length} recipient(s)!`);
      closeComposeModal();
      fetchEmails(); // Refresh email list
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  const filteredTemplates = availableTemplates.filter(template =>
    template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(templateSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your email communications</p>
        </div>
        <button
          onClick={openComposeModal}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Compose Email
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div>
          {/* Time Period Selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Email Performance</h2>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setTimePeriod('today')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timePeriod === 'today'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimePeriod('week')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timePeriod === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimePeriod('month')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timePeriod === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Sent</p>
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total_sent}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.delivery_rate}% delivered</p>
            </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Opened</p>
              <EnvelopeOpenIcon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_opened}</p>
            <p className="text-xs text-blue-600 mt-1">{stats.open_rate}% open rate</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Clicked</p>
              <CursorArrowRaysIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_clicked}</p>
            <p className="text-xs text-green-600 mt-1">{stats.click_rate}% click rate</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Replied</p>
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_replied}</p>
            <p className="text-xs text-purple-600 mt-1">{stats.reply_rate}% reply rate</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Bounced</p>
              <XCircleIcon className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_bounced}</p>
            <p className="text-xs text-red-600 mt-1">{stats.bounce_rate}% bounce rate</p>
          </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails by contact, subject, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg font-medium flex items-center justify-center ${
              showFilters
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
            <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="delivered">Delivered</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="bounced">Bounced</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
              <select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Emails</option>
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engagement</label>
              <select
                value={engagementFilter}
                onChange={(e) => setEngagementFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Engagement</option>
                <option value="opened">Opened</option>
                <option value="clicked">Clicked</option>
                <option value="replied">Replied</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <ArrowPathIcon className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No emails found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>Contact</span>
                      <div className="group relative">
                        <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs cursor-help">
                          ?
                        </div>
                        <div className="absolute left-0 top-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          → Outbound (you sent) | ← Inbound (you received)
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-1" />
                      AI Intelligence
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => (
                  <tr
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          email.direction === 'inbound' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {email.direction === 'inbound' ? '←' : '→'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{email.contact_name}</p>
                          <p className="text-xs text-gray-500">{email.contact_email}</p>
                          {email.contact_company && (
                            <p className="text-xs text-gray-400">{email.contact_company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{email.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {email.body_plain?.substring(0, 100)}...
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                        {getStatusIcon(email.status)}
                        <span className="ml-1.5 capitalize">{email.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {email.direction === 'outbound' && email.aiReplyLikelihood !== undefined ? (
                        <div className="space-y-1.5">
                          <div className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getReplyLikelihoodColor(email.aiReplyLikelihood)}`}>
                            {email.aiReplyLikelihood}% reply likelihood
                          </div>
                          {email.aiSubjectScore !== undefined && (
                            <div className="flex items-center text-xs">
                              <LightBulbIcon className={`w-3.5 h-3.5 mr-1 ${getSubjectScoreColor(email.aiSubjectScore)}`} />
                              <span className={getSubjectScoreColor(email.aiSubjectScore)}>
                                Subject: {email.aiSubjectScore}/100
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {email.opened && (
                          <div className="flex items-center text-xs text-blue-600">
                            <EnvelopeOpenIcon className="w-4 h-4 mr-1" />
                            <span>{email.open_count}</span>
                          </div>
                        )}
                        {email.clicked && (
                          <div className="flex items-center text-xs text-green-600">
                            <CursorArrowRaysIcon className="w-4 h-4 mr-1" />
                            <span>{email.click_count}</span>
                          </div>
                        )}
                        {email.replied && (
                          <div className="flex items-center text-xs text-purple-600">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                            <span>{email.reply_count}</span>
                          </div>
                        )}
                        {email.bounced && (
                          <div className="flex items-center text-xs text-red-600">
                            <XCircleIcon className="w-4 h-4 mr-1" />
                          </div>
                        )}
                        {!email.opened && !email.clicked && !email.replied && !email.bounced && (
                          <span className="text-xs text-gray-400">No engagement</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {email.sequence_name ? (
                        <div>
                          <p className="text-xs font-medium text-gray-900">{email.sequence_name}</p>
                          <p className="text-xs text-gray-500">Step {email.sequence_step}</p>
                        </div>
                      ) : email.template_name ? (
                        <p className="text-xs text-gray-500">{email.template_name}</p>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs text-gray-900">{formatDate(email.sent_at || email.scheduled_at)}</p>
                      {email.first_opened_at && (
                        <p className="text-xs text-gray-500">Opened: {formatDate(email.first_opened_at)}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compose Email Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Compose Email</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Step {composeStep} of 3: {composeStep === 1 ? 'Select Recipients' : composeStep === 2 ? 'Compose Message' : 'Review & Send'}
                </p>
              </div>
              <button
                onClick={closeComposeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${composeStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>Recipients</span>
                <span className={`text-xs font-medium ${composeStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>Compose</span>
                <span className={`text-xs font-medium ${composeStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>Review</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(composeStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
              {/* Step 1: Select Recipients */}
              {composeStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Recipients</label>
                    <div className="relative mb-4">
                      <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={contactSearchQuery}
                        onChange={(e) => setContactSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {composeForm.recipients.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {composeForm.recipients.map(contact => (
                          <div key={contact.id} className="flex items-center bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                            <span>{contact.name}</span>
                            <button
                              onClick={() => toggleRecipient(contact)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                      {filteredContacts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <UserCircleIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>No contacts found</p>
                        </div>
                      ) : (
                        filteredContacts.map(contact => {
                          const isSelected = composeForm.recipients.find(r => r.id === contact.id);
                          return (
                            <div
                              key={contact.id}
                              onClick={() => toggleRecipient(contact)}
                              className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                                isSelected ? 'bg-primary-50' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                    <p className="text-xs text-gray-500">{contact.email}</p>
                                    <p className="text-xs text-gray-400">{contact.company} - {contact.title}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      contact.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                                      contact.aiScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      <SparklesIcon className="w-3 h-3 mr-1" />
                                      {contact.aiScore}
                                    </div>
                                    {contact.bestTimeToContact && (
                                      <p className="text-xs text-gray-500 mt-1">Best: {contact.bestTimeToContact}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Compose Message */}
              {composeStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <button
                        onClick={() => setShowTemplatePicker(true)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        <DocumentTextIcon className="w-4 h-4 mr-1" />
                        Use Template
                      </button>
                    </div>

                    {composeForm.template && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">{composeForm.template.name}</p>
                            <p className="text-xs text-blue-600">{composeForm.template.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setComposeForm({ ...composeForm, template: null })}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={composeForm.subject}
                        onChange={(e) => {
                          setComposeForm({ ...composeForm, subject: e.target.value });
                          calculateAiSubjectScore(e.target.value);
                        }}
                        placeholder="Enter email subject..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {aiSubjectScore > 0 && (
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <SparklesIcon className={`w-4 h-4 mr-1 ${getSubjectScoreColor(aiSubjectScore)}`} />
                            <span className={`text-xs font-medium ${getSubjectScoreColor(aiSubjectScore)}`}>
                              Subject Score: {aiSubjectScore}/100
                            </span>
                          </div>
                          {aiSubjectFeedback && (
                            <p className="text-xs text-gray-600">{aiSubjectFeedback}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Body</label>
                      <textarea
                        value={composeForm.body}
                        onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                        placeholder="Enter email body... Use {{firstName}}, {{companyName}}, {{jobTitle}} for personalization"
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Available variables: {'{'}firstName{'}'}, {'{'}lastName{'}'}, {'{'}name{'}'}, {'{'}companyName{'}'}, {'{'}jobTitle{'}'}, {'{'}email{'}'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Send */}
              {composeStep === 3 && (
                <div className="space-y-6">
                  {/* AI Insights */}
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-600 rounded-lg flex-shrink-0">
                        <SparklesIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Intelligence</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-gray-600">Reply Likelihood:</span>
                            <div className={`mt-1 inline-flex items-center px-2.5 py-1 rounded-full border text-sm font-semibold ${getReplyLikelihoodColor(aiReplyLikelihood)}`}>
                              {aiReplyLikelihood}%
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Subject Score:</span>
                            <div className="mt-1">
                              <span className={`text-sm font-semibold ${getSubjectScoreColor(aiSubjectScore)}`}>
                                {aiSubjectScore}/100
                              </span>
                            </div>
                          </div>
                          {aiSuggestedSendTime && (
                            <div className="col-span-2">
                              <span className="text-xs text-gray-600">Optimal Send Time:</span>
                              <div className="mt-1 flex items-center">
                                <ClockIcon className="w-4 h-4 text-primary-600 mr-1" />
                                <span className="text-sm font-medium text-primary-700">{aiSuggestedSendTime}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview for first recipient */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Preview (for {composeForm.recipients[0].name})</h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="mb-3 pb-3 border-b border-gray-300">
                        <p className="text-xs text-gray-500 mb-1">To:</p>
                        <p className="text-sm font-medium text-gray-900">{composeForm.recipients.map(r => r.name).join(', ')}</p>
                      </div>
                      <div className="mb-3 pb-3 border-b border-gray-300">
                        <p className="text-xs text-gray-500 mb-1">Subject:</p>
                        <p className="text-sm font-medium text-gray-900">
                          {replaceVariables(composeForm.subject, composeForm.recipients[0])}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Body:</p>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {replaceVariables(composeForm.body, composeForm.recipients[0])}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Send Options */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Send Options</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={composeForm.sendAt === 'now'}
                            onChange={() => setComposeForm({ ...composeForm, sendAt: 'now' })}
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Send immediately</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={composeForm.sendAt === 'schedule'}
                            onChange={() => setComposeForm({ ...composeForm, sendAt: 'schedule' })}
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Schedule for later</span>
                        </label>
                      </div>
                    </div>

                    {composeForm.sendAt === 'schedule' && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={composeForm.scheduledDate}
                            onChange={(e) => setComposeForm({ ...composeForm, scheduledDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                          <input
                            type="time"
                            value={composeForm.scheduledTime}
                            onChange={(e) => setComposeForm({ ...composeForm, scheduledTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={composeForm.createFollowUpTask}
                          onChange={(e) => setComposeForm({ ...composeForm, createFollowUpTask: e.target.checked })}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Create follow-up task</span>
                      </label>
                    </div>

                    {composeForm.createFollowUpTask && (
                      <div className="ml-6">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Follow-up due date</label>
                        <input
                          type="date"
                          value={composeForm.taskDueDate}
                          onChange={(e) => setComposeForm({ ...composeForm, taskDueDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeComposeModal}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-3">
                {composeStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Back
                  </button>
                )}
                {composeStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSendEmail}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    {composeForm.sendAt === 'schedule' ? 'Schedule Email' : 'Send Email'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Choose Template</h3>
              <button
                onClick={() => setShowTemplatePicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No templates found</p>
                  </div>
                ) : (
                  filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => selectTemplate(template)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {template.category}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Subject:</p>
                        <p className="text-xs text-gray-700">{template.subject_line}</p>
                      </div>
                      {template.performance && (
                        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
                          <span>Opens: {template.performance.open_rate}%</span>
                          <span>Replies: {template.performance.reply_rate}%</span>
                          <span>Uses: {template.use_count}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEmail.status)}`}>
                    {getStatusIcon(selectedEmail.status)}
                    <span className="ml-1.5 capitalize">{selectedEmail.status}</span>
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedEmail.direction === 'inbound' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedEmail.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedEmail.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{selectedEmail.contact_name}</p>
                    <p className="text-xs text-gray-600">{selectedEmail.contact_email}</p>
                    {selectedEmail.contact_company && (
                      <p className="text-xs text-gray-600">{selectedEmail.contact_company}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Sent</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedEmail.sent_at)}</p>
                    {selectedEmail.sequence_name && (
                      <>
                        <p className="text-xs font-medium text-gray-500 mt-2">Campaign</p>
                        <p className="text-sm text-gray-900">{selectedEmail.sequence_name}</p>
                        <p className="text-xs text-gray-600">Step {selectedEmail.sequence_step}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              {selectedEmail.direction === 'outbound' && (selectedEmail.aiReplyLikelihood !== undefined || selectedEmail.aiInsights) && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary-600 rounded-lg flex-shrink-0">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">AI Intelligence</h3>
                      <div className="space-y-2">
                        {selectedEmail.aiReplyLikelihood !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Reply Likelihood:</span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-sm font-semibold ${getReplyLikelihoodColor(selectedEmail.aiReplyLikelihood)}`}>
                              {selectedEmail.aiReplyLikelihood}%
                            </span>
                          </div>
                        )}
                        {selectedEmail.aiBestSendTime && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Optimal Send Time:</span>
                            <span className="text-sm font-medium text-primary-700">{selectedEmail.aiBestSendTime}</span>
                          </div>
                        )}
                        {selectedEmail.aiSubjectScore !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Subject Line Score:</span>
                            <span className={`text-sm font-semibold ${getSubjectScoreColor(selectedEmail.aiSubjectScore)}`}>
                              {selectedEmail.aiSubjectScore}/100
                            </span>
                          </div>
                        )}
                        {selectedEmail.aiSubjectFeedback && (
                          <div className="mt-2 pt-2 border-t border-primary-200">
                            <p className="text-xs text-gray-700">
                              <LightBulbIcon className="w-4 h-4 inline mr-1 text-primary-600" />
                              {selectedEmail.aiSubjectFeedback}
                            </p>
                          </div>
                        )}
                        {selectedEmail.aiInsights && (
                          <div className="mt-2 pt-2 border-t border-primary-200">
                            <p className="text-xs text-gray-700">{selectedEmail.aiInsights}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Engagement Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <EnvelopeOpenIcon className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg font-bold text-blue-900">{selectedEmail.open_count}</p>
                  <p className="text-xs text-blue-700">Opens</p>
                  {selectedEmail.first_opened_at && (
                    <p className="text-xs text-blue-600 mt-1">{formatDate(selectedEmail.first_opened_at)}</p>
                  )}
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <CursorArrowRaysIcon className="w-6 h-6 mx-auto text-green-600 mb-1" />
                  <p className="text-lg font-bold text-green-900">{selectedEmail.click_count}</p>
                  <p className="text-xs text-green-700">Clicks</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-lg font-bold text-purple-900">{selectedEmail.reply_count}</p>
                  <p className="text-xs text-purple-700">Replies</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${selectedEmail.bounced ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <XCircleIcon className={`w-6 h-6 mx-auto mb-1 ${selectedEmail.bounced ? 'text-red-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-bold ${selectedEmail.bounced ? 'text-red-900' : 'text-gray-400'}`}>
                    {selectedEmail.bounced ? 'Yes' : 'No'}
                  </p>
                  <p className={`text-xs ${selectedEmail.bounced ? 'text-red-700' : 'text-gray-500'}`}>Bounced</p>
                </div>
              </div>

              {/* Email Body */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }}
                />
              </div>

              {/* Tags */}
              {selectedEmail.tags.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-medium text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emails;
