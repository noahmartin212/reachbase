import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('week');
  const [emailPeriod, setEmailPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  // Sales-focused stats - dynamic based on time period
  const getStatsForPeriod = (period: 'today' | 'week' | 'month') => {
    switch(period) {
      case 'today':
        return [
          {
            name: 'Active Contacts',
            value: '156',
            change: '+8',
            changeType: 'positive' as const,
            trend: 'Growing contact base',
            subtitle: '8 added today'
          },
          {
            name: 'Emails Sent',
            value: '456',
            change: '+15%',
            changeType: 'positive' as const,
            trend: 'High outreach volume',
            subtitle: '456 sent today'
          },
          {
            name: 'Reply Rate',
            value: '16.2%',
            change: '-1.5%',
            changeType: 'negative' as const,
            trend: 'Needs improvement',
            subtitle: 'Avg response time: 1.8 days'
          },
          {
            name: 'Active Sequences',
            value: '12',
            change: '+2',
            changeType: 'positive' as const,
            trend: 'Running campaigns',
            subtitle: '67 contacts enrolled'
          },
        ];
      case 'week':
        return [
          {
            name: 'Active Contacts',
            value: '1,234',
            change: '+12%',
            changeType: 'positive' as const,
            trend: 'Growing contact base',
            subtitle: '89 added this week'
          },
          {
            name: 'Emails Sent',
            value: '3,456',
            change: '+23%',
            changeType: 'positive' as const,
            trend: 'High outreach volume',
            subtitle: '456 sent today'
          },
          {
            name: 'Reply Rate',
            value: '18.7%',
            change: '-2.3%',
            changeType: 'negative' as const,
            trend: 'Needs improvement',
            subtitle: 'Avg response time: 2.4 days'
          },
          {
            name: 'Active Sequences',
            value: '12',
            change: '+3',
            changeType: 'positive' as const,
            trend: 'Running campaigns',
            subtitle: '456 contacts enrolled'
          },
        ];
      case 'month':
        return [
          {
            name: 'Active Contacts',
            value: '5,678',
            change: '+34%',
            changeType: 'positive' as const,
            trend: 'Strong growth',
            subtitle: '342 added this month'
          },
          {
            name: 'Emails Sent',
            value: '12,345',
            change: '+45%',
            changeType: 'positive' as const,
            trend: 'Record outreach volume',
            subtitle: '456 sent today'
          },
          {
            name: 'Reply Rate',
            value: '21.4%',
            change: '+3.7%',
            changeType: 'positive' as const,
            trend: 'Excellent performance',
            subtitle: 'Avg response time: 3.1 days'
          },
          {
            name: 'Active Sequences',
            value: '18',
            change: '+6',
            changeType: 'positive' as const,
            trend: 'Expanding campaigns',
            subtitle: '1,234 contacts enrolled'
          },
        ];
    }
  };

  const stats = getStatsForPeriod(timePeriod);

  // Email performance over time (sales-relevant)
  const emailPerformanceData = [
    { day: 'Mon', sent: 89, opened: 38, replied: 12 },
    { day: 'Tue', sent: 95, opened: 42, replied: 15 },
    { day: 'Wed', sent: 102, opened: 45, replied: 18 },
    { day: 'Thu', sent: 87, opened: 39, replied: 14 },
    { day: 'Fri', sent: 112, opened: 51, replied: 21 },
    { day: 'Sat', sent: 45, opened: 18, replied: 7 },
    { day: 'Sun', sent: 32, opened: 12, replied: 4 },
  ];

  // Pipeline/Deal stages
  const pipelineData = [
    { stage: 'Prospecting', count: 145, value: '$234K' },
    { stage: 'Qualified', count: 89, value: '$456K' },
    { stage: 'Meeting', count: 56, value: '$678K' },
    { stage: 'Proposal', count: 34, value: '$890K' },
    { stage: 'Negotiation', count: 23, value: '$567K' },
    { stage: 'Closed Won', count: 12, value: '$234K' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
            New Sequence
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <span className={`text-sm font-medium flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                {stat.trend}
              </p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Email Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Email Performance</h2>
              <p className="text-sm text-gray-500">Track your outreach effectiveness over time</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEmailPeriod('week')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  emailPeriod === 'week'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setEmailPeriod('month')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  emailPeriod === 'month'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setEmailPeriod('quarter')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  emailPeriod === 'quarter'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                This Quarter
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emailPerformanceData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorSent)"
                  name="Sent"
                />
                <Area
                  type="monotone"
                  dataKey="opened"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorOpened)"
                  name="Opened"
                />
                <Area
                  type="monotone"
                  dataKey="replied"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorReplied)"
                  name="Replied"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all deals
              </button>
            </div>
            <div className="space-y-3">
              {pipelineData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-orange-500' :
                      index === 4 ? 'bg-red-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stage.stage}</p>
                      <p className="text-xs text-gray-500">{stage.count} deals</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stage.value}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Pipeline Value</span>
                <span className="text-lg font-bold text-gray-900">$3.1M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Sequences */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Sequences</h2>
            <div className="space-y-4">
              {[
                { name: 'Q4 Enterprise Outreach', contacts: 125, sent: 458, opened: 245, replied: 56, replyRate: '12.2%' },
                { name: 'Product Demo Follow-up', contacts: 89, sent: 267, opened: 189, replied: 48, replyRate: '18.0%' },
                { name: 'Cold Outreach - Tech', contacts: 156, sent: 623, opened: 312, replied: 71, replyRate: '11.4%' },
              ].map((sequence, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{sequence.name}</h3>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${
                      parseFloat(sequence.replyRate) > 15 ? 'bg-green-100 text-green-700' :
                      parseFloat(sequence.replyRate) > 10 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {sequence.replyRate}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Contacts</p>
                      <p className="font-semibold text-gray-900">{sequence.contacts}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Sent</p>
                      <p className="font-semibold text-gray-900">{sequence.sent}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Opened</p>
                      <p className="font-semibold text-gray-900">{sequence.opened}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Replied</p>
                      <p className="font-semibold text-green-600">{sequence.replied}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { type: 'reply', action: 'John Doe replied to "Q4 Enterprise Outreach"', time: '5 minutes ago', status: 'positive' },
                { type: 'email', action: 'Sent 12 emails in "Product Demo Follow-up"', time: '1 hour ago', status: 'neutral' },
                { type: 'meeting', action: 'Meeting scheduled with Sarah Johnson', time: '2 hours ago', status: 'positive' },
                { type: 'contact', action: 'Added 8 new contacts to "Cold Outreach - Tech"', time: '3 hours ago', status: 'neutral' },
                { type: 'bounce', action: 'Email bounced: invalid@example.com', time: '4 hours ago', status: 'negative' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'positive' ? 'bg-green-500' :
                    activity.status === 'negative' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {[
                { task: 'Follow up with Enterprise Corp', due: 'Today, 2:00 PM', priority: 'high', contact: 'John Smith' },
                { task: 'Send proposal to Acme Inc', due: 'Today, 4:30 PM', priority: 'high', contact: 'Jane Doe' },
                { task: 'Review sequence performance', due: 'Tomorrow, 10:00 AM', priority: 'medium', contact: null },
                { task: 'Call TechStart about demo', due: 'Tomorrow, 3:00 PM', priority: 'medium', contact: 'Sarah Johnson' },
                { task: 'Update contact information', due: 'Friday, 9:00 AM', priority: 'low', contact: null },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{item.task}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.due}</p>
                    {item.contact && (
                      <p className="text-xs text-gray-600 mt-1">Contact: {item.contact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
