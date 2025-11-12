import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  GlobeAltIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Account {
  id: number;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  status: 'prospect' | 'customer' | 'partner' | 'churned';
  health: 'excellent' | 'good' | 'at-risk' | 'critical';
  revenue: string;
  contacts: number;
  lastActivity: string;
  starred: boolean;
  tags: string[];
}

const Accounts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const accounts: Account[] = [
    {
      id: 1,
      name: 'Enterprise Corp',
      industry: 'Technology',
      size: '1000-5000',
      location: 'San Francisco, CA',
      website: 'enterprisecorp.com',
      status: 'customer',
      health: 'excellent',
      revenue: '$450K',
      contacts: 8,
      lastActivity: '2 hours ago',
      starred: true,
      tags: ['enterprise', 'high-value'],
    },
    {
      id: 2,
      name: 'Acme Inc',
      industry: 'Manufacturing',
      size: '500-1000',
      location: 'Chicago, IL',
      website: 'acmeinc.com',
      status: 'prospect',
      health: 'good',
      revenue: '$125K',
      contacts: 3,
      lastActivity: '1 day ago',
      starred: true,
      tags: ['proposal-sent'],
    },
    {
      id: 3,
      name: 'TechStart',
      industry: 'Technology',
      size: '50-200',
      location: 'Austin, TX',
      website: 'techstart.io',
      status: 'prospect',
      health: 'good',
      revenue: '$75K',
      contacts: 5,
      lastActivity: '3 days ago',
      starred: false,
      tags: ['startup', 'demo-scheduled'],
    },
    {
      id: 4,
      name: 'Global Tech Solutions',
      industry: 'Consulting',
      size: '5000+',
      location: 'New York, NY',
      website: 'globaltech.com',
      status: 'customer',
      health: 'at-risk',
      revenue: '$890K',
      contacts: 12,
      lastActivity: '1 week ago',
      starred: false,
      tags: ['enterprise', 'renewal-due'],
    },
    {
      id: 5,
      name: 'Innovate Co',
      industry: 'Healthcare',
      size: '200-500',
      location: 'Boston, MA',
      website: 'innovate.co',
      status: 'partner',
      health: 'excellent',
      revenue: '$320K',
      contacts: 6,
      lastActivity: '4 days ago',
      starred: false,
      tags: ['partner', 'integration'],
    },
    {
      id: 6,
      name: 'Legacy Systems Inc',
      industry: 'Finance',
      size: '1000-5000',
      location: 'Boston, MA',
      website: 'legacysystems.com',
      status: 'churned',
      health: 'critical',
      revenue: '$0',
      contacts: 2,
      lastActivity: '3 months ago',
      starred: false,
      tags: ['churned', 'competitor'],
    },
  ];

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    const matchesHealth = healthFilter === 'all' || account.health === healthFilter;
    return matchesSearch && matchesStatus && matchesHealth;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'prospect':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'partner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'churned':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthTextColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'at-risk':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate summary stats
  const totalRevenue = accounts
    .filter((a) => a.status !== 'churned')
    .reduce((sum, a) => sum + parseInt(a.revenue.replace(/[$K,]/g, '')), 0);
  const activeCustomers = accounts.filter((a) => a.status === 'customer').length;
  const activeProspects = accounts.filter((a) => a.status === 'prospect').length;
  const atRiskAccounts = accounts.filter((a) => a.health === 'at-risk' || a.health === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredAccounts.length} total accounts</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Account
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue}K</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Prospects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeProspects}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">At Risk</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{atRiskAccounts}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

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
                <option value="partner">Partner</option>
                <option value="churned">Churned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health</label>
              <select
                value={healthFilter}
                onChange={(e) => setHealthFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Health Levels</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="at-risk">At Risk</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacts
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-yellow-500">
                      {account.starred ? (
                        <StarIconSolid className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <GlobeAltIcon className="w-3 h-3 mr-1" />
                          {account.website}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{account.industry}</div>
                    <div className="text-xs text-gray-500">{account.size} employees</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                      {account.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(account.status)}`}>
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getHealthColor(account.health)}`}></div>
                      <span className={`text-sm font-medium ${getHealthTextColor(account.health)}`}>
                        {account.health.charAt(0).toUpperCase() + account.health.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-1" />
                      {account.revenue}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <UserGroupIcon className="w-4 h-4 text-gray-400 mr-1" />
                      {account.contacts}
                    </div>
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

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
