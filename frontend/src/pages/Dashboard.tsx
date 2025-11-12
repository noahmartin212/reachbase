import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [timePeriod] = useState<'today' | 'week' | 'month'>('week');

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

  // Email performance over time
  const emailPerformanceData = [
    { day: 'Mon', sent: 89, opened: 38, replied: 12 },
    { day: 'Tue', sent: 95, opened: 42, replied: 15 },
    { day: 'Wed', sent: 102, opened: 45, replied: 18 },
    { day: 'Thu', sent: 87, opened: 39, replied: 14 },
    { day: 'Fri', sent: 112, opened: 51, replied: 21 },
    { day: 'Sat', sent: 45, opened: 18, replied: 7 },
    { day: 'Sun', sent: 32, opened: 12, replied: 4 },
  ];

  // Pipeline data
  const pipelineData = [
    { stage: 'New Leads', count: 45, value: '$450K' },
    { stage: 'Contacted', count: 32, value: '$380K' },
    { stage: 'Qualified', count: 18, value: '$290K' },
    { stage: 'Proposal', count: 12, value: '$215K' },
    { stage: 'Negotiation', count: 7, value: '$165K' },
    { stage: 'Closed Won', count: 3, value: '$95K' },
  ];

  // Priority Tasks with AI scoring (showing top 3)
  const priorityTasks = [
    {
      id: 1,
      task: 'Follow up with Enterprise Corp',
      description: 'High-value lead, opened email 3 times',
      due: 'Today, 2:00 PM',
      priority: 'urgent' as const,
      contact: 'John Smith',
      company: 'Enterprise Corp',
      aiScore: 95,
      aiReason: 'High engagement + approaching deal deadline',
      tags: ['high-value', 'hot-lead'],
      estimatedValue: '$125K',
    },
    {
      id: 2,
      task: 'Send proposal to Acme Inc',
      description: 'Requested pricing, replied to last email',
      due: 'Today, 4:30 PM',
      priority: 'high' as const,
      contact: 'Jane Doe',
      company: 'Acme Inc',
      aiScore: 88,
      aiReason: 'Positive reply sentiment + demo completed',
      tags: ['proposal-ready'],
      estimatedValue: '$85K',
    },
    {
      id: 3,
      task: 'Call TechStart about demo',
      description: 'Scheduled demo for tomorrow, prep materials',
      due: 'Today, 5:00 PM',
      priority: 'high' as const,
      contact: 'Sarah Johnson',
      company: 'TechStart',
      aiScore: 82,
      aiReason: 'Strong fit based on company profile',
      tags: ['demo-scheduled'],
      estimatedValue: '$65K',
    },
    {
      id: 4,
      task: 'Review "Q4 Enterprise" sequence performance',
      description: 'Low open rates, may need template refresh',
      due: 'Tomorrow, 10:00 AM',
      priority: 'medium' as const,
      contact: null,
      company: null,
      aiScore: 75,
      aiReason: 'Declining metrics require attention',
      tags: ['sequence-optimization'],
      estimatedValue: null,
    },
    {
      id: 5,
      task: 'Nurture cold leads from last month',
      description: '23 leads have gone cold, send re-engagement',
      due: 'Tomorrow, 2:00 PM',
      priority: 'medium' as const,
      contact: null,
      company: null,
      aiScore: 68,
      aiReason: 'Opportunity to recover stalled deals',
      tags: ['re-engagement'],
      estimatedValue: null,
    },
    {
      id: 6,
      task: 'Update contact information for imports',
      description: 'New batch of 45 contacts needs verification',
      due: 'Friday, 9:00 AM',
      priority: 'low' as const,
      contact: null,
      company: null,
      aiScore: 45,
      aiReason: 'Low urgency administrative task',
      tags: ['data-cleanup'],
      estimatedValue: null,
    },
  ];

  // AI Suggestions
  const aiSuggestions = [
    {
      type: 'opportunity',
      icon: FireIcon,
      title: 'High-Intent Leads Detected',
      description: '3 contacts have opened your emails 5+ times in the past 2 days. Strike while the iron is hot!',
      action: 'View Leads',
      priority: 'high',
    },
    {
      type: 'optimization',
      icon: LightBulbIcon,
      title: 'Improve Email Performance',
      description: 'Your subject lines average 42% open rate. Try personalizing with {{company_name}} for a 15% boost.',
      action: 'See Examples',
      priority: 'medium',
    },
    {
      type: 'timing',
      icon: ClockIcon,
      title: 'Best Time to Send',
      description: 'Based on your data, emails sent Tuesday-Thursday 9-11 AM get 23% more replies.',
      action: 'Optimize Schedule',
      priority: 'medium',
    },
    {
      type: 'alert',
      icon: ExclamationTriangleIcon,
      title: 'Stale Leads Alert',
      description: '18 promising leads haven\'t been contacted in 14+ days. You might be losing momentum.',
      action: 'Re-engage Now',
      priority: 'high',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered insights to maximize your outreach effectiveness</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            View All Tasks
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center">
            <SparklesIcon className="w-4 h-4 mr-2" />
            AI Suggestions
          </button>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-600 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Insights Ready</h3>
              <p className="text-sm text-gray-600">We've analyzed your sales activity and identified {aiSuggestions.length} actionable recommendations</p>
            </div>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
            View All
            <span className="ml-1">→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {aiSuggestions.slice(0, 2).map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    suggestion.priority === 'high' ? 'bg-red-100' : 'bg-primary-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      suggestion.priority === 'high' ? 'text-red-600' : 'text-primary-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 mt-2">
                      {suggestion.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">{stat.name}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-xs font-medium flex items-center ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 mr-0.5" />
                )}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Priority Tasks + Email Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Tasks - Top 3 */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Top Priority Tasks</h2>
                <p className="text-xs text-gray-500 mt-1">AI-ranked by urgency & value</p>
              </div>
              <SparklesIcon className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {priorityTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{task.task}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {task.due}
                          </div>
                          {task.estimatedValue && (
                            <span className="text-green-600 font-medium">{task.estimatedValue}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="text-xl font-bold text-primary-600">{task.aiScore}</div>
                        <div className="text-xs text-gray-400">AI</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <button className="text-xs font-medium text-primary-600 hover:text-primary-700 w-full text-center">
              View All {priorityTasks.length + 12} Tasks →
            </button>
          </div>
        </div>

        {/* Email Performance Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Email Performance</h2>
            <p className="text-xs text-gray-500 mt-1">Last 7 days activity</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
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
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="sent" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
              <Area type="monotone" dataKey="opened" stroke="#10b981" fillOpacity={1} fill="url(#colorOpened)" strokeWidth={2} />
              <Area type="monotone" dataKey="replied" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorReplied)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Overview + AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
            <p className="text-xs text-gray-500 mt-1">Current deals by stage</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any, _name: any, props: any) => [
                  `${value} deals (${props.payload.value})`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional AI Suggestions */}
        <div className="space-y-3">
          {aiSuggestions.slice(2).map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-300 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    suggestion.priority === 'high' ? 'bg-red-100' : 'bg-primary-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      suggestion.priority === 'high' ? 'text-red-600' : 'text-primary-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 mt-2">
                      {suggestion.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
