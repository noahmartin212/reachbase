import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon, badge: 5 },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Accounts', href: '/accounts', icon: BuildingOfficeIcon },
  { name: 'Pipeline', href: '/pipeline', icon: FunnelIcon },
  { name: 'Sequences', href: '/sequences', icon: RectangleStackIcon },
  { name: 'Templates', href: '/templates', icon: DocumentTextIcon },
  { name: 'Emails', href: '/emails', icon: EnvelopeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-2xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Reachbase</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </div>
              {item.badge && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-semibold text-white bg-red-500 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Settings & User info */}
        <div className="p-4 space-y-2">
          {/* Settings Link */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Cog6ToothIcon className="w-5 h-5 mr-3" />
            Settings
          </NavLink>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-base shadow-sm">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">User</p>
              <p className="text-xs text-gray-500 truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
