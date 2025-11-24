/**
 * System Admin - Customers Management Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Filter,
  Building2,
  Briefcase,
  User,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
} from '@tamagui/lucide-icons';

import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';

interface Customer {
  id: string;
  name: string;
  email: string;
  gstin?: string;
  customerType: 'CA_ORG' | 'ENTERPRISE' | 'INDIVIDUAL';
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED' | 'REJECTED';
  plan?: string;
  currentClientCount: number;
  currentDocumentCount: number;
  createdAt: string;
}

interface Metrics {
  totalCustomers: number;
  pendingApproval: number;
  activeCustomers: number;
  suspendedCustomers: number;
  disabledCustomers: number;
  caOrgCount: number;
  enterpriseCount: number;
  individualCount: number;
}

interface CreateCAOrgForm {
  orgName: string;
  ownerEmail: string;
  ownerName: string;
  phone: string;
  gstin: string;
  pan: string;
  maxClients: string;
  maxDocuments: string;
  plan: string;
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
    case 'ACTIVE':
      return 'success';
    case 'PENDING_APPROVAL':
      return 'info';
    case 'SUSPENDED':
    case 'DISABLED':
      return 'error';
    case 'REJECTED':
      return 'warning';
    default:
      return 'warning';
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase();
}

export default function AdminCustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCAOrgForm>({
    orgName: '',
    ownerEmail: '',
    ownerName: '',
    phone: '',
    gstin: '',
    pan: '',
    maxClients: '10',
    maxDocuments: '1000',
    plan: 'STARTER',
  });

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;
  const { getAccessToken } = useAuth();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessToken();

      let url = '/api/admin/customers';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const response = await apiClient.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const token = await getAccessToken();
      const response = await apiClient.get('/api/admin/customers/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetrics(response.data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  };

  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const token = await getAccessToken();
      const response = await apiClient.get(`/api/admin/customers/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCAOrg = async () => {
    if (!form.orgName || !form.ownerEmail || !form.ownerName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const token = await getAccessToken();

      await apiClient.post('/api/admin/customers', {
        orgName: form.orgName,
        ownerEmail: form.ownerEmail,
        ownerName: form.ownerName,
        phone: form.phone || undefined,
        gstin: form.gstin || undefined,
        pan: form.pan || undefined,
        maxClients: parseInt(form.maxClients) || 10,
        maxDocuments: parseInt(form.maxDocuments) || 1000,
        plan: form.plan,
        billingCycle: 'MONTHLY',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowCreateModal(false);
      setForm({
        orgName: '',
        ownerEmail: '',
        ownerName: '',
        phone: '',
        gstin: '',
        pan: '',
        maxClients: '10',
        maxDocuments: '1000',
        plan: 'STARTER',
      });

      Alert.alert('Success', 'CA Organization created and invite sent!');
      fetchCustomers();
      fetchMetrics();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create organization');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchMetrics();
  }, [statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        searchCustomers(searchQuery);
      } else {
        fetchCustomers();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const filteredCustomers = customers;

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
        <Pressable
          style={[styles.filterButton, statusFilter && styles.filterButtonActive]}
          onPress={() => setStatusFilter(statusFilter ? null : 'PENDING_APPROVAL')}
        >
          <Filter size={20} color={statusFilter ? colors.white : colors.gray600} />
        </Pressable>
        <Pressable style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add CA Org</Text>
        </Pressable>
      </View>

      {/* Status Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, !statusFilter && styles.filterChipActive]}
          onPress={() => setStatusFilter(null)}
        >
          <Text style={[styles.filterChipText, !statusFilter && styles.filterChipTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, statusFilter === 'PENDING_APPROVAL' && styles.filterChipActive]}
          onPress={() => setStatusFilter('PENDING_APPROVAL')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'PENDING_APPROVAL' && styles.filterChipTextActive]}>
            Pending
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, statusFilter === 'ACTIVE' && styles.filterChipActive]}
          onPress={() => setStatusFilter('ACTIVE')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'ACTIVE' && styles.filterChipTextActive]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, statusFilter === 'SUSPENDED' && styles.filterChipActive]}
          onPress={() => setStatusFilter('SUSPENDED')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'SUSPENDED' && styles.filterChipTextActive]}>
            Suspended
          </Text>
        </Pressable>
      </ScrollView>

      {/* Customer Stats */}
      <View style={[styles.statsRow, isWeb && styles.statsRowWeb]}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{metrics?.totalCustomers || 0}</Text>
          <Text style={styles.statLabel}>Total Customers</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{metrics?.activeCustomers || 0}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.info }]}>
            {metrics?.pendingApproval || 0}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {metrics?.suspendedCustomers || 0}
          </Text>
          <Text style={styles.statLabel}>Suspended</Text>
        </Card>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.businessPrimary} />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <Card style={styles.errorCard}>
          <AlertCircle size={24} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchCustomers}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </Card>
      )}

      {/* Customer List */}
      {!loading && !error && (
        <Card style={styles.listCard}>
          {filteredCustomers.length === 0 ? (
            <View style={styles.emptyState}>
              <Building2 size={48} color={colors.gray300} />
              <Text style={styles.emptyText}>No customers found</Text>
            </View>
          ) : (
            filteredCustomers.map((customer, index) => (
              <React.Fragment key={customer.id}>
                <Pressable style={styles.customerItem}>
                  <View style={styles.customerMain}>
                    <View style={styles.customerIcon}>
                      {getTypeIcon(customer.customerType)}
                    </View>
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>{customer.name}</Text>
                      <Text style={styles.customerEmail}>{customer.email}</Text>
                      {customer.gstin && (
                        <Text style={styles.customerGstin}>GSTIN: {customer.gstin}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.customerMeta}>
                    <Badge variant={getStatusVariant(customer.status)}>
                      {formatStatus(customer.status)}
                    </Badge>
                    {customer.plan && (
                      <Text style={styles.customerPlan}>{customer.plan}</Text>
                    )}
                  </View>
                  <View style={styles.customerActions}>
                    <Text style={styles.customerClients}>
                      {customer.currentClientCount} clients
                    </Text>
                    <ChevronRight size={20} color={colors.gray400} />
                  </View>
                </Pressable>
                {index < filteredCustomers.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))
          )}
        </Card>
      )}

      {/* Create CA Org Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isWeb && styles.modalContentWeb]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create CA Organization</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <X size={24} color={colors.gray600} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Organization Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter organization name"
                value={form.orgName}
                onChangeText={(text) => setForm({ ...form, orgName: text })}
              />

              <Text style={styles.inputLabel}>Owner Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="owner@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.ownerEmail}
                onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
              />

              <Text style={styles.inputLabel}>Owner Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter owner name"
                value={form.ownerName}
                onChangeText={(text) => setForm({ ...form, ownerName: text })}
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => setForm({ ...form, phone: text })}
              />

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>GSTIN</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="GSTIN"
                    autoCapitalize="characters"
                    value={form.gstin}
                    onChangeText={(text) => setForm({ ...form, gstin: text })}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>PAN</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="PAN"
                    autoCapitalize="characters"
                    value={form.pan}
                    onChangeText={(text) => setForm({ ...form, pan: text })}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Max Clients</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    keyboardType="number-pad"
                    value={form.maxClients}
                    onChangeText={(text) => setForm({ ...form, maxClients: text })}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Max Documents</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1000"
                    keyboardType="number-pad"
                    value={form.maxDocuments}
                    onChangeText={(text) => setForm({ ...form, maxDocuments: text })}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Plan</Text>
              <View style={styles.planSelector}>
                {['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].map((plan) => (
                  <Pressable
                    key={plan}
                    style={[
                      styles.planOption,
                      form.plan === plan && styles.planOptionSelected,
                    ]}
                    onPress={() => setForm({ ...form, plan })}
                  >
                    <Text
                      style={[
                        styles.planOptionText,
                        form.plan === plan && styles.planOptionTextSelected,
                      ]}
                    >
                      {plan}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.createButton, creating && styles.buttonDisabled]}
                onPress={handleCreateCAOrg}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <CheckCircle size={20} color={colors.white} />
                    <Text style={styles.createButtonText}>Create & Send Invite</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.sm,
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
  filterButtonActive: {
    backgroundColor: colors.businessPrimary,
    borderColor: colors.businessPrimary,
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
  filterRow: {
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
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
  },
  filterChipTextActive: {
    color: colors.white,
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
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sm,
    color: colors.gray500,
  },
  errorCard: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
  },
  retryText: {
    fontSize: typography.sm,
    color: colors.gray700,
    fontWeight: '600',
  },
  listCard: {
    padding: 0,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colors.gray500,
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
  customerGstin: {
    fontSize: typography.xs,
    color: colors.gray400,
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
  customerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customerClients: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: spacing.md + 36 + spacing.sm,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxHeight: '90%',
  },
  modalContentWeb: {
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.gray900,
  },
  modalBody: {
    padding: spacing.md,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.sm,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputHalf: {
    flex: 1,
  },
  planSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  planOption: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: 'center',
  },
  planOptionSelected: {
    borderColor: colors.businessPrimary,
    backgroundColor: colors.businessPrimary + '10',
  },
  planOptionText: {
    fontSize: typography.xs,
    color: colors.gray600,
    fontWeight: '500',
  },
  planOptionTextSelected: {
    color: colors.businessPrimary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.sm,
    color: colors.gray700,
    fontWeight: '600',
  },
  createButton: {
    flex: 2,
    flexDirection: 'row',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.businessPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  createButtonText: {
    fontSize: typography.sm,
    color: colors.white,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
