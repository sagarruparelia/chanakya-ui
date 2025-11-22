import { createTamagui, createTokens } from '@tamagui/core';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes as tamaguiThemes } from '@tamagui/themes';

// Design tokens from UX_ACCESSIBILITY_REQUIREMENTS.md
const tokens = createTokens({
  color: {
    // Primary - Chanakya Deep Blue from Figma
    primary: '#1E3A5F',
    primaryHover: '#2D5A8E',
    primaryPressed: '#152A45',
    onPrimary: '#FFFFFF',

    // Secondary
    secondary: '#10B981',
    secondaryHover: '#059669',
    accent: '#F59E0B',

    // Status
    error: '#DC2626',
    errorBg: '#FEF2F2',
    success: '#16A34A',
    successBg: '#F0FDF4',
    warning: '#D97706',
    warningBg: '#FFFBEB',
    info: '#2563EB',
    infoBg: '#EFF6FF',

    // Neutrals - Light
    background: '#FFFFFF',
    backgroundStrong: '#F9FAFB',
    backgroundSubtle: '#F3F4F6',
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textDisabled: '#D1D5DB',
    border: '#E5E7EB',
    borderStrong: '#D1D5DB',

    // Dark mode variants
    backgroundDark: '#0F172A',
    backgroundStrongDark: '#1E293B',
    backgroundSubtleDark: '#334155',
    textDark: '#F1F5F9',
    textSecondaryDark: '#94A3B8',
    textMutedDark: '#64748B',
    textDisabledDark: '#475569',
    borderDark: '#374151',
    borderStrongDark: '#4B5563',
    primaryDark: '#60A5FA',
    primaryHoverDark: '#93C5FD',
    primaryPressedDark: '#3B82F6',
    onPrimaryDark: '#0F172A',
    errorDark: '#F87171',
    errorBgDark: '#450A0A',
    successDark: '#4ADE80',
    successBgDark: '#052E16',
    warningDark: '#FBBF24',
    warningBgDark: '#451A03',
    infoDark: '#60A5FA',
    infoBgDark: '#1E3A5F',

    // Transparent
    transparent: 'transparent',
  },
  space: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    true: 16, // default
  },
  size: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    true: 44, // default touch target
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    true: 8, // default
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

// Create Inter font
const interFont = createInterFont({
  face: {
    400: { normal: 'Inter' },
    500: { normal: 'InterMedium' },
    600: { normal: 'InterSemiBold' },
    700: { normal: 'InterBold' },
  },
});

// Light theme
const lightTheme = {
  background: tokens.color.background,
  backgroundStrong: tokens.color.backgroundStrong,
  backgroundSubtle: tokens.color.backgroundSubtle,
  backgroundHover: tokens.color.backgroundSubtle,
  backgroundPress: tokens.color.border,
  backgroundFocus: tokens.color.backgroundSubtle,

  color: tokens.color.text,
  colorSecondary: tokens.color.textSecondary,
  colorMuted: tokens.color.textMuted,
  colorDisabled: tokens.color.textDisabled,
  colorHover: tokens.color.text,
  colorPress: tokens.color.text,
  colorFocus: tokens.color.text,

  borderColor: tokens.color.border,
  borderColorStrong: tokens.color.borderStrong,
  borderColorHover: tokens.color.borderStrong,
  borderColorPress: tokens.color.primary,
  borderColorFocus: tokens.color.primary,

  primary: tokens.color.primary,
  primaryHover: tokens.color.primaryHover,
  primaryPress: tokens.color.primaryPressed,
  onPrimary: tokens.color.onPrimary,

  secondary: tokens.color.secondary,
  accent: tokens.color.accent,

  error: tokens.color.error,
  errorBg: tokens.color.errorBg,
  success: tokens.color.success,
  successBg: tokens.color.successBg,
  warning: tokens.color.warning,
  warningBg: tokens.color.warningBg,
  info: tokens.color.info,
  infoBg: tokens.color.infoBg,

  shadowColor: 'rgba(0,0,0,0.1)',
  shadowColorStrong: 'rgba(0,0,0,0.2)',
};

// Dark theme
const darkTheme = {
  background: tokens.color.backgroundDark,
  backgroundStrong: tokens.color.backgroundStrongDark,
  backgroundSubtle: tokens.color.backgroundSubtleDark,
  backgroundHover: tokens.color.backgroundSubtleDark,
  backgroundPress: tokens.color.borderDark,
  backgroundFocus: tokens.color.backgroundSubtleDark,

  color: tokens.color.textDark,
  colorSecondary: tokens.color.textSecondaryDark,
  colorMuted: tokens.color.textMutedDark,
  colorDisabled: tokens.color.textDisabledDark,
  colorHover: tokens.color.textDark,
  colorPress: tokens.color.textDark,
  colorFocus: tokens.color.textDark,

  borderColor: tokens.color.borderDark,
  borderColorStrong: tokens.color.borderStrongDark,
  borderColorHover: tokens.color.borderStrongDark,
  borderColorPress: tokens.color.primaryDark,
  borderColorFocus: tokens.color.primaryDark,

  primary: tokens.color.primaryDark,
  primaryHover: tokens.color.primaryHoverDark,
  primaryPress: tokens.color.primaryPressedDark,
  onPrimary: tokens.color.onPrimaryDark,

  secondary: tokens.color.successDark,
  accent: tokens.color.warningDark,

  error: tokens.color.errorDark,
  errorBg: tokens.color.errorBgDark,
  success: tokens.color.successDark,
  successBg: tokens.color.successBgDark,
  warning: tokens.color.warningDark,
  warningBg: tokens.color.warningBgDark,
  info: tokens.color.infoDark,
  infoBg: tokens.color.infoBgDark,

  shadowColor: 'rgba(0,0,0,0.3)',
  shadowColorStrong: 'rgba(0,0,0,0.5)',
};

export const config = createTamagui({
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  fonts: {
    body: interFont,
    heading: interFont,
  },
  shorthands,
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  settings: {
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
  },
});

export default config;

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
