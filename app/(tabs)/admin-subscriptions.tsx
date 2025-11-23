/**
 * System Admin - Subscriptions Management Screen
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
  CreditCard,
  TrendingUp,
  Calendar,
  ChevronRight,
  Download,
} from '@tamagui/lucide-icons';

import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';

// Mock subscription data
const mockSubscriptions = [
  {
    id: '1',
    customerName: 'ABC Tax Consultants',
    plan: 'Professional',
    amount: 5999,
    billingCycle: 'monthly',
    nextBilling: '2024-12-15',
    status: 'active',
    paymentMethod: '**** 4242',
  },
  {
    id: '2',
    customerName: 'XYZ Enterprises',
    plan: 'Enterprise',
    amount: 12999,
    billingCycle: 'monthly',
    nextBilling: '2024-12-01',
    status: 'active',
    paymentMethod: '**** 1234',
  },
  {
    id: '3',
    customerName: 'Delta Corp',
    plan: 'Professional',
    amount: 5999,
    billingCycle: 'monthly',
    nextBilling: '2024-11-20',
    status: 'past_due',
    paymentMethod: '**** 5678',
  },
  {
    id: '4',
    customerName: 'Sharma & Associates',
    plan: 'Starter',
    amount: 2999,
    billingCycle: 'monthly',
    nextBilling: '2024-12-10',
    status: 'active',
    paymentMethod: '**** 9012',
  },
  {
    id: '5',
    customerName: 'Rajesh Kumar',
    plan: 'Starter',
    amount: 0,
    billingCycle: 'trial',
    nextBilling: '2024-12-01',
    status: 'trialing',
    paymentMethod: 'N/A',
  },
];

function formatCurrency(amount: number): string {
  if (amount === 0) return 'Free Trial';
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}

function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'trialing':
      return 'info';
    case 'past_due':
      return 'error';
    case 'canceled':
      return 'warning';
    default:
      return 'info';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminSubscriptionsScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;

  const totalMRR = mockSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeCount = mockSubscriptions.filter(s => s.status === 'active').length;

  const content = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Action Bar */}
      <View style={styles.actionBar}>
        <Pressable style={styles.exportButton}>
          <Download size={20} color={colors.gray600} />
          <Text style={styles.exportButtonText}>Export</Text>
        </Pressable>
      </View>

      {/* Revenue Stats */}
      <View style={[styles.statsRow, isWeb && styles.statsRowWeb]}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingUp size={20} color={colors.success} />
          </View>
          <Text style={styles.statValue}>{formatCurrency(totalMRR)}</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <CreditCard size={20} color={colors.businessPrimary} />
          </View>
          <Text style={styles.statValue}>{mockSubscriptions.length}</Text>
          <Text style={styles.statLabel}>Total Subscriptions</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {mockSubscriptions.filter(s => s.status === 'past_due').length}
          </Text>
          <Text style={styles.statLabel}>Past Due</Text>
        </Card>
      </View>

      {/* Subscription List */}
      <Card style={styles.listCard}>
        {mockSubscriptions.map((subscription, index) => (
          <React.Fragment key={subscription.id}>
            <Pressable style={styles.subscriptionItem}>
              <View style={styles.subscriptionMain}>
                <View style={styles.subscriptionIcon}>
                  <CreditCard size={16} color={colors.businessPrimary} />
                </View>
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionName}>{subscription.customerName}</Text>
                  <Text style={styles.subscriptionPlan}>{subscription.plan}</Text>
                </View>
              </View>
              <View style={styles.subscriptionMeta}>
                <Badge variant={getStatusVariant(subscription.status)}>
                  {subscription.status.replace('_', ' ')}
                </Badge>
              </View>
              <View style={styles.subscriptionAmount}>
                <Text style={styles.amountValue}>{formatCurrency(subscription.amount)}</Text>
                <Text style={styles.amountLabel}>/{subscription.billingCycle}</Text>
              </View>
              <View style={styles.subscriptionBilling}>
                <View style={styles.billingRow}>
                  <Calendar size={12} color={colors.gray400} />
                  <Text style={styles.billingDate}>{formatDate(subscription.nextBilling)}</Text>
                </View>
                <Text style={styles.paymentMethod}>{subscription.paymentMethod}</Text>
              </View>
              <ChevronRight size={20} color={colors.gray400} />
            </Pressable>
            {index < mockSubscriptions.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>
    </ScrollView>
  );

  if (!isWeb) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.mobileHeader}>
          <Text style={styles.mobileTitle}>Subscriptions</Text>
          <Text style={styles.mobileSubtitle}>Manage billing and subscriptions</Text>
        </View>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <AdminLayout title="Subscriptions" subtitle="Manage billing and subscriptions">
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
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  exportButtonText: {
    color: colors.gray600,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statsRowWeb: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  statHeader: {
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.gray900,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  listCard: {
    padding: 0,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  subscriptionMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subscriptionIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.businessLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  subscriptionPlan: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  subscriptionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.gray900,
  },
  amountLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  subscriptionBilling: {
    alignItems: 'flex-end',
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  billingDate: {
    fontSize: typography.xs,
    color: colors.gray600,
  },
  paymentMethod: {
    fontSize: typography.xs,
    color: colors.gray400,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: spacing.md + 36 + spacing.sm,
  },
});
