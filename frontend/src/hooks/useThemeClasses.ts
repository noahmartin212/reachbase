import { useTheme } from '../contexts/ThemeContext';

/**
 * Hook to get theme-aware class names
 * Usage: const tc = useThemeClasses();
 * Then use: className={tc.card}, className={tc.input}, etc.
 */
export const useThemeClasses = () => {
  const { currentTheme } = useTheme();

  return {
    // Card styles
    card: `bg-white ${currentTheme.styles.cardRounded} ${currentTheme.styles.cardShadow} ${currentTheme.styles.cardBorder}`,
    cardHeader: `px-6 py-4 border-b ${currentTheme.styles.dividerColor}`,
    cardBody: 'px-6 py-4',

    // Input styles
    input: `w-full px-3 py-2 ${currentTheme.styles.inputBorder} rounded-lg focus:outline-none ${currentTheme.styles.inputFocusRing} focus:border-transparent`,

    // Container/border styles
    border: currentTheme.styles.borderColor,
    borderHover: currentTheme.styles.borderColorHover,
    divider: currentTheme.styles.dividerColor,
    containerBorder: currentTheme.styles.containerBorder,

    // Header/layout borders
    headerBorder: `border-b ${currentTheme.styles.dividerColor}`,
    sidebarBorder: `border-r ${currentTheme.styles.dividerColor}`,

    // Dropdown/modal
    dropdown: `bg-white ${currentTheme.styles.cardRounded} shadow-xl ${currentTheme.styles.cardBorder}`,
    modal: `bg-white ${currentTheme.styles.cardRounded} shadow-2xl ${currentTheme.styles.cardBorder}`,
  };
};
