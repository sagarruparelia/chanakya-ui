/**
 * System Admin - Customers Management Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Filter,
  Building2,
  Briefcase,
  User,
  MoreVertical,
  ChevronRight,
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

// Mock customer data
const mockCustomers = [
  {
    id: '1',
    name: 'ABC Tax Consultants',
    email: 'contact@abctax.com',
    type: 'CA_ORG',
    plan: 'Professional',
    mrr: 5999,
    status: 'active',
    users: 8,
    clients: 45,
    createdAt: '2024-08-15',
  },
  {
    id: '2',
    name: 'XYZ Enterprises Pvt Ltd',
    email: 'accounts@xyz.com',
    type: 'ENTERPRISE',
    plan: 'Enterprise',
    mrr: 12999,
    status: 'active',
    users: 15,
    clients: 0,
    createdAt: '2024-09-01',
  },
  {
    id: '3',
    name: 'Sharma & Associates',
    email: 'info@sharmaassoc.com',
    type: 'CA_ORG',
    plan: 'Starter',
    mrr: 2999,
    status: 'active',
    users: 3,
    clients: 12,
    createdAt: '2024-10-10',
  },
  {
    id: '4',
    name: 'Rajesh Kumar',
    email: 'rajesh@email.com',
    type: 'INDIVIDUAL',
    plan: 'Starter',
    mrr: 999,
    status: 'trial',
    users: 1,
    clients: 0,
    createdAt: '2024-11-01',
  },
  {
    id: '5',
    name: 'Delta Corp',
    email: 'finance@deltacorp.in',
    type: 'ENTERPRISE',
    plan: 'Professional',
    mrr: 5999,
    status: 'overdue',
    users: 10,
    clients: 0,
    createdAt: '2024-07-20',
  },
];

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'CA_ORG':
      return <Building2 size={16} color={colors.businessPrimary} />;
    case 'ENTERPRISE':
      return <Briefcase size={16} color="#8B5CF6" />;
    default:
      return <User size={16} color={colors.gray500} />;
  }
}

function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'trial':
      return 'info';
    case 'overdue':
      return 'error';
    default:
      return 'warning';
  }
}

export default function AdminCustomersScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const content = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Search and Filters */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            placeholderTextColor={colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterButton}>
          <Filter size={20} color={colors.gray600} />
        </Pressable>
        <Pressable style={styles.addButton}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add Customer</Text>
        </Pressable>
      </View>

      {/* Customer Stats */}
      <View style={[styles.statsRow, isWeb && styles.statsRowWeb]}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{mockCustomers.length}</Text>
          <Text style={styles.statLabel}>Total Customers</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {mockCustomers.filter(c => c.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {mockCustomers.filter(c => c.status === 'trial').length}
          </Text>
          <Text style={styles.statLabel}>On Trial</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {mockCustomers.filter(c => c.status === 'overdue').length}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </Card>
      </View>

      {/* Customer List */}
      <Card style={styles.listCard}>
        {filteredCustomers.map((customer, index) => (
          <React.Fragment key={customer.id}>
            <Pressable style={styles.customerItem}>
              <View style={styles.customerMain}>
                <View style={styles.customerIcon}>
                  {getTypeIcon(customer.type)}
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerEmail}>{customer.email}</Text>
                </View>
              </View>
              <View style={styles.customerMeta}>
                <Badge variant={getStatusVariant(customer.status)}>
                  {customer.status}
                </Badge>
                <Text style={styles.customerPlan}>{customer.plan}</Text>
                <Text style={styles.customerMrr}>{formatCurrency(customer.mrr)}/mo</Text>
              </View>
              <View style={styles.customerActions}>
                <Text style={styles.customerUsers}>{customer.users} users</Text>
                <ChevronRight size={20} color={colors.gray400} />
              </View>
            </Pressable>
            {index < filteredCustomers.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>
    </ScrollView>
  );

  if (!isWeb) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.mobileHeader}>
          <Text style={styles.mobileTitle}>Customers</Text>
          <Text style={styles.mobileSubtitle}>Manage all platform customers</Text>
        </View>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <AdminLayout title="Customers" subtitle="Manage all platform customers">
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
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: typography.sm,
    color: colors.gray900,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.businessPrimary,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    height: 44,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
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
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  customerMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customerIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  customerEmail: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  customerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customerPlan: {
    fontSize: typography.xs,
    color: colors.gray600,
    fontWeight: '500',
  },
  customerMrr: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  customerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customerUsers: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: spacing.md + 36 + spacing.sm,
  },
});
