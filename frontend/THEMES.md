# Theme System Guide

## Overview
The Reachbase app now has a flexible theme system that allows you to easily switch between visual style variants. This makes it simple to experiment with different designs without manually changing CSS classes throughout the codebase.

## Current Themes

### 1. **Default** (Current Design)
- Clean, structured design with defined borders
- Border width: 1px (`border`)
- Border colors: gray-200 / gray-300
- Shadow: Small (`shadow-sm`)
- Rounded corners: `rounded-lg`

### 2. **Softer** (Minimal Strokes)
- Gentler design with minimal borders and soft shadows
- Border width: None (`border-0`)
- Borders removed from cards and containers
- Shadow: Medium (`shadow-md`) to create depth without strokes
- Rounded corners: Extra large (`rounded-xl`)
- Input borders: Lighter gray-200 instead of gray-300
- Focus rings: Thinner (1px instead of 2px)

## How to Switch Themes

### In the UI
Look for the **theme toggle buttons** in the header (top right area). Click between:
- **Default** - Original design
- **Softer** - Reduced strokes design

Your theme preference is automatically saved to localStorage and persists across sessions.

### Programmatically
```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { themeName, setTheme } = useTheme();

  // Switch to softer theme
  setTheme('softer');

  // Switch to default theme
  setTheme('default');
}
```

## Using Themes in Components

### Method 1: useThemeClasses Hook (Recommended)
```tsx
import { useThemeClasses } from '../hooks/useThemeClasses';

function MyComponent() {
  const tc = useThemeClasses();

  return (
    <div className={tc.card}>
      <div className={tc.cardHeader}>Header</div>
      <div className={tc.cardBody}>Content</div>
    </div>
  );
}
```

Available theme classes:
- `tc.card` - Card container
- `tc.cardHeader` - Card header with bottom border
- `tc.cardBody` - Card content area
- `tc.input` - Form inputs
- `tc.border` - Border color
- `tc.borderHover` - Border color on hover
- `tc.divider` - Horizontal/vertical dividers
- `tc.containerBorder` - Generic container border
- `tc.headerBorder` - Header bottom border
- `tc.sidebarBorder` - Sidebar right border
- `tc.dropdown` - Dropdown/select menus
- `tc.modal` - Modal dialogs

### Method 2: Direct Theme Access
```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { currentTheme } = useTheme();

  return (
    <div className={`bg-white ${currentTheme.styles.cardBorder} ${currentTheme.styles.cardRounded}`}>
      Content
    </div>
  );
}
```

## Updated Components

The following components have been updated to use the theme system:
- ✅ [Header.tsx](src/components/layout/Header.tsx) - Header border, notification dropdown
- ✅ [Sidebar.tsx](src/components/layout/Sidebar.tsx) - Sidebar border, dividers
- ✅ [Dashboard.tsx](src/pages/Dashboard.tsx) - All cards, containers, stats
- ✅ [ThemeToggle.tsx](src/components/ThemeToggle.tsx) - Theme switcher UI

## Creating New Themes

To add a new theme variant:

1. Open [frontend/src/themes/index.ts](src/themes/index.ts)

2. Create a new theme object:
```tsx
export const yourTheme: Theme = {
  name: 'yourtheme',
  displayName: 'Your Theme',
  description: 'Brief description',
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
```

3. Add to the themes registry:
```tsx
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  softer: softerTheme,
  yourtheme: yourTheme, // Add here
};
```

4. The new theme will automatically appear in the theme toggle!

## File Structure

```
frontend/src/
├── themes/
│   └── index.ts                 # Theme definitions
├── contexts/
│   └── ThemeContext.tsx         # Theme state management
├── hooks/
│   └── useThemeClasses.ts       # Helper hook for theme classes
├── components/
│   └── ThemeToggle.tsx          # UI for switching themes
└── App.tsx                      # ThemeProvider wrapper
```

## Tips for Experimenting

1. **Start with the Softer theme** - Click "Softer" in the header to see the reduced stroke design
2. **Compare side-by-side** - Keep two browser windows open with different themes
3. **Check different pages** - Navigate to Dashboard, Pipeline, Emails, etc.
4. **Test interactions** - Hover over cards, open dropdowns, check modals
5. **Create variants** - Easily add new themes for different experiments

## Next Steps

To update more components:
1. Import the hook: `import { useThemeClasses } from '../hooks/useThemeClasses';`
2. Call the hook: `const tc = useThemeClasses();`
3. Replace hardcoded classes with theme classes:
   - `border border-gray-200` → `{tc.containerBorder}`
   - `rounded-lg shadow-sm border border-gray-200` → `{tc.card}`
   - `border-b border-gray-200` → `border-b {tc.divider}`

## Comparison

| Element | Default Theme | Softer Theme |
|---------|---------------|--------------|
| Card borders | 1px gray-200 | None (shadow only) |
| Card shadows | Small | Medium |
| Card corners | Rounded (8px) | Extra rounded (12px) |
| Input borders | 1px gray-300 | 1px gray-200 |
| Focus rings | 2px primary-500 | 1px primary-400 |
| Divider lines | 1px gray-200 | 1px gray-100 |
| Overall feel | Structured, defined | Soft, minimal |
