import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeName, getTheme } from '../themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Load saved theme from localStorage or default to 'default'
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('reachbase-theme');
    return (saved as ThemeName) || 'default';
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme(themeName));

  // Update theme when themeName changes
  useEffect(() => {
    const theme = getTheme(themeName);
    setCurrentTheme(theme);
    localStorage.setItem('reachbase-theme', themeName);
  }, [themeName]);

  const handleSetTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeName,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
