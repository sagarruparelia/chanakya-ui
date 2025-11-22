/**
 * Badge Component - Based on UX Guidelines
 * Always use icon + color + text for accessibility
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '@/constants/theme';
import { CheckCircle, Clock, AlertCircle, Info } from '@tamagui/lucide-icons';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  showIcon?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  showIcon = true,
}: BadgeProps) {
  const variantStyles = {
    success: {
      backgroundColor: colors.statusSuccess,
      textColor: colors.statusSuccessText,
      Icon: CheckCircle,
    },
    warning: {
      backgroundColor: colors.statusWarning,
      textColor: colors.statusWarningText,
      Icon: Clock,
    },
    error: {
      backgroundColor: colors.statusError,
      textColor: colors.statusErrorText,
      Icon: AlertCircle,
    },
    info: {
      backgroundColor: colors.statusInfo,
      textColor: colors.statusInfoText,
      Icon: Info,
    },
    default: {
      backgroundColor: colors.gray100,
      textColor: colors.gray700,
      Icon: null,
    },
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: typography.xs - 2,
      iconSize: 10,
    },
    md: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: typography.xs,
      iconSize: 12,
    },
    lg: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontSize: typography.sm,
      iconSize: 14,
    },
  };

  const { backgroundColor, textColor, Icon } = variantStyles[variant];
  const { paddingHorizontal, paddingVertical, fontSize, iconSize } = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingHorizontal,
          paddingVertical,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${children}`}
    >
      {showIcon && Icon && (
        <Icon
          size={iconSize}
          color={textColor as any}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.badge,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
