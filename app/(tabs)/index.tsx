/**
 * Home Screen - Based on UX Guidelines
 * Gradient header, quick actions, stats cards, recent activity
 */

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Upload,
  Plus,
  Zap,
  ChevronRight,
  FileText,
} from '@tamagui/lucide-icons';

import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  formatCurrency,
} from '@/constants/theme';
import { useAppSelector } from '@/store';
import { selectCurrentUser } from '@/store/authSlice';

// Mock data - replace with actual API data
const mockStats = {
  monthlyRevenue: 250000,
  gstPayable: 45000,
  pendingVerification: 3,
  recentInvoices: [
    {
      id: '1',
      invoiceNo: 'INV-2025-001',
      customerName: 'Acme Corporation',
      amount: 118000,
      date: '2025-01-05',
    },
    {
      id: '2',
      invoiceNo: 'INV-2025-002',
      customerName: 'Beta Industries',
      amount: 75000,
      date: '2025-01-04',
    },
  ],
};

export default function HomeScreen() {
  const user = useAppSelector(selectCurrentUser);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch latest data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const businessName = user?.name || 'Your Business';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.businessPrimary, colors.businessDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.businessName}>{businessName}</Text>
          </View>

          <Pressable
            style={styles.aiButton}
            onPress={() => console.log('AI Assistant')}
            accessibilityLabel="Open AI Assistant"
          >
            <Zap size={16} color={colors.businessPrimary} />
            <Text style={styles.aiButtonText}>Ask AI</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.businessPrimary}
          />
        }
      >
        {/* Quick Actions Card (Overlapping Header) */}
        <Card style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Pressable
              style={styles.actionButton}
              onPress={() => console.log('Upload')}
              accessibilityLabel="Upload Document"
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.businessLight }]}>
                <Upload size={20} color={colors.businessPrimary} />
              </View>
              <Text style={styles.actionText}>Upload</Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() => console.log('Create Invoice')}
              accessibilityLabel="Create Invoice"
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.businessLight }]}>
                <Plus size={20} color={colors.businessPrimary} />
              </View>
              <Text style={styles.actionText}>Invoice</Text>
            </Pressable>
          </View>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            label="This Month"
            value={formatCurrency(mockStats.monthlyRevenue)}
            trend={{
              direction: 'up',
              value: '12% vs last month',
            }}
            variant="business"
          />
          <StatCard
            label="GST Payable"
            value={formatCurrency(mockStats.gstPayable)}
            subtext="Due: 20 Feb 2025"
            variant="business"
          />
        </View>

        {/* Pending Verification Alert */}
        {mockStats.pendingVerification > 0 && (
          <Pressable
            style={styles.alertCard}
            onPress={() => router.push('/(tabs)/gst')}
            accessibilityLabel={`${mockStats.pendingVerification} items pending CA verification`}
          >
            <View style={styles.alertContent}>
              <View style={styles.alertIconContainer}>
                <FileText size={20} color={colors.warning} />
              </View>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>Pending CA Verification</Text>
                <Text style={styles.alertSubtext}>
                  {mockStats.pendingVerification} items need review
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.gray400} />
          </Pressable>
        )}

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          {mockStats.recentInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              onPress={() => console.log('View invoice', invoice.id)}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <View>
                  <Text style={styles.activityTitle}>{invoice.invoiceNo}</Text>
                  <Text style={styles.activitySubtitle}>{invoice.customerName}</Text>
                </View>
                <Text style={styles.activityAmount}>
                  {formatCurrency(invoice.amount)}
                </Text>
              </View>
              <Text style={styles.activityDate}>{invoice.date}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.sm,
  },
  businessName: {
    color: colors.white,
    fontSize: typography['2xl'],
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  aiButtonText: {
    color: colors.businessPrimary,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
    paddingTop: 0,
  },
  quickActionsCard: {
    marginTop: -spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray50,
    minHeight: spacing.touchTarget,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.gray700,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.statusWarning,
    padding: spacing.cardPadding,
    borderRadius: borderRadius.card,
    marginTop: spacing.md,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.statusWarningText,
  },
  alertSubtext: {
    fontSize: typography.xs,
    color: colors.statusWarningText,
    marginTop: 2,
  },
  sectionContainer: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    fontSize: typography.sm,
    color: colors.businessPrimary,
    fontWeight: '500',
  },
  activityCard: {
    marginBottom: spacing.cardGap,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
  },
  activitySubtitle: {
    fontSize: typography.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.gray900,
  },
  activityDate: {
    fontSize: typography.xs,
    color: colors.gray400,
    marginTop: spacing.sm,
  },
});
