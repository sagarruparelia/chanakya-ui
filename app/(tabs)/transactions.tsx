/**
 * Transactions Screen - Based on UX Guidelines
 * Card-based list of sales invoices and purchase bills
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
import { ChevronDown, Eye } from '@tamagui/lucide-icons';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  formatCurrency,
} from '@/constants/theme';

type TabType = 'sales' | 'purchases';

// Mock data
const mockSalesInvoices = [
  {
    id: '1',
    invoiceNo: 'INV-2025-001',
    customerName: 'Acme Corporation',
    date: '2025-01-05',
    baseAmount: 100000,
    cgst: 9000,
    sgst: 9000,
    igst: 0,
    totalAmount: 118000,
  },
  {
    id: '2',
    invoiceNo: 'INV-2025-002',
    customerName: 'Beta Industries',
    date: '2025-01-04',
    baseAmount: 63559,
    cgst: 5720,
    sgst: 5720,
    igst: 0,
    totalAmount: 75000,
  },
];

const mockPurchaseBills = [
  {
    id: '1',
    billNo: 'BILL-2025-001',
    vendorName: 'Supplier Co.',
    date: '2025-01-03',
    baseAmount: 50000,
    cgst: 4500,
    sgst: 4500,
    igst: 0,
    totalAmount: 59000,
    verified: true,
  },
  {
    id: '2',
    billNo: 'BILL-2025-002',
    vendorName: 'Materials Inc.',
    date: '2025-01-02',
    baseAmount: 30000,
    cgst: 2700,
    sgst: 2700,
    igst: 0,
    totalAmount: 35400,
    verified: false,
  },
];

interface InvoiceCardProps {
  invoice: typeof mockSalesInvoices[0];
}

function InvoiceCard({ invoice }: InvoiceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={styles.card}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.invoiceNo}>{invoice.invoiceNo}</Text>
            <Text style={styles.customerName}>{invoice.customerName}</Text>
          </View>
          <Text style={styles.amount}>{formatCurrency(invoice.totalAmount)}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{invoice.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total GST</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(invoice.cgst + invoice.sgst + invoice.igst)}
            </Text>
          </View>
        </View>

        {/* Expand Toggle */}
        <View style={styles.expandToggle}>
          <ChevronDown
            size={16}
            color={colors.gray400}
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
          <Text style={styles.expandText}>
            {expanded ? 'Hide' : 'Show'} GST Breakdown
          </Text>
        </View>

        {/* Expanded Content */}
        {expanded && (
          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>CGST</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(invoice.cgst)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>SGST</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(invoice.sgst)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>IGST</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(invoice.igst)}</Text>
            </View>
          </View>
        )}
      </Pressable>

      {/* Action Button */}
      <Pressable
        style={styles.actionButton}
        onPress={() => console.log('View', invoice.id)}
        accessibilityLabel={`View invoice ${invoice.invoiceNo}`}
      >
        <Eye size={16} color={colors.white} />
        <Text style={styles.actionButtonText}>View Invoice</Text>
      </Pressable>
    </Card>
  );
}

interface BillCardProps {
  bill: typeof mockPurchaseBills[0];
}

function BillCard({ bill }: BillCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={styles.card}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.invoiceNo}>{bill.billNo}</Text>
            <Text style={styles.customerName}>{bill.vendorName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.amount}>{formatCurrency(bill.totalAmount)}</Text>
            <Badge
              variant={bill.verified ? 'success' : 'warning'}
              size="sm"
            >
              {bill.verified ? 'Verified' : 'Pending'}
            </Badge>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{bill.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>GST Credit</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>
              {formatCurrency(bill.cgst + bill.sgst + bill.igst)}
            </Text>
          </View>
        </View>

        {/* Expand Toggle */}
        <View style={styles.expandToggle}>
          <ChevronDown
            size={16}
            color={colors.gray400}
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
          <Text style={styles.expandText}>
            {expanded ? 'Hide' : 'Show'} GST Breakdown
          </Text>
        </View>

        {/* Expanded Content */}
        {expanded && (
          <View style={[styles.breakdown, { backgroundColor: colors.businessLight }]}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>CGST Credit</Text>
              <Text style={[styles.breakdownValue, { color: colors.businessPrimary }]}>
                {formatCurrency(bill.cgst)}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>SGST Credit</Text>
              <Text style={[styles.breakdownValue, { color: colors.businessPrimary }]}>
                {formatCurrency(bill.sgst)}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>IGST Credit</Text>
              <Text style={[styles.breakdownValue, { color: colors.businessPrimary }]}>
                {formatCurrency(bill.igst)}
              </Text>
            </View>
          </View>
        )}
      </Pressable>

      {/* Action Button */}
      <Pressable
        style={styles.actionButton}
        onPress={() => console.log('View', bill.id)}
        accessibilityLabel={`View bill ${bill.billNo}`}
      >
        <Eye size={16} color={colors.white} />
        <Text style={styles.actionButtonText}>View Bill</Text>
      </Pressable>
    </Card>
  );
}

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('sales');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'sales' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('sales')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'sales' && styles.activeTabText,
            ]}
          >
            Sales Invoices
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'purchases' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('purchases')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'purchases' && styles.activeTabText,
            ]}
          >
            Purchase Bills
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === 'sales' ? (
        <FlatList
          data={mockSalesInvoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InvoiceCard invoice={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.businessPrimary}
            />
          }
        />
      ) : (
        <FlatList
          data={mockPurchaseBills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BillCard bill={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.businessPrimary}
            />
          }
        />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
  },
  activeTab: {
    backgroundColor: colors.businessPrimary,
  },
  tabText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray600,
  },
  activeTabText: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.screenPadding,
    gap: spacing.cardGap,
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  invoiceNo: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
  },
  customerName: {
    fontSize: typography.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  amount: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.gray900,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
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
    color: colors.gray900,
    fontWeight: '500',
    marginTop: 2,
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  expandText: {
    fontSize: typography.xs,
    color: colors.gray400,
  },
  breakdown: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: typography.xs,
    color: colors.gray600,
  },
  breakdownValue: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.gray900,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.businessPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    gap: spacing.sm,
    minHeight: spacing.touchTarget,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
