/**
 * Card Component - Based on UX Guidelines
 * 16px padding, 12px border radius, shadow
 */

import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  onPress,
  style,
  variant = 'elevated',
  padding = 'md',
}: CardProps) {
  const Container = onPress ? Pressable : View;

  const paddingValue = {
    none: 0,
    sm: spacing.sm,
    md: spacing.cardPadding,
    lg: spacing.lg,
  }[padding];

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.card,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'default' && styles.default,
        { padding: paddingValue },
        pressed && onPress && styles.pressed,
        style,
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: 'transparent',
  },
  default: {
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});

export default Card;
