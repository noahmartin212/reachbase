import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  CalendarIcon,
  UserCircleIcon,
  FireIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

interface Task {
  id: number;
  task: string;
  description: string;
  aiScore: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  estimatedValue: string;
  contact: string;
  account: string;
  tags: string[];
  aiReasoning: string;
}

const Tasks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - similar to Dashboard but with more task details
  const tasks: Task[] = [
    {
      id: 1,
      task: 'Follow up with Enterprise Corp',
      description: 'Send proposal follow-up email and schedule demo',
      aiScore: 95,
      priority: 'urgent',
      status: 'todo',
      dueDate: 'Today',
      estimatedValue: '$125K',
      contact: 'John Smith',
      account: 'Enterprise Corp',
      tags: ['demo', 'follow-up'],
      aiReasoning: 'High engagement in last email, decision maker involved, large deal size',
    },
    {
      id: 2,
      task: 'Prepare proposal for Acme Inc',
      description: 'Create custom pricing proposal based on their requirements',
      aiScore: 92,
      priority: 'urgent',
      status: 'in-progress',
      dueDate: 'Today',
      estimatedValue: '$85K',
      contact: 'Jane Doe',
      account: 'Acme Inc',
      tags: ['proposal', 'pricing'],
      aiReasoning: 'Deadline approaching, high interest level, budget confirmed',
    },
    {
      id: 3,
      task: 'Schedule call with TechStart CEO',
      description: 'Book 30-minute intro call to discuss their needs',
      aiScore: 88,
      priority: 'high',
      status: 'todo',
      dueDate: 'Tomorrow',
      estimatedValue: '$45K',
      contact: 'Sarah Johnson',
      account: 'TechStart',
      tags: ['call', 'discovery'],
      aiReasoning: 'CEO involvement signals buying intent, startup moving fast',
    },
    {
      id: 4,
      task: 'Send contract to Global Tech',
      description: 'Finalize and send contract for annual subscription',
      aiScore: 85,
      priority: 'high',
      status: 'todo',
      dueDate: 'In 2 days',
      estimatedValue: '$180K',
      contact: 'Michael Brown',
      account: 'Global Tech',
      tags: ['contract', 'closing'],
      aiReasoning: 'Late-stage deal, verbal commitment received, large contract value',
    },
    {
      id: 5,
      task: 'Check in with Innovate Co',
      description: 'Quarterly business review and upsell discussion',
      aiScore: 78,
      priority: 'medium',
      status: 'todo',
      dueDate: 'This week',
      estimatedValue: '$35K',
      contact: 'Emily Davis',
      account: 'Innovate Co',
      tags: ['check-in', 'upsell'],
      aiReasoning: 'Existing customer, good relationship, upsell opportunity identified',
    },
    {
      id: 6,
      task: 'Research competitor for comparison',
      description: 'Prepare competitive analysis document',
      aiScore: 65,
      priority: 'medium',
      status: 'todo',
      dueDate: 'Next week',
      estimatedValue: '$0',
      contact: '',
      account: '',
      tags: ['research', 'internal'],
      aiReasoning: 'Supporting activity for multiple deals, not time-sensitive',
    },
    {
      id: 7,
      task: 'Update CRM data',
      description: 'Clean up contact information and add notes',
      aiScore: 45,
      priority: 'low',
      status: 'todo',
      dueDate: 'Next week',
      estimatedValue: '$0',
      contact: '',
      account: '',
      tags: ['admin', 'internal'],
      aiReasoning: 'Administrative task, low urgency, no immediate revenue impact',
    },
    {
      id: 8,
      task: 'Sent welcome email to new lead',
      description: 'Initial outreach email sent',
      aiScore: 100,
      priority: 'high',
      status: 'completed',
      dueDate: 'Yesterday',
      estimatedValue: '$25K',
      contact: 'Alex Chen',
      account: 'StartupX',
      tags: ['outreach', 'new-lead'],
      aiReasoning: 'Completed successfully',
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <FireIcon className="w-5 h-5 text-red-500" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'todo':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-primary-600 bg-primary-50';
    if (score >= 80) return 'text-primary-600 bg-primary-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Task stats
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredTasks.length} tasks found</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-primary-600 rounded-lg p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">AI Prioritization Active</h3>
            <p className="text-sm text-primary-50">
              Tasks are automatically prioritized based on engagement, deal value, and timing. Focus on high-scoring tasks first.
            </p>
          </div>
          <BoltIcon className="w-6 h-6 flex-shrink-0" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">To Do</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{todoCount}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{urgentCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-red-600" />
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
              placeholder="Search tasks..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  readOnly
                />

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.task}
                        </h3>
                        {getPriorityIcon(task.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                      {/* Task Details */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {task.dueDate}
                        </div>
                        {task.contact && (
                          <div className="flex items-center">
                            <UserCircleIcon className="w-4 h-4 mr-1" />
                            {task.contact}
                          </div>
                        )}
                        {task.estimatedValue !== '$0' && (
                          <div className="font-semibold text-green-600">{task.estimatedValue}</div>
                        )}
                      </div>

                      {/* Tags and Status */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(task.status)}`}>
                          {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                        {task.tags.map((tag) => (
                          <span key={tag} className="inline-flex px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* AI Reasoning */}
                      {task.aiReasoning && (
                        <div className="mt-2 p-2 bg-primary-50 rounded border border-primary-100">
                          <div className="flex items-start space-x-2">
                            <SparklesIcon className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-primary-900">{task.aiReasoning}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Score */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`text-2xl font-bold rounded-lg px-3 py-1 ${getAIScoreColor(task.aiScore)}`}>
                        {task.aiScore}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">AI Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
