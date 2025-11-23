/**
 * System Admin Overview Dashboard
 * Matches Figma design: system-admin-dashboard.png
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  User,
  AlertCircle,
  DollarSign,
} from '@tamagui/lucide-icons';

import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';

// Mock data matching the Figma design
const mockDashboardData = {
  totalRevenue: 2450000, // ₹24.5L
  mrr: 185000, // ₹185K
  arr: 2220000, // ₹22.2L
  revenueGrowth: 12.5,
  mrrGrowth: 15.2,
  totalCustomers: 142,
  activeCustomers: 128,
  customerTypes: {
    caOrgs: 45,
    enterprises: 23,
    individuals: 74,
  },
  criticalAlerts: 5,
  revenueByType: {
    caOrgs: {
      customers: 45,
      revenue: 1350000, // ₹13.5L
      avgPerCustomer: 30000, // ₹30K
      percentage: 55,
    },
    enterprises: {
      customers: 23,
      revenue: 950000, // ₹9.5L
      avgPerCustomer: 41000, // ₹41K
      percentage: 39,
    },
    individuals: {
      customers: 74,
      revenue: 150000, // ₹150K
      avgPerCustomer: 2027, // ₹2027
      percentage: 6,
    },
  },
};

// Format currency in Indian format
function formatCurrency(amount: number, showSymbol = true): string {
  const symbol = showSymbol ? '₹' : '';
  if (amount >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'alert';
  children?: React.ReactNode;
}

function StatsCard({ title, value, subtitle, icon, variant = 'default', children }: StatsCardProps) {
  const isAlert = variant === 'alert';

  return (
    <Card style={[styles.statsCard, isAlert && styles.statsCardAlert]}>
      <View style={styles.statsCardHeader}>
        <Text style={styles.statsCardTitle}>{title}</Text>
        {icon}
      </View>
      <Text style={[styles.statsCardValue, isAlert && styles.statsCardValueAlert]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.statsCardSubtitle, isAlert && styles.statsCardSubtitleAlert]}>
          {subtitle}
        </Text>
      )}
      {children}
    </Card>
  );
}

// Metric Card with Trend
interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendValue?: string;
  icon?: React.ReactNode;
}

function MetricCard({ title, value, trend, trendValue, icon }: MetricCardProps) {
  return (
    <Card style={styles.metricCard}>
      <View style={styles.metricCardHeader}>
        <Text style={styles.metricCardTitle}>{title}</Text>
        {icon || <TrendingUp size={18} color="#8B5CF6" />}
      </View>
      <Text style={styles.metricCardValue}>{value}</Text>
      {trend && (
        <View style={styles.metricTrend}>
          <TrendingUp size={14} color={colors.success} />
          <Text style={styles.metricTrendText}>{trendValue}</Text>
        </View>
      )}
    </Card>
  );
}

// Customer Type Card
interface CustomerTypeCardProps {
  title: string;
  icon: React.ReactNode;
  customers: number;
  revenue: number;
  avgPerCustomer: number;
  percentage: number;
  color: string;
}

function CustomerTypeCard({ title, icon, customers, revenue, avgPerCustomer, percentage, color }: CustomerTypeCardProps) {
  return (
    <View style={styles.customerTypeCard}>
      <View style={styles.customerTypeHeader}>
        {icon}
        <Text style={styles.customerTypeTitle}>{title}</Text>
      </View>
      <View style={styles.customerTypeStats}>
        <View style={styles.customerTypeStat}>
          <Text style={styles.customerTypeLabel}>Customers:</Text>
          <Text style={styles.customerTypeValue}>{customers}</Text>
        </View>
        <View style={styles.customerTypeStat}>
          <Text style={styles.customerTypeLabel}>Revenue:</Text>
          <Text style={styles.customerTypeValue}>{formatCurrency(revenue)}</Text>
        </View>
        <View style={styles.customerTypeStat}>
          <Text style={styles.customerTypeLabel}>Avg/Customer:</Text>
          <Text style={styles.customerTypeValue}>{formatCurrency(avgPerCustomer)}</Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.percentageText}>{percentage}% of total</Text>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const content = (
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
      {/* Top Stats Row */}
      <View style={[styles.statsRow, isWeb && styles.statsRowWeb]}>
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(mockDashboardData.totalRevenue)}
          subtitle={`MRR: ${formatCurrency(mockDashboardData.mrr)}`}
          icon={<TrendingUp size={18} color={colors.success} />}
        />
        <StatsCard
          title="Total Customers"
          value={String(mockDashboardData.totalCustomers)}
          subtitle={`${mockDashboardData.activeCustomers} active`}
          icon={<Users size={18} color={colors.businessPrimary} />}
        />
        <StatsCard
          title="Customer Types"
          value=""
          icon={<Building2 size={18} color={colors.gray400} />}
        >
          <View style={styles.customerTypesBreakdown}>
            <View style={styles.customerTypeRow}>
              <Text style={styles.customerTypeRowLabel}>CA Orgs:</Text>
              <Text style={styles.customerTypeRowValue}>{mockDashboardData.customerTypes.caOrgs}</Text>
            </View>
            <View style={styles.customerTypeRow}>
              <Text style={styles.customerTypeRowLabel}>Enterprises:</Text>
              <Text style={styles.customerTypeRowValue}>{mockDashboardData.customerTypes.enterprises}</Text>
            </View>
            <View style={styles.customerTypeRow}>
              <Text style={styles.customerTypeRowLabel}>Individuals:</Text>
              <Text style={styles.customerTypeRowValue}>{mockDashboardData.customerTypes.individuals}</Text>
            </View>
          </View>
        </StatsCard>
        <StatsCard
          title="Critical Alerts"
          value={String(mockDashboardData.criticalAlerts)}
          subtitle="Requires attention"
          icon={<AlertCircle size={18} color={colors.error} />}
          variant="alert"
        />
      </View>

      {/* Revenue Metrics Row */}
      <View style={[styles.metricsRow, isWeb && styles.metricsRowWeb]}>
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(mockDashboardData.totalRevenue)}
          trend="up"
          trendValue={`+${mockDashboardData.revenueGrowth}% vs last month`}
          icon={<DollarSign size={18} color="#22C55E" />}
        />
        <MetricCard
          title="MRR"
          value={formatCurrency(mockDashboardData.mrr)}
          trend="up"
          trendValue={`+${mockDashboardData.mrrGrowth}% month over month`}
        />
        <MetricCard
          title="ARR"
          value={formatCurrency(mockDashboardData.arr)}
          trendValue="Annual Run Rate"
        />
      </View>

      {/* Revenue by Customer Type */}
      <Card style={styles.revenueByTypeCard}>
        <Text style={styles.sectionTitle}>Revenue by Customer Type</Text>
        <View style={[styles.customerTypesGrid, isWeb && styles.customerTypesGridWeb]}>
          <CustomerTypeCard
            title="CA Organizations"
            icon={<Building2 size={20} color={colors.gray600} />}
            customers={mockDashboardData.revenueByType.caOrgs.customers}
            revenue={mockDashboardData.revenueByType.caOrgs.revenue}
            avgPerCustomer={mockDashboardData.revenueByType.caOrgs.avgPerCustomer}
            percentage={mockDashboardData.revenueByType.caOrgs.percentage}
            color="#3B82F6"
          />
          <CustomerTypeCard
            title="Enterprises"
            icon={<Briefcase size={20} color={colors.gray600} />}
            customers={mockDashboardData.revenueByType.enterprises.customers}
            revenue={mockDashboardData.revenueByType.enterprises.revenue}
            avgPerCustomer={mockDashboardData.revenueByType.enterprises.avgPerCustomer}
            percentage={mockDashboardData.revenueByType.enterprises.percentage}
            color="#8B5CF6"
          />
          <CustomerTypeCard
            title="Individuals"
            icon={<User size={20} color={colors.gray600} />}
            customers={mockDashboardData.revenueByType.individuals.customers}
            revenue={mockDashboardData.revenueByType.individuals.revenue}
            avgPerCustomer={mockDashboardData.revenueByType.individuals.avgPerCustomer}
            percentage={mockDashboardData.revenueByType.individuals.percentage}
            color="#D1D5DB"
          />
        </View>
      </Card>
    </ScrollView>
  );

  // For mobile, wrap with SafeAreaView
  if (!isWeb) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.mobileHeader}>
          <Text style={styles.mobileTitle}>Overview</Text>
          <Text style={styles.mobileSubtitle}>Manage all paid customers and subscriptions</Text>
        </View>
        {content}
      </SafeAreaView>
    );
  }

  // For web, use AdminLayout
  return (
    <AdminLayout title="Overview" subtitle="Manage all paid customers and subscriptions">
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
    paddingBottom: spacing.xl,
  },

  // Stats Cards Row
  statsRow: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statsRowWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsCard: {
    flex: 1,
    minWidth: 200,
    padding: spacing.md,
  },
  statsCardAlert: {
    backgroundColor: '#FFF7ED',
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statsCardTitle: {
    fontSize: typography.sm,
    color: colors.gray500,
    fontWeight: '500',
  },
  statsCardValue: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  statsCardValueAlert: {
    color: colors.error,
  },
  statsCardSubtitle: {
    fontSize: typography.sm,
    color: colors.success,
    fontWeight: '500',
  },
  statsCardSubtitleAlert: {
    color: colors.error,
  },

  // Customer Types Breakdown
  customerTypesBreakdown: {
    marginTop: spacing.sm,
  },
  customerTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  customerTypeRowLabel: {
    fontSize: typography.sm,
    color: colors.gray500,
  },
  customerTypeRowValue: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },

  // Metrics Row
  metricsRow: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricsRowWeb: {
    flexDirection: 'row',
  },
  metricCard: {
    flex: 1,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.gray200,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricCardTitle: {
    fontSize: typography.sm,
    color: colors.gray500,
    fontWeight: '500',
  },
  metricCardValue: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricTrendText: {
    fontSize: typography.sm,
    color: colors.success,
    fontWeight: '500',
  },

  // Revenue by Type
  revenueByTypeCard: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.lg,
  },
  customerTypesGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  customerTypesGridWeb: {
    flexDirection: 'row',
  },
  customerTypeCard: {
    flex: 1,
  },
  customerTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  customerTypeTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
  },
  customerTypeStats: {
    marginBottom: spacing.md,
  },
  customerTypeStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  customerTypeLabel: {
    fontSize: typography.sm,
    color: colors.gray500,
  },
  customerTypeValue: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  percentageText: {
    fontSize: typography.xs,
    color: colors.gray400,
    textAlign: 'right',
  },
});
