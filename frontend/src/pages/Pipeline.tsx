import React, { useState } from 'react';
import {
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  title: string;
  aiScore: number;
}

interface DealActivity {
  id: number;
  type: 'note' | 'email' | 'call' | 'meeting' | 'stage_change' | 'created';
  description: string;
  timestamp: string;
  user: string;
  metadata?: {
    oldStage?: string;
    newStage?: string;
    oldValue?: number;
    newValue?: number;
  };
}

interface Deal {
  id: number;
  name: string;
  contact: Contact;
  value: number;
  stage: 'prospecting' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  createdDate: string;
  lastActivityDate: string;
  healthScore: number;
  notes: string;
  activities: DealActivity[];
}

interface CreateDealForm {
  name: string;
  contact: Contact | null;
  value: string;
  stage: Deal['stage'];
  probability: number;
  closeDate: string;
  notes: string;
}

const STAGES = [
  { id: 'prospecting', name: 'Prospecting', color: 'bg-gray-100 text-gray-800', probability: 30 },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-800', probability: 50 },
  { id: 'demo', name: 'Demo Scheduled', color: 'bg-purple-100 text-purple-800', probability: 60 },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-yellow-100 text-yellow-800', probability: 75 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800', probability: 85 },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 text-green-800', probability: 100 },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800', probability: 0 },
];

const MOCK_CONTACTS: Contact[] = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Inc', title: 'CTO', aiScore: 92 },
  { id: 2, name: 'Michael Chen', email: 'mchen@innovate.io', company: 'Innovate.io', title: 'VP of Engineering', aiScore: 88 },
  { id: 3, name: 'Emily Rodriguez', email: 'emily@startup.com', company: 'StartupXYZ', title: 'CEO', aiScore: 95 },
  { id: 4, name: 'David Kim', email: 'david@enterprise.com', company: 'Enterprise Solutions', title: 'Director of IT', aiScore: 78 },
  { id: 5, name: 'Lisa Anderson', email: 'lisa@global.com', company: 'Global Systems', title: 'Head of Operations', aiScore: 85 },
];

const Pipeline: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [newNote, setNewNote] = useState('');
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 1,
      name: 'TechCorp Enterprise License',
      contact: MOCK_CONTACTS[0],
      value: 125000,
      stage: 'proposal',
      probability: 75,
      closeDate: '2025-12-15',
      createdDate: '2025-10-01',
      lastActivityDate: '2025-11-05',
      healthScore: 82,
      notes: 'Strong interest in annual contract. Waiting on legal review.',
      activities: [
        {
          id: 1,
          type: 'created',
          description: 'Deal created',
          timestamp: '2025-10-01T10:00:00Z',
          user: 'John Doe',
        },
        {
          id: 2,
          type: 'stage_change',
          description: 'Deal moved to Proposal stage',
          timestamp: '2025-10-25T14:30:00Z',
          user: 'John Doe',
          metadata: { oldStage: 'Demo', newStage: 'Proposal' },
        },
        {
          id: 3,
          type: 'email',
          description: 'Sent proposal document via email',
          timestamp: '2025-10-25T14:35:00Z',
          user: 'John Doe',
        },
        {
          id: 4,
          type: 'note',
          description: 'Strong interest in annual contract. Waiting on legal review.',
          timestamp: '2025-11-05T09:15:00Z',
          user: 'John Doe',
        },
      ],
    },
    {
      id: 2,
      name: 'Innovate.io Platform Migration',
      contact: MOCK_CONTACTS[1],
      value: 85000,
      stage: 'demo',
      probability: 60,
      closeDate: '2025-12-28',
      createdDate: '2025-10-15',
      lastActivityDate: '2025-11-08',
      healthScore: 75,
      notes: 'Demo scheduled for next week. Multiple stakeholders involved.',
      activities: [
        {
          id: 1,
          type: 'created',
          description: 'Deal created',
          timestamp: '2025-10-15T11:00:00Z',
          user: 'Jane Smith',
        },
        {
          id: 2,
          type: 'call',
          description: 'Initial discovery call with VP of Engineering',
          timestamp: '2025-10-20T15:00:00Z',
          user: 'Jane Smith',
        },
        {
          id: 3,
          type: 'meeting',
          description: 'Demo scheduled for Nov 15',
          timestamp: '2025-11-08T10:00:00Z',
          user: 'Jane Smith',
        },
      ],
    },
    {
      id: 3,
      name: 'StartupXYZ Growth Plan',
      contact: MOCK_CONTACTS[2],
      value: 45000,
      stage: 'negotiation',
      probability: 85,
      closeDate: '2025-11-20',
      createdDate: '2025-09-20',
      lastActivityDate: '2025-11-10',
      healthScore: 90,
      notes: 'Nearly closed. Final pricing discussion needed.',
      activities: [
        {
          id: 1,
          type: 'created',
          description: 'Deal created',
          timestamp: '2025-09-20T09:00:00Z',
          user: 'John Doe',
        },
        {
          id: 2,
          type: 'note',
          description: 'Nearly closed. Final pricing discussion needed.',
          timestamp: '2025-11-10T16:20:00Z',
          user: 'John Doe',
        },
      ],
    },
    {
      id: 4,
      name: 'Enterprise Solutions Pilot',
      contact: MOCK_CONTACTS[3],
      value: 35000,
      stage: 'qualified',
      probability: 50,
      closeDate: '2026-01-15',
      createdDate: '2025-11-01',
      lastActivityDate: '2025-11-09',
      healthScore: 65,
      notes: 'Budget approved. Need to schedule technical discussion.',
      activities: [
        {
          id: 1,
          type: 'created',
          description: 'Deal created',
          timestamp: '2025-11-01T14:00:00Z',
          user: 'Sarah Wilson',
        },
      ],
    },
    {
      id: 5,
      name: 'Global Systems Integration',
      contact: MOCK_CONTACTS[4],
      value: 180000,
      stage: 'prospecting',
      probability: 30,
      closeDate: '2026-02-01',
      createdDate: '2025-11-05',
      lastActivityDate: '2025-11-06',
      healthScore: 55,
      notes: 'Initial contact made. Waiting for discovery call.',
      activities: [
        {
          id: 1,
          type: 'created',
          description: 'Deal created',
          timestamp: '2025-11-05T10:30:00Z',
          user: 'Mike Johnson',
        },
        {
          id: 2,
          type: 'email',
          description: 'Sent initial outreach email',
          timestamp: '2025-11-06T09:00:00Z',
          user: 'Mike Johnson',
        },
      ],
    },
  ]);

  const [createForm, setCreateForm] = useState<CreateDealForm>({
    name: '',
    contact: null,
    value: '',
    stage: 'prospecting',
    probability: 30,
    closeDate: '',
    notes: '',
  });

  const calculatePipelineMetrics = () => {
    const activeDeals = deals.filter(d => !d.stage.includes('closed'));
    const wonDeals = deals.filter(d => d.stage === 'closed-won');
    const lostDeals = deals.filter(d => d.stage === 'closed-lost');
    const closedDeals = [...wonDeals, ...lostDeals];

    const totalValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = activeDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
    const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0;
    const avgDealSize = activeDeals.length > 0 ? totalValue / activeDeals.length : 0;

    return { totalValue, weightedValue, winRate, avgDealSize, activeCount: activeDeals.length };
  };

  const metrics = calculatePipelineMetrics();

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDaysUntilClose = (closeDateString: string) => {
    const closeDate = new Date(closeDateString);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityIcon = (type: DealActivity['type']) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="w-4 h-4" />;
      case 'call':
        return <PhoneIcon className="w-4 h-4" />;
      case 'meeting':
        return <CalendarIcon className="w-4 h-4" />;
      case 'note':
        return <ChatBubbleLeftIcon className="w-4 h-4" />;
      case 'stage_change':
        return <ArrowRightIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const handleCreateDeal = () => {
    if (!createForm.name || !createForm.contact || !createForm.value) {
      alert('Please fill in all required fields');
      return;
    }

    const newDeal: Deal = {
      id: deals.length + 1,
      name: createForm.name,
      contact: createForm.contact,
      value: parseFloat(createForm.value.replace(/[^0-9.]/g, '')),
      stage: createForm.stage,
      probability: createForm.probability,
      closeDate: createForm.closeDate,
      createdDate: new Date().toISOString().split('T')[0],
      lastActivityDate: new Date().toISOString().split('T')[0],
      healthScore: 70,
      notes: createForm.notes,
      activities: [
        {
          id: 1,
          type: 'created',
          description: 'Deal created',
          timestamp: new Date().toISOString(),
          user: 'Current User',
        },
      ],
    };

    setDeals([...deals, newDeal]);
    setShowCreateModal(false);
    setCreateForm({
      name: '',
      contact: null,
      value: '',
      stage: 'prospecting',
      probability: 30,
      closeDate: '',
      notes: '',
    });
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDetailModal(true);
  };

  const handleMoveDeal = (dealId: number, newStage: Deal['stage']) => {
    setDeals(prevDeals =>
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          const stage = STAGES.find(s => s.id === newStage);
          const newActivity: DealActivity = {
            id: deal.activities.length + 1,
            type: 'stage_change',
            description: `Deal moved to ${stage?.name}`,
            timestamp: new Date().toISOString(),
            user: 'Current User',
            metadata: { oldStage: deal.stage, newStage },
          };

          return {
            ...deal,
            stage: newStage,
            probability: stage?.probability || deal.probability,
            lastActivityDate: new Date().toISOString().split('T')[0],
            activities: [...deal.activities, newActivity],
          };
        }
        return deal;
      })
    );

    // Update selected deal if it's being viewed
    if (selectedDeal && selectedDeal.id === dealId) {
      const updatedDeal = deals.find(d => d.id === dealId);
      if (updatedDeal) {
        setSelectedDeal({ ...updatedDeal, stage: newStage });
      }
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedDeal) return;

    const newActivity: DealActivity = {
      id: selectedDeal.activities.length + 1,
      type: 'note',
      description: newNote,
      timestamp: new Date().toISOString(),
      user: 'Current User',
    };

    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === selectedDeal.id
          ? {
              ...deal,
              notes: newNote,
              lastActivityDate: new Date().toISOString().split('T')[0],
              activities: [...deal.activities, newActivity],
            }
          : deal
      )
    );

    setSelectedDeal({
      ...selectedDeal,
      notes: newNote,
      activities: [...selectedDeal.activities, newActivity],
    });

    setNewNote('');
  };

  const handleDeleteDeal = (dealId: number) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
    setShowDetailModal(false);
    setSelectedDeal(null);
  };

  const filteredContacts = MOCK_CONTACTS.filter(
    contact =>
      contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.company.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contact.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = filterStage === 'all' || deal.stage === filterStage;

    return matchesSearch && matchesStage;
  });

  const getAiRecommendations = () => {
    const recommendations = [];

    // Stale deals
    const staleDeals = deals.filter(deal => {
      const daysSinceActivity = Math.floor(
        (new Date().getTime() - new Date(deal.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceActivity > 7 && !deal.stage.includes('closed');
    });

    if (staleDeals.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `${staleDeals.length} deal(s) have no activity in 7+ days`,
        action: 'Review stale deals',
      });
    }

    // High-value deals needing attention
    const highValueDeals = deals.filter(d => d.value > 100000 && d.healthScore < 70);
    if (highValueDeals.length > 0) {
      recommendations.push({
        type: 'urgent',
        message: `${highValueDeals.length} high-value deal(s) need attention`,
        action: 'Focus on enterprise deals',
      });
    }

    // Deals closing soon
    const closingSoon = deals.filter(d => {
      const daysUntil = getDaysUntilClose(d.closeDate);
      return daysUntil <= 7 && daysUntil > 0 && !d.stage.includes('closed');
    });

    if (closingSoon.length > 0) {
      recommendations.push({
        type: 'info',
        message: `${closingSoon.length} deal(s) closing within 7 days`,
        action: 'Push to close',
      });
    }

    return recommendations;
  };

  const aiRecommendations = getAiRecommendations();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Track and manage your deals through the sales process</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FunnelIcon className="w-4 h-4 inline mr-2" />
                Kanban
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChartBarIcon className="w-4 h-4 inline mr-2" />
                List
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              New Deal
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            {STAGES.map(stage => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.totalValue)}</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.activeCount} active deals</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weighted Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.weightedValue)}</p>
                <p className="text-xs text-gray-500 mt-1">Probability adjusted</p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.winRate.toFixed(0)}%</p>
                <p className="text-xs text-gray-500 mt-1">Historical average</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.avgDealSize)}</p>
                <p className="text-xs text-gray-500 mt-1">Active pipeline</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Sales Cycle</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">42d</p>
                <p className="text-xs text-gray-500 mt-1">Days to close</p>
              </div>
              <ClockIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">AI Insights & Recommendations</h3>
                <div className="space-y-2">
                  {aiRecommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-md p-3">
                      <div className="flex items-center gap-3">
                        {rec.type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />}
                        {rec.type === 'urgent' && <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
                        {rec.type === 'info' && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
                        <span className="text-sm text-gray-700">{rec.message}</span>
                      </div>
                      <span className="text-sm font-medium text-primary-600">{rec.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageDeals = getDealsByStage(stage.id).filter(deal => filteredDeals.includes(deal));
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

            return (
              <div key={stage.id} className="flex-shrink-0 w-80">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                      <span className="text-sm text-gray-600">{stageDeals.length}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{formatCurrency(stageValue)}</p>
                  </div>

                  <div className="space-y-3">
                    {stageDeals.map(deal => {
                      const daysUntilClose = getDaysUntilClose(deal.closeDate);
                      const isOverdue = daysUntilClose < 0;

                      return (
                        <div
                          key={deal.id}
                          onClick={() => handleDealClick(deal)}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 flex-1 group-hover:text-primary-600">
                              {deal.name}
                            </h4>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <UserCircleIcon className="w-4 h-4" />
                              <span>{deal.contact.name}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <BuildingOfficeIcon className="w-4 h-4" />
                              <span>{deal.contact.company}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <span className="font-semibold text-gray-900">{formatCurrency(deal.value)}</span>
                              <span className="text-gray-600">{deal.probability}%</span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
                                  {isOverdue ? 'Overdue' : `${daysUntilClose}d`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <SparklesIcon className="w-3 h-3" />
                                <span className={getHealthColor(deal.healthScore)}>
                                  Health: {deal.healthScore}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact / Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeals.map(deal => {
                  const stage = STAGES.find(s => s.id === deal.stage);
                  const daysUntilClose = getDaysUntilClose(deal.closeDate);

                  return (
                    <tr
                      key={deal.id}
                      onClick={() => handleDealClick(deal)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{deal.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.contact.name}</div>
                        <div className="text-sm text-gray-500">{deal.contact.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(deal.value)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${stage?.color}`}>
                          {stage?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{deal.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(deal.closeDate)}</div>
                        <div className={`text-xs ${daysUntilClose < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {daysUntilClose < 0 ? 'Overdue' : `${daysUntilClose} days`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getHealthColor(deal.healthScore)}`}>
                          {deal.healthScore}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Deal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Deal</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g., Enterprise License Agreement"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact <span className="text-red-600">*</span>
                </label>
                {createForm.contact ? (
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{createForm.contact.name}</p>
                        <p className="text-sm text-gray-600">{createForm.contact.company}</p>
                      </div>
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          createForm.contact.aiScore >= 80
                            ? 'bg-green-100 text-green-800'
                            : createForm.contact.aiScore >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        AI Score: {createForm.contact.aiScore}
                      </span>
                    </div>
                    <button
                      onClick={() => setCreateForm({ ...createForm, contact: null })}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContactPicker(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 inline mr-2" />
                    Select Contact
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Value <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={createForm.value}
                      onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })}
                      placeholder="125,000"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={createForm.closeDate}
                    onChange={(e) => setCreateForm({ ...createForm, closeDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage
                  </label>
                  <select
                    value={createForm.stage}
                    onChange={(e) => {
                      const selectedStage = e.target.value as Deal['stage'];
                      const stage = STAGES.find(s => s.id === selectedStage);
                      setCreateForm({
                        ...createForm,
                        stage: selectedStage,
                        probability: stage?.probability || 30,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {STAGES.filter(s => !s.id.includes('closed')).map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Probability
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={createForm.probability}
                      onChange={(e) => setCreateForm({ ...createForm, probability: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-900 w-12">{createForm.probability}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any relevant notes about this deal..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* AI Suggestions */}
              {createForm.contact && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">AI Insights</h4>
                      <p className="text-sm text-gray-700">
                        {createForm.contact.aiScore >= 80
                          ? `${createForm.contact.name} is a hot lead! High engagement score suggests strong close probability. Consider prioritizing this deal.`
                          : createForm.contact.aiScore >= 60
                          ? `${createForm.contact.name} shows moderate engagement. Regular follow-ups recommended to maintain momentum.`
                          : `${createForm.contact.name} has lower engagement. Consider re-qualification or nurturing campaign before progressing.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeal}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Picker Modal */}
      {showContactPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Contact</h3>
              <button
                onClick={() => {
                  setShowContactPicker(false);
                  setContactSearch('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setCreateForm({ ...createForm, contact });
                    setShowContactPicker(false);
                    setContactSearch('');
                  }}
                  className="px-6 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {contact.title} at {contact.company}
                        </p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        contact.aiScore >= 80
                          ? 'bg-green-100 text-green-800'
                          : contact.aiScore >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      AI Score: {contact.aiScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deal Detail Modal */}
      {showDetailModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedDeal.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${STAGES.find(s => s.id === selectedDeal.stage)?.color}`}>
                    {STAGES.find(s => s.id === selectedDeal.stage)?.name}
                  </span>
                  <span className="text-2xl font-bold text-primary-600">{formatCurrency(selectedDeal.value)}</span>
                  <span className="text-sm text-gray-600">{selectedDeal.probability}% probability</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedDeal(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-6 p-6">
                {/* Left Column - Details */}
                <div className="col-span-2 space-y-6">
                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <UserCircleIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedDeal.contact.name}</p>
                          <p className="text-sm text-gray-600">{selectedDeal.contact.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                        <p className="text-sm text-gray-900">{selectedDeal.contact.company}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <p className="text-sm text-gray-900">{selectedDeal.contact.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <SparklesIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-900">AI Score: {selectedDeal.contact.aiScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deal Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Deal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Close Date</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(selectedDeal.closeDate)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getDaysUntilClose(selectedDeal.closeDate) < 0
                            ? 'Overdue'
                            : `${getDaysUntilClose(selectedDeal.closeDate)} days remaining`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Health Score</p>
                        <p className={`text-sm font-medium ${getHealthColor(selectedDeal.healthScore)}`}>
                          {selectedDeal.healthScore} / 100
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedDeal.createdDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Activity</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedDeal.lastActivityDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stage Progression */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Move to Stage</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {STAGES.filter(s => !s.id.includes('closed')).map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => handleMoveDeal(selectedDeal.id, stage.id as Deal['stage'])}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            selectedDeal.stage === stage.id
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                          disabled={selectedDeal.stage === stage.id}
                        >
                          {stage.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Note</h3>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                      placeholder="Add a note about this deal..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
                    />
                    <button
                      onClick={handleAddNote}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Right Column - Activity Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Activity Timeline</h3>
                    <button
                      onClick={() => handleDeleteDeal(selectedDeal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedDeal.activities
                      .slice()
                      .reverse()
                      .map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'created' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'email' ? 'bg-green-100 text-green-600' :
                            activity.type === 'call' ? 'bg-purple-100 text-purple-600' :
                            activity.type === 'meeting' ? 'bg-orange-100 text-orange-600' :
                            activity.type === 'stage_change' ? 'bg-primary-100 text-primary-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            {activity.metadata?.oldStage && activity.metadata?.newStage && (
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.metadata.oldStage} → {activity.metadata.newStage}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTimestamp(activity.timestamp)} • {activity.user}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
