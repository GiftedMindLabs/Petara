export const colors = {
  light: {
    // Primary colors
    primary: '#0D9488',
    primaryLight: '#14B8A6',
    primaryDark: '#0F766E',
    primaryContrast: '#FFFFFF',

    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',

    // Surface colors (cards, modals, etc)
    surface: '#FFFFFF',
    surfaceSecondary: '#F9FAFB',
    surfaceBorder: '#F3F4F6',

    // Text colors
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textContrast: '#FFFFFF',

    // Status colors
    success: '#22C55E',
    warning: '#F97316',
    error: '#EF4444',
    info: '#3B82F6',

    // Divider and border colors
    divider: '#E5E7EB',
    border: '#F3F4F6',
    borderFocus: '#0D9488',

    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',

    // Specific UI elements
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E7EB',
    inputPlaceholder: '#9CA3AF',
    
    cardBackground: '#FFFFFF',
    cardBorder: '#F3F4F6',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    // Primary colors
    primary: '#2DD4BF',
    primaryLight: '#5EEAD4',
    primaryDark: '#14B8A6',
    primaryContrast: '#0F172A',

    // Background colors
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',

    // Surface colors
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    surfaceBorder: '#475569',

    // Text colors
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textContrast: '#0F172A',

    // Status colors
    success: '#4ADE80',
    warning: '#FB923C',
    error: '#F87171',
    info: '#60A5FA',

    // Divider and border colors
    divider: '#334155',
    border: '#475569',
    borderFocus: '#2DD4BF',

    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',

    // Specific UI elements
    inputBackground: '#1E293B',
    inputBorder: '#334155',
    inputPlaceholder: '#94A3B8',
    
    cardBackground: '#1E293B',
    cardBorder: '#334155',
    cardShadow: 'rgba(0, 0, 0, 0.2)',
  }
} as const;

export type ColorScheme = typeof colors.light;
export type ThemeMode = keyof typeof colors; 