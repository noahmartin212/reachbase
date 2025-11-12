import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

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

const Contacts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [engagementFilter, setEngagementFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showHotLeadsOnly, setShowHotLeadsOnly] = useState(false);

  // Mock data
  const contacts: Contact[] = [
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
      aiReasoning: 'Highly engaged customer with decision-making authority. Recent activity shows strong buying signals.',
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
      aiReasoning: 'Proposal sent with strong engagement. High likelihood of conversion within next 7 days.',
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
      aiReasoning: 'Demo scheduled indicates interest. CEO-level contact is valuable but engagement needs nurturing.',
      bestTimeToContact: 'Wed-Fri, 8-10 AM',
    },
    {
      id: 4,
      name: 'Michael Brown',
      email: 'mbrown@globaltech.com',
      phone: '+1 (555) 456-7890',
      company: 'Global Tech',
      title: 'CTO',
      status: 'active',
      engagement: 'medium',
      lastContact: '5 days ago',
      starred: false,
      tags: ['technical'],
      aiScore: 65,
      aiReasoning: 'Technical contact with moderate engagement. Consider sending technical content to re-engage.',
      bestTimeToContact: 'Mon, Wed, 3-5 PM',
    },
    {
      id: 5,
      name: 'Emily Davis',
      email: 'emily.d@innovate.co',
      phone: '+1 (555) 567-8901',
      company: 'Innovate Co',
      title: 'Product Manager',
      status: 'lead',
      engagement: 'low',
      lastContact: '2 weeks ago',
      starred: false,
      tags: ['cold'],
      aiScore: 42,
      aiReasoning: 'Low engagement and long time since last contact. May need re-qualification or different approach.',
      bestTimeToContact: 'Tue, Thu, 11 AM-1 PM',
    },
  ];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesEngagement = engagementFilter === 'all' || contact.engagement === engagementFilter;
    const matchesHotLeads = !showHotLeadsOnly || contact.aiScore >= 80;
    return matchesSearch && matchesStatus && matchesEngagement && matchesHotLeads;
  });

  const hotLeadsCount = contacts.filter(c => c.aiScore >= 80).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'prospect':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'lead':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'active':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'bg-primary-600 text-white';
    if (score >= 70) return 'bg-primary-100 text-primary-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-500">{filteredContacts.length} total contacts</p>
            {hotLeadsCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                <FireIcon className="w-3.5 h-3.5" />
                {hotLeadsCount} hot {hotLeadsCount === 1 ? 'lead' : 'leads'}
              </div>
            )}
          </div>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Hot Leads Toggle */}
          <button
            onClick={() => setShowHotLeadsOnly(!showHotLeadsOnly)}
            className={`px-4 py-2 border rounded-lg flex items-center flex-shrink-0 ${
              showHotLeadsOnly ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FireIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            Hot Leads
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center flex-shrink-0 ${
              showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            Filters
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="customer">Customer</option>
                <option value="prospect">Prospect</option>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engagement</label>
              <select
                value={engagementFilter}
                onChange={(e) => setEngagementFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Engagement Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">

                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    AI Score
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-yellow-500">
                      {contact.starred ? (
                        <StarIconSolid className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-xs text-gray-500">{contact.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-2" />
                      {contact.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                        {contact.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(contact.status)}`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        contact.engagement === 'high' ? 'bg-green-500' :
                        contact.engagement === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${getEngagementColor(contact.engagement)}`}>
                        {contact.engagement.charAt(0).toUpperCase() + contact.engagement.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-sm font-bold w-fit ${getAIScoreColor(contact.aiScore)}`}>
                        {contact.aiScore}
                      </div>
                      {contact.aiScore >= 80 && (
                        <div className="group relative">
                          <div className="flex items-center text-xs text-primary-600 cursor-help">
                            <SparklesIcon className="w-3.5 h-3.5 mr-1" />
                            View insights
                          </div>
                          <div className="hidden group-hover:block absolute z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -left-2 top-6">
                            <div className="font-semibold mb-1">AI Insights</div>
                            <p className="mb-2">{contact.aiReasoning}</p>
                            {contact.bestTimeToContact && (
                              <div className="text-primary-300 font-medium">
                                Best time: {contact.bestTimeToContact}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.lastContact}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button className="text-primary-600 hover:text-primary-900 inline-flex items-center">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 inline-flex items-center">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
