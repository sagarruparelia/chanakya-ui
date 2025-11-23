/**
 * GST Computation Screen - Based on UX Guidelines
 * Month picker, filing status, summary cards, tabs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
} from '@tamagui/lucide-icons';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  formatCurrency,
} from '@/constants/theme';

// Mock data
const mockGSTData = {
  month: 'January 2025',
  filingStatus: 'pending' as 'pending' | 'filed' | 'overdue',
  dueDate: '20 Feb 2025',
  outputGST: 27000,
  inputGST: 14400,
  netPayable: 12600,
  salesCount: 5,
  purchaseCount: 3,
  pendingVerification: 2,
};

export default function GSTScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const navigateMonth = (direction: 'prev' | 'next') => {
    console.log('Navigate', direction);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GST Computation</Text>
      </View>

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
        {/* Month Picker */}
        <View style={styles.monthPicker}>
          <Pressable
            style={styles.monthNavButton}
            onPress={() => navigateMonth('prev')}
            accessibilityLabel="Previous month"
          >
            <ChevronLeft size={24} color={colors.gray600 as any} />
          </Pressable>
          <Text style={styles.monthText}>{mockGSTData.month}</Text>
          <Pressable
            style={styles.monthNavButton}
            onPress={() => navigateMonth('next')}
            accessibilityLabel="Next month"
          >
            <ChevronRight size={24} color={colors.gray600 as any} />
          </Pressable>
        </View>

        {/* Filing Status Banner */}
        <View
          style={[
            styles.filingBanner,
            mockGSTData.filingStatus === 'filed' && styles.filedBanner,
            mockGSTData.filingStatus === 'overdue' && styles.overdueBanner,
          ]}
        >
          <View style={styles.filingContent}>
            {mockGSTData.filingStatus === 'filed' ? (
              <CheckCircle size={20} color={colors.statusSuccessText as any} />
            ) : (
              <Clock
                size={20}
                color={
                  (mockGSTData.filingStatus === 'overdue'
                    ? colors.statusErrorText
                    : colors.statusWarningText) as any
                }
              />
            )}
            <View>
              <Text
                style={[
                  styles.filingTitle,
                  mockGSTData.filingStatus === 'filed' && { color: colors.statusSuccessText },
                  mockGSTData.filingStatus === 'overdue' && { color: colors.statusErrorText },
                ]}
              >
                {mockGSTData.filingStatus === 'filed'
                  ? 'GSTR-3B Filed'
                  : mockGSTData.filingStatus === 'overdue'
                  ? 'Filing Overdue'
                  : 'Filing Pending'}
              </Text>
              <Text
                style={[
                  styles.filingSubtext,
                  mockGSTData.filingStatus === 'filed' && { color: colors.statusSuccessText },
                  mockGSTData.filingStatus === 'overdue' && { color: colors.statusErrorText },
                ]}
              >
                Due: {mockGSTData.dueDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <ArrowUp size={16} color={colors.error as any} />
            </View>
            <Text style={styles.summaryLabel}>Output GST</Text>
            <Text style={styles.summaryValue}>{formatCurrency(mockGSTData.outputGST)}</Text>
            <Text style={styles.summarySubtext}>{mockGSTData.salesCount} invoices</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={[styles.summaryIconContainer, { backgroundColor: colors.businessLight }]}>
              <ArrowDown size={16} color={colors.businessPrimary as any} />
            </View>
            <Text style={styles.summaryLabel}>Input GST</Text>
            <Text style={[styles.summaryValue, { color: colors.businessPrimary }]}>
              {formatCurrency(mockGSTData.inputGST)}
            </Text>
            <Text style={styles.summarySubtext}>{mockGSTData.purchaseCount} bills</Text>
          </Card>
        </View>

        {/* Net Payable */}
        <Card style={styles.netPayableCard}>
          <View style={styles.netPayableHeader}>
            <Text style={styles.netPayableLabel}>Net GST Payable</Text>
            <Text style={styles.netPayableValue}>{formatCurrency(mockGSTData.netPayable)}</Text>
          </View>
          <View style={styles.netPayableBreakdown}>
            <Text style={styles.breakdownText}>
              {formatCurrency(mockGSTData.outputGST)} - {formatCurrency(mockGSTData.inputGST)}
            </Text>
          </View>
        </Card>

        {/* Pending Verification Alert */}
        {mockGSTData.pendingVerification > 0 && (
          <Card style={styles.verificationCard}>
            <View style={styles.verificationContent}>
              <Clock size={20} color={colors.warning as any} />
              <View style={styles.verificationText}>
                <Text style={styles.verificationTitle}>Pending CA Verification</Text>
                <Text style={styles.verificationSubtext}>
                  {mockGSTData.pendingVerification} purchase bills need review
                </Text>
              </View>
            </View>
            <Badge variant="warning">{String(mockGSTData.pendingVerification)}</Badge>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => console.log('View Details')}
            accessibilityLabel="View GST computation details"
          >
            <Text style={styles.primaryButtonText}>View Full Computation</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => console.log('File GSTR-3B')}
            accessibilityLabel="File GSTR-3B return"
          >
            <Text style={styles.secondaryButtonText}>File GSTR-3B</Text>
          </Pressable>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
  },
  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  monthNavButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
  },
  monthText: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.gray900,
  },
  filingBanner: {
    backgroundColor: colors.statusWarning,
    padding: spacing.cardPadding,
    borderRadius: borderRadius.card,
    marginBottom: spacing.md,
  },
  filedBanner: {
    backgroundColor: colors.statusSuccess,
  },
  overdueBanner: {
    backgroundColor: colors.statusError,
  },
  filingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  filingTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.statusWarningText,
  },
  filingSubtext: {
    fontSize: typography.xs,
    color: colors.statusWarningText,
    marginTop: 2,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.statusError,
    opacity: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  summarySubtext: {
    fontSize: typography.xs,
    color: colors.gray400,
  },
  netPayableCard: {
    backgroundColor: colors.businessLight,
    marginBottom: spacing.md,
  },
  netPayableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netPayableLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.businessDark,
  },
  netPayableValue: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.businessDark,
  },
  netPayableBreakdown: {
    marginTop: spacing.sm,
  },
  breakdownText: {
    fontSize: typography.xs,
    color: colors.businessDark,
    opacity: 0.8,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  verificationSubtext: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  actionsContainer: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.businessPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    minHeight: spacing.touchTarget,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.base,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.businessPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    minHeight: spacing.touchTarget,
  },
  secondaryButtonText: {
    color: colors.businessPrimary,
    fontSize: typography.base,
    fontWeight: '600',
  },
});
