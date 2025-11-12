import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Revenue data
  const revenueData = [
    { month: 'Jan', revenue: 145000, target: 150000, deals: 12 },
    { month: 'Feb', revenue: 168000, target: 160000, deals: 15 },
    { month: 'Mar', revenue: 182000, target: 170000, deals: 18 },
    { month: 'Apr', revenue: 195000, target: 180000, deals: 16 },
    { month: 'May', revenue: 210000, target: 190000, deals: 20 },
    { month: 'Jun', revenue: 225000, target: 200000, deals: 22 },
  ];

  // Email performance data
  const emailData = [
    { week: 'Week 1', sent: 450, opened: 225, clicked: 98, replied: 45 },
    { week: 'Week 2', sent: 520, opened: 268, clicked: 112, replied: 52 },
    { week: 'Week 3', sent: 480, opened: 245, clicked: 105, replied: 48 },
    { week: 'Week 4', sent: 560, opened: 295, clicked: 128, replied: 58 },
  ];

  // Conversion funnel data
  const funnelData = [
    { stage: 'Leads', count: 450, percentage: 100 },
    { stage: 'Qualified', count: 180, percentage: 40 },
    { stage: 'Proposal', count: 90, percentage: 20 },
    { stage: 'Negotiation', count: 45, percentage: 10 },
    { stage: 'Closed Won', count: 27, percentage: 6 },
  ];

  // Deal source data
  const dealSourceData = [
    { name: 'Inbound', value: 35, color: '#3b82f6' },
    { name: 'Referral', value: 28, color: '#10b981' },
    { name: 'Outbound', value: 22, color: '#8b5cf6' },
    { name: 'Partner', value: 15, color: '#f59e0b' },
  ];

  // Activity data
  const activityData = [
    { day: 'Mon', emails: 45, calls: 12, meetings: 8 },
    { day: 'Tue', emails: 52, calls: 15, meetings: 6 },
    { day: 'Wed', emails: 48, calls: 10, meetings: 10 },
    { day: 'Thu', emails: 55, calls: 18, meetings: 7 },
    { day: 'Fri', emails: 50, calls: 14, meetings: 9 },
  ];

  // Top performers data
  const topPerformers = [
    { name: 'Sarah Johnson', deals: 8, revenue: '$125K', conversion: '45%' },
    { name: 'Michael Chen', deals: 7, revenue: '$110K', conversion: '42%' },
    { name: 'Emily Davis', deals: 6, revenue: '$95K', conversion: '38%' },
    { name: 'Alex Thompson', deals: 5, revenue: '$88K', conversion: '35%' },
  ];

  // Calculate totals and metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgDealSize = Math.round(totalRevenue / revenueData.reduce((sum, item) => sum + item.deals, 0));
  const totalEmailsSent = emailData.reduce((sum, item) => sum + item.sent, 0);
  const totalReplies = emailData.reduce((sum, item) => sum + item.replied, 0);
  const replyRate = Math.round((totalReplies / totalEmailsSent) * 100);

  const currentMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const previousMonthRevenue = revenueData[revenueData.length - 2].revenue;
  const revenueGrowth = Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Performance insights and metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(0)}K</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+{revenueGrowth}%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Avg Deal Size</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(avgDealSize / 1000).toFixed(0)}K</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+8%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Email Reply Rate</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{replyRate}%</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+3%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{funnelData[funnelData.length - 1].percentage}%</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-red-600 font-medium">-1%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-sm text-gray-500">Monthly revenue vs target</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`} />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="url(#colorRevenue)"
              strokeWidth={2}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              fill="url(#colorTarget)"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Email Performance</h2>
            <p className="text-sm text-gray-500">Weekly email metrics</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={emailData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} name="Sent" />
              <Line type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={2} name="Opened" />
              <Line type="monotone" dataKey="clicked" stroke="#8b5cf6" strokeWidth={2} name="Clicked" />
              <Line type="monotone" dataKey="replied" stroke="#f59e0b" strokeWidth={2} name="Replied" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deal Sources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Deal Sources</h2>
            <p className="text-sm text-gray-500">Distribution by source</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dealSourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {dealSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Conversion Funnel</h2>
          <p className="text-sm text-gray-500">Lead progression through sales stages</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} stroke="#9ca3af" width={100} />
            <Tooltip formatter={(value: any, _name: any, props: any) => [
              `${value} leads (${props.payload.percentage}%)`,
              'Count'
            ]} />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Tracker and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Tracker */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Activity</h2>
            <p className="text-sm text-gray-500">Outreach activities by day</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="emails" fill="#3b82f6" name="Emails" />
              <Bar dataKey="calls" fill="#10b981" name="Calls" />
              <Bar dataKey="meetings" fill="#8b5cf6" name="Meetings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            <p className="text-sm text-gray-500">Team leaderboard this month</p>
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-500">{performer.deals} deals closed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{performer.revenue}</p>
                  <p className="text-xs text-gray-500">{performer.conversion} conversion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
