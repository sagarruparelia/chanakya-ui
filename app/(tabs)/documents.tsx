/**
 * Documents Screen - Based on UX Guidelines
 * Document list with categories and upload
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
  FileText,
  Image,
  File,
  Upload,
  Filter,
  Search,
} from '@tamagui/lucide-icons';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';

// Mock data
const mockDocuments = [
  {
    id: '1',
    name: 'Invoice_Jan_001.pdf',
    type: 'invoice' as const,
    size: '245 KB',
    uploadedAt: '2025-01-05',
    status: 'processed' as const,
  },
  {
    id: '2',
    name: 'Bill_Supplier_Co.jpg',
    type: 'bill' as const,
    size: '1.2 MB',
    uploadedAt: '2025-01-04',
    status: 'processing' as const,
  },
  {
    id: '3',
    name: 'Receipt_Office_Supplies.pdf',
    type: 'receipt' as const,
    size: '128 KB',
    uploadedAt: '2025-01-03',
    status: 'processed' as const,
  },
  {
    id: '4',
    name: 'GST_Return_Dec_2024.pdf',
    type: 'return' as const,
    size: '512 KB',
    uploadedAt: '2025-01-01',
    status: 'processed' as const,
  },
];

type DocumentType = 'invoice' | 'bill' | 'receipt' | 'return' | 'other';
type DocumentStatus = 'processing' | 'processed' | 'failed';

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
}

const getDocumentIcon = (type: DocumentType) => {
  switch (type) {
    case 'invoice':
    case 'bill':
    case 'return':
      return FileText;
    case 'receipt':
      return Image;
    default:
      return File;
  }
};

const getStatusVariant = (status: DocumentStatus) => {
  switch (status) {
    case 'processed':
      return 'success';
    case 'processing':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  const IconComponent = getDocumentIcon(document.type);

  return (
    <Card
      onPress={() => console.log('Open document', document.id)}
      style={styles.documentCard}
    >
      <View style={styles.documentHeader}>
        <View style={styles.iconContainer}>
          <IconComponent size={24} color={colors.businessPrimary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {document.name}
          </Text>
          <View style={styles.documentMeta}>
            <Text style={styles.documentSize}>{document.size}</Text>
            <Text style={styles.documentDot}>•</Text>
            <Text style={styles.documentDate}>{document.uploadedAt}</Text>
          </View>
        </View>
        <Badge
          variant={getStatusVariant(document.status) as any}
          size="sm"
        >
          {document.status === 'processed' ? 'Done' : document.status === 'processing' ? 'Processing' : 'Failed'}
        </Badge>
      </View>
    </Card>
  );
}

export default function DocumentsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => console.log('Search')}
            accessibilityLabel="Search documents"
          >
            <Search size={20} color={colors.gray600} />
          </Pressable>
          <Pressable
            style={styles.headerButton}
            onPress={() => console.log('Filter')}
            accessibilityLabel="Filter documents"
          >
            <Filter size={20} color={colors.gray600} />
          </Pressable>
        </View>
      </View>

      {/* Upload Button */}
      <Pressable
        style={styles.uploadButton}
        onPress={() => console.log('Upload document')}
        accessibilityLabel="Upload new document"
      >
        <Upload size={20} color={colors.white} />
        <Text style={styles.uploadButtonText}>Upload Document</Text>
      </Pressable>

      {/* Document List */}
      <FlatList
        data={mockDocuments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DocumentCard document={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.businessPrimary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FileText size={48} color={colors.gray300} />
            <Text style={styles.emptyTitle}>No documents yet</Text>
            <Text style={styles.emptySubtext}>
              Upload your first document to get started
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
    gap: spacing.sm,
  },
  headerButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.businessPrimary,
    marginHorizontal: spacing.screenPadding,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    gap: spacing.sm,
    minHeight: spacing.touchTarget,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: typography.base,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.screenPadding,
    paddingTop: 0,
    gap: spacing.cardGap,
  },
  documentCard: {
    marginBottom: 0,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.businessLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  documentSize: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  documentDot: {
    fontSize: typography.xs,
    color: colors.gray300,
    marginHorizontal: spacing.xs,
  },
  documentDate: {
    fontSize: typography.xs,
    color: colors.gray500,
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
