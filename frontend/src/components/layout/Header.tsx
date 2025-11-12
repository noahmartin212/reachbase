import React, { useState } from 'react';
import {
  BellIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  onMenuClick: () => void;
}

interface AINotification {
  id: number;
  type: 'hot_lead' | 'urgent_task' | 'opportunity' | 'alert';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  time: string;
  actionLabel: string;
  actionUrl?: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AINotification[]>([
    {
      id: 1,
      type: 'hot_lead',
      icon: FireIcon,
      title: 'Hot Lead Alert',
      message: 'John Smith (Enterprise Corp) opened your email 5 times. Strike now!',
      time: '5 min ago',
      actionLabel: 'Contact Now',
      actionUrl: '/contacts',
      read: false,
    },
    {
      id: 2,
      type: 'urgent_task',
      icon: ClockIcon,
      title: 'Urgent Task Due',
      message: 'Follow up with Jane Doe - proposal expires in 2 hours',
      time: '15 min ago',
      actionLabel: 'View Task',
      actionUrl: '/tasks',
      read: false,
    },
    {
      id: 3,
      type: 'opportunity',
      icon: SparklesIcon,
      title: 'AI Opportunity Detected',
      message: 'Perfect time to send to 12 contacts based on their engagement patterns',
      time: '1 hour ago',
      actionLabel: 'Review',
      actionUrl: '/emails',
      read: false,
    },
    {
      id: 4,
      type: 'alert',
      icon: ExclamationTriangleIcon,
      title: 'Stale Leads Alert',
      message: '8 high-value leads not contacted in 14+ days',
      time: '2 hours ago',
      actionLabel: 'Re-engage',
      actionUrl: '/contacts',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'hot_lead':
        return 'bg-red-50 border-red-200';
      case 'urgent_task':
        return 'bg-orange-50 border-orange-200';
      case 'opportunity':
        return 'bg-primary-50 border-primary-200';
      case 'alert':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'hot_lead':
        return 'text-red-600';
      case 'urgent_task':
        return 'text-orange-600';
      case 'opportunity':
        return 'text-primary-600';
      case 'alert':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Toggle sidebar"
          >
            {/* Custom sidebar toggle icon - square with left rectangle */}
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
              <rect x="3" y="4" width="6" height="16" rx="2" fill="currentColor" opacity="0.2" />
              <line x1="9" y1="4" x2="9" y2="20" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* AI Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <BellIcon className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5 text-primary-600" />
                      <h3 className="text-sm font-semibold text-gray-900">AI Insights</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Mark all read
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <BellIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg border flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                                <Icon className={`w-4 h-4 ${getIconColor(notification.type)}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {notification.title}
                                  </h4>
                                  <button
                                    onClick={() => dismissNotification(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400">{notification.time}</span>
                                  <div className="flex items-center gap-2">
                                    {!notification.read && (
                                      <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                      >
                                        <CheckIcon className="w-3 h-3 mr-1" />
                                        Mark read
                                      </button>
                                    )}
                                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                                      {notification.actionLabel} →
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button className="text-xs font-medium text-primary-600 hover:text-primary-700 w-full text-center">
                        View All Insights →
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
