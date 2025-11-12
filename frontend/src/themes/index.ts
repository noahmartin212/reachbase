// Theme Configuration System
// Allows easy switching between visual style variants

export interface Theme {
  name: string;
  displayName: string;
  description: string;
  styles: {
    // Border styles
    borderWidth: string;
    borderColor: string;
    borderColorHover: string;
    dividerColor: string;

    // Card styles
    cardBorder: string;
    cardShadow: string;
    cardRounded: string;

    // Input styles
    inputBorder: string;
    inputFocusRing: string;

    // Container styles
    containerBorder: string;

    // Button styles
    buttonBorder: string;
  };
}

// Default theme - Current design with visible strokes
export const defaultTheme: Theme = {
  name: 'default',
  displayName: 'Default',
  description: 'Clean, structured design with defined borders',
  styles: {
    borderWidth: 'border',
    borderColor: 'border-gray-200',
    borderColorHover: 'border-gray-300',
    dividerColor: 'border-gray-200',

    cardBorder: 'border border-gray-200',
    cardShadow: 'shadow-sm',
    cardRounded: 'rounded-lg',

    inputBorder: 'border border-gray-300',
    inputFocusRing: 'focus:ring-2 focus:ring-primary-500',

    containerBorder: 'border border-gray-200',

    buttonBorder: 'border-0',
  },
};

// Softer theme - Reduced strokes for a gentler appearance
export const softerTheme: Theme = {
  name: 'softer',
  displayName: 'Softer',
  description: 'Gentler design with minimal borders and soft shadows',
  styles: {
    borderWidth: 'border-0',
    borderColor: 'border-transparent',
    borderColorHover: 'border-gray-100',
    dividerColor: 'border-gray-100',

    cardBorder: 'border-0',
    cardShadow: 'shadow-md',
    cardRounded: 'rounded-xl',

    inputBorder: 'border border-gray-200',
    inputFocusRing: 'focus:ring-1 focus:ring-primary-400',

    containerBorder: 'border-0',

    buttonBorder: 'border-0',
  },
};

// Theme registry
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  softer: softerTheme,
};

export type ThemeName = keyof typeof themes;

// Helper function to get theme
export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || defaultTheme;
};

// Helper function to build class names from theme
export const buildThemeClasses = (theme: Theme, type: keyof Theme['styles']): string => {
  return theme.styles[type];
};
