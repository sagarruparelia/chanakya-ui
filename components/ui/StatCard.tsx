/**
 * StatCard Component - Based on UX Guidelines
 * For displaying stats with label, value, and optional trend
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, typography, spacing } from '@/constants/theme';
import { TrendingUp, TrendingDown } from '@tamagui/lucide-icons';

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'business' | 'ca' | 'neutral';
  onPress?: () => void;
}

export function StatCard({
  label,
  value,
  trend,
  subtext,
  icon,
  variant = 'neutral',
  onPress,
}: StatCardProps) {
  const accentColor = {
    business: colors.businessPrimary,
    ca: colors.caPrimary,
    neutral: colors.gray500,
  }[variant];

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <Text style={styles.label}>{label}</Text>

      <Text style={[styles.value, { color: colors.gray900 }]}>
        {value}
      </Text>

      {trend && (
        <View style={styles.trendContainer}>
          {trend.direction === 'up' ? (
            <TrendingUp size={12} color={colors.success as any} />
          ) : (
            <TrendingDown size={12} color={colors.error as any} />
          )}
          <Text
            style={[
              styles.trendText,
              {
                color: trend.direction === 'up' ? colors.success : colors.error,
              },
            ]}
          >
            {trend.value}
          </Text>
        </View>
      )}

      {subtext && !trend && (
        <Text style={styles.subtext}>{subtext}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.sm,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
  subtext: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
});

export default StatCard;
