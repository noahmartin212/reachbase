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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your email communications</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center">
          <EnvelopeIcon className="w-5 h-5 mr-2" />
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
