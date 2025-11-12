import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes, ThemeName } from '../themes';

const ThemeToggle: React.FC = () => {
  const { themeName, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      {Object.keys(themes).map((name) => {
        const theme = themes[name as ThemeName];
        const isActive = themeName === name;

        return (
          <button
            key={name}
            onClick={() => setTheme(name as ThemeName)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
            title={theme.description}
          >
            {theme.displayName}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
