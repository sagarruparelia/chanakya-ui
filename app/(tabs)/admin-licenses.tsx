/**
 * System Admin - Licenses Management Screen
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
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Plus,
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

// Mock license data
const mockLicenses = [
  {
    id: '1',
    customerName: 'ABC Tax Consultants',
    plan: 'Professional',
    licenseKey: 'PRO-ABC-2024-001',
    status: 'active',
    expiresAt: '2025-08-15',
    seats: 10,
    usedSeats: 8,
  },
  {
    id: '2',
    customerName: 'XYZ Enterprises',
    plan: 'Enterprise',
    licenseKey: 'ENT-XYZ-2024-002',
    status: 'expiring_soon',
    expiresAt: '2024-12-01',
    seats: 50,
    usedSeats: 15,
  },
  {
    id: '3',
    customerName: 'Delta Corp',
    plan: 'Professional',
    licenseKey: 'PRO-DEL-2024-003',
    status: 'expired',
    expiresAt: '2024-11-15',
    seats: 20,
    usedSeats: 10,
  },
  {
    id: '4',
    customerName: 'Sharma & Associates',
    plan: 'Starter',
    licenseKey: 'STR-SHA-2024-004',
    status: 'active',
    expiresAt: '2025-10-10',
    seats: 5,
    usedSeats: 3,
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'active':
      return <CheckCircle size={16} color={colors.success} />;
    case 'expiring_soon':
      return <Clock size={16} color={colors.warning} />;
    case 'expired':
      return <AlertTriangle size={16} color={colors.error} />;
    default:
      return <Key size={16} color={colors.gray400} />;
  }
}

function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'expiring_soon':
      return 'warning';
    case 'expired':
      return 'error';
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

export default function AdminLicensesScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;

  const alertCount = mockLicenses.filter(
    l => l.status === 'expired' || l.status === 'expiring_soon'
  ).length;

  const content = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Action Bar */}
      <View style={styles.actionBar}>
        <Pressable style={styles.addButton}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Generate License</Text>
        </Pressable>
      </View>

      {/* Alerts */}
      {alertCount > 0 && (
        <Card style={styles.alertCard}>
          <View style={styles.alertContent}>
            <AlertTriangle size={24} color={colors.error} />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>{alertCount} licenses need attention</Text>
              <Text style={styles.alertDescription}>
                Some licenses are expired or expiring soon
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Stats */}
      <View style={[styles.statsRow, isWeb && styles.statsRowWeb]}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{mockLicenses.length}</Text>
          <Text style={styles.statLabel}>Total Licenses</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {mockLicenses.filter(l => l.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {mockLicenses.filter(l => l.status === 'expiring_soon').length}
          </Text>
          <Text style={styles.statLabel}>Expiring Soon</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {mockLicenses.filter(l => l.status === 'expired').length}
          </Text>
          <Text style={styles.statLabel}>Expired</Text>
        </Card>
      </View>

      {/* License List */}
      <Card style={styles.listCard}>
        {mockLicenses.map((license, index) => (
          <React.Fragment key={license.id}>
            <Pressable style={styles.licenseItem}>
              <View style={styles.licenseMain}>
                <View style={styles.licenseIcon}>
                  {getStatusIcon(license.status)}
                </View>
                <View style={styles.licenseInfo}>
                  <Text style={styles.licenseName}>{license.customerName}</Text>
                  <Text style={styles.licenseKey}>{license.licenseKey}</Text>
                </View>
              </View>
              <View style={styles.licenseMeta}>
                <Badge variant={getStatusVariant(license.status)}>
                  {license.status.replace('_', ' ')}
                </Badge>
                <Text style={styles.licensePlan}>{license.plan}</Text>
              </View>
              <View style={styles.licenseSeats}>
                <Text style={styles.seatsLabel}>Seats</Text>
                <Text style={styles.seatsValue}>
                  {license.usedSeats}/{license.seats}
                </Text>
              </View>
              <View style={styles.licenseExpiry}>
                <Text style={styles.expiryLabel}>Expires</Text>
                <Text style={[
                  styles.expiryValue,
                  license.status === 'expired' && styles.expiryExpired,
                  license.status === 'expiring_soon' && styles.expirySoon,
                ]}>
                  {formatDate(license.expiresAt)}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.gray400} />
            </Pressable>
            {index < mockLicenses.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>
    </ScrollView>
  );

  if (!isWeb) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.mobileHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.mobileTitle}>Licenses</Text>
            {alertCount > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{alertCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.mobileSubtitle}>Manage customer licenses</Text>
        </View>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <AdminLayout title="Licenses" subtitle="Manage customer licenses">
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  alertBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  alertBadgeText: {
    color: colors.white,
    fontSize: typography.xs,
    fontWeight: '600',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.businessPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#FEF2F2',
    marginBottom: spacing.md,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.error,
  },
  alertDescription: {
    fontSize: typography.xs,
    color: colors.gray600,
    marginTop: 2,
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
  licenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  licenseMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  licenseIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseInfo: {
    flex: 1,
  },
  licenseName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  licenseKey: {
    fontSize: typography.xs,
    color: colors.gray500,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  licenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  licensePlan: {
    fontSize: typography.xs,
    color: colors.gray600,
    fontWeight: '500',
  },
  licenseSeats: {
    alignItems: 'center',
  },
  seatsLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  seatsValue: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  licenseExpiry: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  expiryValue: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.gray900,
  },
  expiryExpired: {
    color: colors.error,
  },
  expirySoon: {
    color: colors.warning,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: spacing.md + 36 + spacing.sm,
  },
});
