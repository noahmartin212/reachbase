import React, { useState } from 'react';
import {
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

// Template interface
interface Template {
  id: string;
  name: string;
  subject_line: string;
  body_html?: string;
  category: string;
}

// Step type definitions
export type StepType = 'email' | 'wait' | 'task';

interface StepConfig {
  subject?: string;
  body?: string;
  templateId?: string;
  templateName?: string;
  waitDays?: number;
  waitHours?: number;
  taskDescription?: string;
  taskType?: string;
  taskAutomated?: boolean;
}

interface Step {
  id: string;
  type: StepType;
  config: StepConfig;
  expanded: boolean;
}

interface SequenceBuilderProps {
  sequenceName: string;
  onSave?: (steps: Step[]) => void;
}

export const SequenceBuilder: React.FC<SequenceBuilderProps> = ({ sequenceName }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [showStepMenu, setShowStepMenu] = useState<number | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState<string | null>(null);

  // Mock templates - in production, fetch from API
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Enterprise Decision Maker Outreach',
      subject_line: 'Quick question about {{companyName}}\'s growth strategy',
      body_html: 'Hi {{first_name}},\n\nI noticed {{companyName}} is expanding rapidly...',
      category: 'cold_outreach',
    },
    {
      id: '2',
      name: 'Product Demo Follow-up',
      subject_line: 'Following up on our demo - next steps for {{companyName}}',
      body_html: 'Hi {{first_name}},\n\nThanks for taking the time to meet with us...',
      category: 'demo',
    },
    {
      id: '3',
      name: 'Trial Activation Nudge',
      subject_line: 'Get the most out of your {{productName}} trial',
      body_html: 'Hi {{first_name}},\n\nI hope you\'re enjoying your trial...',
      category: 'lead_nurturing',
    },
    {
      id: '4',
      name: 'Re-engagement Campaign',
      subject_line: 'Haven\'t heard from you - quick check-in',
      body_html: 'Hi {{first_name}},\n\nI wanted to reach out one more time...',
      category: 'cold_outreach',
    },
  ];

  const addStep = (type: StepType, afterIndex?: number) => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      type,
      config: {},
      expanded: true,
    };

    if (afterIndex !== undefined) {
      const newSteps = [...steps];
      newSteps.splice(afterIndex + 1, 0, newStep);
      setSteps(newSteps);
    } else {
      setSteps([...steps, newStep]);
    }
    setShowStepMenu(null);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const toggleStep = (id: string) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, expanded: !step.expanded } : step
    ));
  };

  const updateStepConfig = (id: string, config: Partial<StepConfig>) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, config: { ...step.config, ...config } } : step
    ));
  };

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="w-5 h-5 text-blue-600" />;
      case 'wait':
        return <ClockIcon className="w-5 h-5 text-orange-600" />;
      case 'task':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    }
  };

  const getStepTitle = (step: Step) => {
    switch (step.type) {
      case 'email':
        return step.config.subject || 'Email';
      case 'wait':
        const days = step.config.waitDays || 0;
        const hours = step.config.waitHours || 0;
        if (days && hours) return `Wait ${days}d ${hours}h`;
        if (days) return `Wait ${days} days`;
        if (hours) return `Wait ${hours} hours`;
        return 'Wait';
      case 'task':
        return step.config.taskDescription || 'Task';
    }
  };

  const getStepSubtitle = (step: Step) => {
    switch (step.type) {
      case 'email':
        return step.config.body ? `${step.config.body.substring(0, 60)}...` : 'Click to configure email';
      case 'wait':
        return 'Delay before next action';
      case 'task':
        return 'Manual task to complete';
    }
  };

  const selectTemplate = (stepId: string, template: Template) => {
    updateStepConfig(stepId, {
      templateId: template.id,
      templateName: template.name,
      subject: template.subject_line,
      body: template.body_html || '',
    });
    setShowTemplatePicker(null);
  };

  const renderStepContent = (step: Step) => {
    switch (step.type) {
      case 'email':
        return (
          <div className="space-y-4 p-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Template
              </label>
              {step.config.templateId ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{step.config.templateName}</span>
                  </div>
                  <button
                    onClick={() => setShowTemplatePicker(step.id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTemplatePicker(step.id)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span className="font-medium">Choose from Templates</span>
                </button>
              )}
            </div>

            {/* Template Picker Modal */}
            {showTemplatePicker === step.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Select Email Template</h3>
                    <button
                      onClick={() => setShowTemplatePicker(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[60vh] p-6">
                    <div className="grid grid-cols-1 gap-4">
                      {mockTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => selectTemplate(step.id, template)}
                          className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {template.category.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Subject: {template.subject_line}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {template.body_html}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={step.config.subject || ''}
                onChange={(e) => updateStepConfig(step.id, { subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Body
              </label>
              <textarea
                value={step.config.body || ''}
                onChange={(e) => updateStepConfig(step.id, { body: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email body..."
              />
            </div>
          </div>
        );

      case 'wait':
        return (
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wait Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    min="0"
                    value={step.config.waitDays || 0}
                    onChange={(e) => updateStepConfig(step.id, { waitDays: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Days"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Days</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={step.config.waitHours || 0}
                    onChange={(e) => updateStepConfig(step.id, { waitHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Hours"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Hours</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'task':
        const taskTypes = [
          { id: 'linkedin_connect', name: 'Send LinkedIn Connection Request', automated: true, icon: '👔' },
          { id: 'linkedin_message', name: 'Send LinkedIn Message', automated: true, icon: '💬' },
          { id: 'linkedin_view', name: 'View LinkedIn Profile', automated: true, icon: '👁️' },
          { id: 'call', name: 'Make Phone Call', automated: false, icon: '📞' },
          { id: 'research', name: 'Research Company/Contact', automated: false, icon: '🔍' },
          { id: 'send_gift', name: 'Send Gift or Swag', automated: false, icon: '🎁' },
          { id: 'update_crm', name: 'Update CRM Notes', automated: false, icon: '📝' },
          { id: 'schedule_meeting', name: 'Schedule Follow-up Meeting', automated: false, icon: '📅' },
          { id: 'custom', name: 'Custom Task', automated: false, icon: '✅' },
        ];

        return (
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {taskTypes.map((taskType) => (
                  <button
                    key={taskType.id}
                    onClick={() => updateStepConfig(step.id, {
                      taskType: taskType.id,
                      taskAutomated: taskType.automated,
                      taskDescription: taskType.name
                    })}
                    className={`text-left p-3 border rounded-lg transition-colors flex items-center justify-between ${
                      step.config.taskType === taskType.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{taskType.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{taskType.name}</div>
                        {taskType.automated && (
                          <div className="text-xs text-green-600 flex items-center space-x-1 mt-1">
                            <SparklesIcon className="w-3 h-3" />
                            <span>Automated</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {step.config.taskType && step.config.taskType.startsWith('linkedin') && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <SparklesIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Automated LinkedIn Action</p>
                    <p className="text-blue-700">
                      {step.config.taskType === 'linkedin_connect' && 'A connection request will be automatically sent with a personalized message.'}
                      {step.config.taskType === 'linkedin_message' && 'A message will be automatically sent to the contact via LinkedIn.'}
                      {step.config.taskType === 'linkedin_view' && 'The contact\'s LinkedIn profile will be automatically viewed to increase visibility.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step.config.taskType === 'linkedin_connect' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Message (Optional)
                </label>
                <textarea
                  value={step.config.taskDescription || ''}
                  onChange={(e) => updateStepConfig(step.id, { taskDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Hi {{first_name}}, I'd love to connect..."
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to send without a note</p>
              </div>
            )}

            {step.config.taskType === 'linkedin_message' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Message
                </label>
                <textarea
                  value={step.config.taskDescription || ''}
                  onChange={(e) => updateStepConfig(step.id, { taskDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Hi {{first_name}}, following up on..."
                />
              </div>
            )}

            {step.config.taskType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Instructions
                </label>
                <textarea
                  value={step.config.taskDescription || ''}
                  onChange={(e) => updateStepConfig(step.id, { taskDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe what needs to be done..."
                />
              </div>
            )}
          </div>
        );
    }
  };

  const StepCard = ({ step }: { step: Step; index: number }) => (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => toggleStep(step.id)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-shrink-0">
            {getStepIcon(step.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900">{getStepTitle(step)}</div>
            {!step.expanded && (
              <div className="text-sm text-gray-500 truncate">{getStepSubtitle(step)}</div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeStep(step.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          {step.expanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {step.expanded && (
        <div className="border-t border-gray-200">
          {renderStepContent(step)}
        </div>
      )}
    </div>
  );

  const AddStepButton = ({ index }: { index?: number }) => (
    <div className="relative">
      <button
        onClick={() => setShowStepMenu(index ?? -1)}
        className="w-full py-3 flex items-center justify-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors group"
      >
        <div className="h-px bg-gray-300 flex-1"></div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full border-2 border-dashed border-gray-300 group-hover:border-primary-400 bg-white">
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Add step</span>
        </div>
        <div className="h-px bg-gray-300 flex-1"></div>
      </button>

      {showStepMenu === (index ?? -1) && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 p-2 min-w-[250px]">
          <button
            onClick={() => addStep('email', index)}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left"
          >
            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900">Email</div>
              <div className="text-xs text-gray-500">Send an automated email</div>
            </div>
          </button>
          <button
            onClick={() => addStep('wait', index)}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 rounded-lg transition-colors text-left"
          >
            <ClockIcon className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-semibold text-gray-900">Wait</div>
              <div className="text-xs text-gray-500">Delay for a specified time</div>
            </div>
          </button>
          <button
            onClick={() => addStep('task', index)}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-lg transition-colors text-left"
          >
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-gray-900">Task</div>
              <div className="text-xs text-gray-500">Manual task to complete</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Sequence Settings */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Sequence Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sequence Name
              </label>
              <input
                type="text"
                value={sequenceName}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Contacts</option>
                <option>New Leads</option>
                <option>Warm Prospects</option>
                <option>Qualified Leads</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="weekdays"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="weekdays" className="text-sm text-gray-700">
                    Weekdays only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="business-hours"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="business-hours" className="text-sm text-gray-700">
                    Business hours (9 AM - 5 PM)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send From
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>sales@company.com</option>
                <option>support@company.com</option>
                <option>hello@company.com</option>
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Variables</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{first_name}}'}</code>
                <span className="text-xs">Contact first name</span>
              </div>
              <div className="flex items-center justify-between">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{company}}'}</code>
                <span className="text-xs">Company name</span>
              </div>
              <div className="flex items-center justify-between">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{title}}'}</code>
                <span className="text-xs">Job title</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Workflow Builder */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-6">
          {/* Start Indicator */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border-2 border-gray-300 p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">▶</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">Sequence Start</div>
                <div className="text-sm text-gray-600">Trigger: Contact added to sequence</div>
              </div>
            </div>
          </div>

          {/* Add first step */}
          {steps.length === 0 && <AddStepButton />}

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step.id}>
              <StepCard step={step} index={index} />
              <AddStepButton index={index} />
            </div>
          ))}

          {/* Empty State */}
          {steps.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Start Building Your Sequence</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Add steps to create your automated outreach sequence. You can send emails, add delays, and create tasks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Stats & Info */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Sequence Overview</h3>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Steps</span>
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{steps.length}</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Email Steps</span>
                <EnvelopeIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {steps.filter(s => s.type === 'email').length}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Duration</span>
                <ClockIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {steps.reduce((acc, step) => {
                  if (step.type === 'wait') {
                    return acc + (step.config.waitDays || 0);
                  }
                  return acc;
                }, 0)} days
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Best Practices</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Personalize each email with variables</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Wait 2-3 days between emails</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Keep sequences under 5 touchpoints</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Include clear call-to-actions</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Tips</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-sm">
                <ChartBarIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Short subject lines (under 50 chars) get 12% higher open rates</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <UserGroupIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Personalized emails have 26% higher click rates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showStepMenu !== null && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStepMenu(null)}
        />
      )}
    </div>
  );
};
