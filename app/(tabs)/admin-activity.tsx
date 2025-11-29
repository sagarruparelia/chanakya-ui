/**
 * System Admin - Activity Log Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Activity,
  UserPlus,
  UserMinus,
  Key,
  CreditCard,
  AlertTriangle,
  FileText,
  Building2,
  Filter,
} from '@tamagui/lucide-icons';

import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'user_created',
    title: 'New user registered',
    description: 'John Doe joined ABC Tax Consultants',
    actor: 'System',
    timestamp: '2024-11-22T14:30:00',
    metadata: {
      customer: 'ABC Tax Consultants',
    },
  },
  {
    id: '2',
    type: 'subscription_updated',
    title: 'Subscription upgraded',
    description: 'XYZ Enterprises upgraded to Enterprise plan',
    actor: '',
    timestamp: '2024-11-22T12:15:00',
    metadata: {
      customer: 'XYZ Enterprises',
      oldPlan: 'Professional',
      newPlan: 'Enterprise',
    },
  },
  {
    id: '3',
    type: 'alert',
    title: 'Payment failed',
    description: 'Delta Corp payment failed - Insufficient funds',
    actor: 'System',
    timestamp: '2024-11-21T18:00:00',
    metadata: {
      customer: 'Delta Corp',
    },
  },
  {
    id: '4',
    type: 'license_generated',
    title: 'License generated',
    description: 'New license created for Sharma & Associates',
    actor: '',
    timestamp: '2024-11-21T10:30:00',
    metadata: {
      customer: 'Sharma & Associates',
    },
  },
  {
    id: '5',
    type: 'tenant_created',
    title: 'New customer onboarded',
    description: 'New CA firm registered: PQR Consultants',
    actor: 'System',
    timestamp: '2024-11-20T16:45:00',
    metadata: {
      customer: 'PQR Consultants',
    },
  },
  {
    id: '6',
    type: 'user_removed',
    title: 'User removed',
    description: 'Jane Smith removed from ABC Tax Consultants',
    actor: 'john@abctax.com',
    timestamp: '2024-11-20T09:00:00',
    metadata: {
      customer: 'ABC Tax Consultants',
    },
  },
  {
    id: '7',
    type: 'document_processed',
    title: 'Documents processed',
    description: '150 documents processed for Delta Corp',
    actor: 'System',
    timestamp: '2024-11-19T22:00:00',
    metadata: {
      customer: 'Delta Corp',
      count: 150,
    },
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'user_created':
      return <UserPlus size={16} color={colors.success} />;
    case 'user_removed':
      return <UserMinus size={16} color={colors.warning} />;
    case 'license_generated':
      return <Key size={16} color={colors.businessPrimary} />;
    case 'subscription_updated':
      return <CreditCard size={16} color="#8B5CF6" />;
    case 'alert':
      return <AlertTriangle size={16} color={colors.error} />;
    case 'document_processed':
      return <FileText size={16} color={colors.info} />;
    case 'tenant_created':
      return <Building2 size={16} color={colors.businessPrimary} />;
    default:
      return <Activity size={16} color={colors.gray400} />;
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'user_created':
      return '#DCFCE7';
    case 'user_removed':
      return '#FEF3C7';
    case 'license_generated':
      return colors.businessLight;
    case 'subscription_updated':
      return '#EDE9FE';
    case 'alert':
      return '#FEE2E2';
    case 'document_processed':
      return '#DBEAFE';
    case 'tenant_created':
      return colors.businessLight;
    default:
      return colors.gray100;
  }
}

function formatTimestamp(timestamp: string): { date: string; time: string } {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatTimestamp(timestamp).date;
}

export default function AdminActivityScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;

  const content = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <Pressable style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={[styles.filterChipText, styles.filterChipTextActive]}>All</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterChipText}>Users</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterChipText}>Billing</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterChipText}>Alerts</Text>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <Filter size={18} color={colors.gray600} />
        </Pressable>
      </View>

      {/* Activity Timeline */}
      <Card style={styles.timelineCard}>
        {mockActivities.map((activity, index) => {
          const { date, time } = formatTimestamp(activity.timestamp);
          return (
            <View key={activity.id} style={styles.activityItem}>
              {/* Timeline Line */}
              {index < mockActivities.length - 1 && (
                <View style={styles.timelineLine} />
              )}

              {/* Icon */}
              <View style={[
                styles.activityIcon,
                { backgroundColor: getActivityColor(activity.type) }
              ]}>
                {getActivityIcon(activity.type)}
              </View>

              {/* Content */}
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{getRelativeTime(activity.timestamp)}</Text>
                </View>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityActor}>by {activity.actor}</Text>
                  <Text style={styles.activityTimestamp}>{time}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );

  if (!isWeb) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.mobileHeader}>
          <Text style={styles.mobileTitle}>Activity</Text>
          <Text style={styles.mobileSubtitle}>Recent platform activity</Text>
        </View>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <AdminLayout title="Activity" subtitle="Recent platform activity">
      {content}
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  mobileHeader: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  mobileTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.gray900,
  },
  mobileSubtitle: {
    fontSize: typography.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterChipActive: {
    backgroundColor: colors.businessPrimary,
    borderColor: colors.businessPrimary,
  },
  filterChipText: {
    fontSize: typography.sm,
    color: colors.gray600,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  filterButton: {
    marginLeft: 'auto',
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  timelineCard: {
    padding: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 18,
    top: 36,
    bottom: 0,
    width: 2,
    backgroundColor: colors.gray200,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  activityTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  activityTime: {
    fontSize: typography.xs,
    color: colors.gray400,
    marginLeft: spacing.sm,
  },
  activityDescription: {
    fontSize: typography.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activityActor: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  activityTimestamp: {
    fontSize: typography.xs,
    color: colors.gray400,
  },
});
