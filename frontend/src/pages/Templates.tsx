import { useState, useEffect, useCallback } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  DocumentTextIcon,
  FunnelIcon,
  UserGroupIcon,
  TagIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  FireIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface Template {
  id: string;
  name: string;
  description: string;
  subject_line: string;
  category: string;
  tags: string[];
  persona: string;
  industry: string;
  company_size: string;
  sales_stage: string;
  tone: string;
  use_count: number;
  performance?: {
    sends: number;
    open_rate: number;
    click_rate: number;
    reply_rate: number;
  };
}

type ViewMode = 'browse' | 'my-templates' | 'favorites';
type FilterCategory = 'all' | 'cold_outreach' | 'demo' | 'lead_nurturing' | 'closing';

interface CreateTemplateForm {
  name: string;
  description: string;
  subject_line: string;
  body_html: string;
  category: string;
  persona: string;
  industry: string;
  company_size: string;
  tone: string;
  tags: string[];
}

const Templates: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<CreateTemplateForm>({
    name: '',
    description: '',
    subject_line: '',
    body_html: '',
    category: 'cold_outreach',
    persona: 'c_level',
    industry: 'saas',
    company_size: 'mid_market',
    tone: 'professional',
    tags: [],
  });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPersona !== 'all') params.append('persona', selectedPersona);
      if (selectedIndustry !== 'all') params.append('industry', selectedIndustry);

      const response = await fetch(`http://localhost:3001/api/templates?${params}`);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedPersona, selectedIndustry]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const duplicateTemplate = async (templateId: string) => {
    try {
      await fetch(`http://localhost:3001/api/templates/${templateId}/duplicate`, {
        method: 'POST',
      });
      fetchTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateStep(1);
        setFormData({
          name: '',
          description: '',
          subject_line: '',
          body_html: '',
          category: 'cold_outreach',
          persona: 'c_level',
          industry: 'saas',
          company_size: 'mid_market',
          tone: 'professional',
          tags: [],
        });
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const canProceedToNextStep = () => {
    switch (createStep) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.subject_line.trim() && formData.body_html.trim();
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      cold_outreach: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      demo: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      lead_nurturing: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      closing: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    };
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === 'browse' ? 'Browse and use proven email templates' :
             viewMode === 'my-templates' ? 'Manage your custom templates' :
             'Your favorite templates'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Custom Template
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setViewMode('browse')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'browse'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SparklesIcon className="w-5 h-5 inline mr-2" />
            Browse Templates
          </button>
          <button
            onClick={() => setViewMode('my-templates')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'my-templates'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DocumentTextIcon className="w-5 h-5 inline mr-2" />
            My Templates ({templates.length})
          </button>
          <button
            onClick={() => setViewMode('favorites')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'favorites'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FunnelIcon className="w-5 h-5 inline mr-2" />
            Favorites
          </button>
        </nav>
      </div>

      {/* Browse Templates View */}
      {viewMode === 'browse' && (
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
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('cold_outreach')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'cold_outreach'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <UserGroupIcon className="w-4 h-4 mr-1" />
              Cold Outreach
            </button>
            <button
              onClick={() => setSelectedCategory('demo')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'demo'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <TagIcon className="w-4 h-4 mr-1" />
              Demo
            </button>
            <button
              onClick={() => setSelectedCategory('lead_nurturing')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                selectedCategory === 'lead_nurturing'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <BuildingOfficeIcon className="w-4 h-4 mr-1" />
              Lead Nurturing
            </button>
          </div>

          {/* Additional Filters Row */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Personas</option>
              <option value="c_level">C-Level</option>
              <option value="technical">Technical/IT</option>
              <option value="manager">Manager</option>
            </select>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Industries</option>
              <option value="saas">SaaS</option>
              <option value="ecommerce">E-commerce</option>
              <option value="financial_services">Financial Services</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>

          {/* Template Cards */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No templates found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const colors = getCategoryColor(template.category);
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${colors.bg}`}>
                        <DocumentTextIcon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        {formatCategoryName(template.category)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        <span className="font-medium">Persona:</span>
                        <span className="ml-1">{template.persona ? formatCategoryName(template.persona) : 'All'}</span>
                      </div>
                      {template.performance && (
                        <div className="flex items-center text-sm text-gray-600">
                          <ChartBarIcon className="w-4 h-4 mr-2" />
                          <span className="font-medium">Reply Rate:</span>
                          <span className={`ml-1 font-semibold ${
                            template.performance.reply_rate >= 25 ? 'text-green-600' :
                            template.performance.reply_rate <= 10 ? 'text-yellow-600' :
                            'text-gray-900'
                          }`}>
                            {template.performance.reply_rate}%
                          </span>
                          {template.performance.reply_rate >= 25 && (
                            <FireIcon className="w-4 h-4 ml-1 text-green-600" />
                          )}
                        </div>
                      )}
                    </div>

                    {template.performance && (
                      <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Opens</p>
                          <p className="text-sm font-semibold text-gray-900">{template.performance.open_rate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="text-sm font-semibold text-gray-900">{template.performance.click_rate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Sends</p>
                          <p className="text-sm font-semibold text-gray-900">{template.performance.sends}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 font-medium mb-1">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-white text-gray-700 rounded border border-gray-200">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-white text-gray-500 rounded border border-gray-200">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                        Use This Template
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTemplate(template.id);
                        }}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Used {template.use_count} times
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Templates View */}
      {viewMode === 'my-templates' && (
        <div className="space-y-4">
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">You haven't created any custom templates yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
            >
              Create Your First Template
            </button>
          </div>
        </div>
      )}

      {/* Favorites View */}
      {viewMode === 'favorites' && (
        <div className="space-y-4">
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <ChartBarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No favorite templates yet. Start browsing to add some!</p>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Template</h2>
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
                          Template Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Enterprise Cold Outreach"
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
                          placeholder="Brief description of when to use this template"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Email Content */}
              {createStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Content</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject Line *
                        </label>
                        <input
                          type="text"
                          value={formData.subject_line}
                          onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                          placeholder="e.g., Quick question about {{companyName}}'s growth"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use variables like {'{{'} firstName {'}}'},  {'{{'} companyName {'}}'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Body *
                        </label>
                        <textarea
                          value={formData.body_html}
                          onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                          placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{companyName}}..."
                          rows={12}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Available variables: firstName, lastName, companyName, jobTitle
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Categorization */}
              {createStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorization & Targeting</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                          <option value="lead_nurturing">Lead Nurturing</option>
                          <option value="demo">Demo</option>
                          <option value="closing">Closing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Persona
                        </label>
                        <select
                          value={formData.persona}
                          onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="c_level">C-Level</option>
                          <option value="vp_director">VP/Director</option>
                          <option value="manager">Manager</option>
                          <option value="technical">Technical/IT</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry
                        </label>
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="saas">SaaS</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="financial_services">Financial Services</option>
                          <option value="healthcare">Healthcare</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Size
                        </label>
                        <select
                          value={formData.company_size}
                          onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="smb">SMB (1-50)</option>
                          <option value="mid_market">Mid-Market (51-500)</option>
                          <option value="enterprise">Enterprise (500+)</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tone
                        </label>
                        <select
                          value={formData.tone}
                          onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="professional">Professional/Formal</option>
                          <option value="casual">Casual/Friendly</option>
                          <option value="urgent">Urgent/Direct</option>
                          <option value="educational">Educational</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Add a tag"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-primary-600 hover:text-primary-800"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
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
                    onClick={handleCreateTemplate}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Create Template
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
