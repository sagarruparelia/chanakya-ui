/**
 * Chanakya Theme - Based on UX Guidelines
 * Follow docs/UX_GUIDELINES.md strictly
 */

import { Platform } from 'react-native';

// Theme Colors
export const colors = {
  // Business theme (Green)
  businessPrimary: '#10B981',
  businessLight: '#D1FAE5',
  businessDark: '#059669',

  // CA theme (Navy Blue)
  caPrimary: '#1E3A5F',
  caLight: '#DBEAFE',
  caDark: '#1E40AF',

  // Semantic colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Status badge backgrounds
  statusSuccess: '#DCFCE7',
  statusSuccessText: '#166534',
  statusWarning: '#FEF3C7',
  statusWarningText: '#92400E',
  statusError: '#FEE2E2',
  statusErrorText: '#991B1B',
  statusInfo: '#DBEAFE',
  statusInfoText: '#1E40AF',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',

  // Badge/notification
  badge: '#EF4444',
};

// Typography
export const typography = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,

  // Component specific
  touchTarget: 48,
  cardPadding: 16,
  screenPadding: 16,
  sectionGap: 24,
  cardGap: 12,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,

  // Component specific
  card: 12,
  button: 8,
  input: 8,
  badge: 6,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Platform-specific fonts
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Navigation heights
export const navigation = {
  bottomTabHeight: Platform.OS === 'ios' ? 88 : 56,
  bottomTabHeightWithoutSafeArea: 56,
  statusBarHeight: Platform.OS === 'ios' ? 44 : 24,
};

// Legacy Colors export for backward compatibility
const tintColorLight = colors.businessPrimary;
const tintColorDark = colors.white;

export const Colors = {
  light: {
    text: colors.gray900,
    background: colors.white,
    tint: tintColorLight,
    icon: colors.gray500,
    tabIconDefault: colors.gray500,
    tabIconSelected: tintColorLight,
    primary: colors.businessPrimary,
    card: colors.white,
    border: colors.gray200,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: colors.businessPrimary,
    card: colors.gray800,
    border: colors.gray700,
  },
};

// Helper function for Indian currency formatting
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Export default theme for convenience
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  navigation,
};

export default theme;
