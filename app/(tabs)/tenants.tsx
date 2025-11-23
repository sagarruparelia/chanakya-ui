/**
 * Tenants Screen - CA Firms Management for SYSTEM_ADMIN
 * List of all CA firms/tenants on the platform
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Building2,
  Users,
  Search,
  Plus,
  ChevronRight,
} from '@tamagui/lucide-icons';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';

// Mock tenants data
const mockTenants = [
  {
    id: '1',
    name: 'ABC Associates',
    gstin: '29ABCDE1234F1Z5',
    ownerName: 'Rajesh Kumar',
    ownerEmail: 'rajesh@abcassociates.com',
    userCount: 5,
    clientCount: 25,
    status: 'active' as const,
    createdAt: '2024-12-15',
  },
  {
    id: '2',
    name: 'XYZ Consultants',
    gstin: '27XYZAB5678C2D6',
    ownerName: 'Priya Sharma',
    ownerEmail: 'priya@xyzconsultants.com',
    userCount: 3,
    clientCount: 18,
    status: 'active' as const,
    createdAt: '2024-11-20',
  },
  {
    id: '3',
    name: 'Delta Corp Advisors',
    gstin: '33DELTA9012E3F7',
    ownerName: 'Amit Patel',
    ownerEmail: 'amit@deltacorp.com',
    userCount: 8,
    clientCount: 42,
    status: 'active' as const,
    createdAt: '2024-10-01',
  },
  {
    id: '4',
    name: 'Sunrise Accounting',
    gstin: '24SUNRI3456G4H8',
    ownerName: 'Neha Gupta',
    ownerEmail: 'neha@sunriseacc.com',
    userCount: 2,
    clientCount: 12,
    status: 'inactive' as const,
    createdAt: '2024-09-10',
  },
];

interface TenantCardProps {
  tenant: typeof mockTenants[0];
}

function TenantCard({ tenant }: TenantCardProps) {
  return (
    <Card
      onPress={() => console.log('View tenant', tenant.id)}
      style={styles.tenantCard}
    >
      <View style={styles.tenantHeader}>
        <View style={styles.tenantIcon}>
          <Building2 size={24} color="#6366F1" />
        </View>
        <View style={styles.tenantInfo}>
          <View style={styles.tenantNameRow}>
            <Text style={styles.tenantName}>{tenant.name}</Text>
            <Badge
              variant={tenant.status === 'active' ? 'success' : 'default'}
              size="sm"
            >
              {tenant.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </View>
          <Text style={styles.tenantGstin}>{tenant.gstin}</Text>
        </View>
      </View>

      <View style={styles.tenantDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Owner</Text>
          <Text style={styles.detailValue}>{tenant.ownerName}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Users</Text>
          <Text style={styles.detailValue}>{tenant.userCount}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Clients</Text>
          <Text style={styles.detailValue}>{tenant.clientCount}</Text>
        </View>
      </View>

      <View style={styles.tenantFooter}>
        <Text style={styles.createdAt}>Created: {tenant.createdAt}</Text>
        <ChevronRight size={16} color={colors.gray400 as any} />
      </View>
    </Card>
  );
}

export default function TenantsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CA Firms</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => console.log('Search')}
            accessibilityLabel="Search tenants"
          >
            <Search size={20} color={colors.gray600 as any} />
          </Pressable>
          <Pressable
            style={styles.addButton}
            onPress={() => console.log('Add tenant')}
            accessibilityLabel="Add new CA firm"
          >
            <Plus size={20} color={colors.white as any} />
          </Pressable>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockTenants.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockTenants.filter(t => t.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockTenants.reduce((sum, t) => sum + t.userCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
      </View>

      {/* Tenant List */}
      <FlatList
        data={mockTenants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TenantCard tenant={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building2 size={48} color={colors.gray300 as any} />
            <Text style={styles.emptyTitle}>No CA firms yet</Text>
            <Text style={styles.emptySubtext}>
              Create the first CA firm to get started
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.gray900,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  addButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: '#6366F1',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.gray900,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.xs,
  },
  listContent: {
    padding: spacing.screenPadding,
    gap: spacing.cardGap,
  },
  tenantCard: {
    marginBottom: 0,
  },
  tenantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tenantIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tenantInfo: {
    flex: 1,
  },
  tenantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tenantName: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  tenantGstin: {
    fontSize: typography.xs,
    color: colors.gray500,
    fontFamily: 'monospace',
  },
  tenantDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  detailValue: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.gray900,
    marginTop: 2,
  },
  tenantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createdAt: {
    fontSize: typography.xs,
    color: colors.gray400,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
