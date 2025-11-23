/**
 * More Screen - Based on UX Guidelines
 * Settings, help, and additional options
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Briefcase,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  FileText,
  Users,
} from '@tamagui/lucide-icons';

import { Card } from '@/components/ui/Card';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, selectCurrentUser } from '@/store/authSlice';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

function MenuItem({
  icon,
  label,
  description,
  onPress,
  showChevron = true,
  destructive = false,
}: MenuItemProps) {
  return (
    <Pressable
      style={styles.menuItem}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={[styles.menuIcon, destructive && styles.destructiveIcon]}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, destructive && styles.destructiveText]}>
          {label}
        </Text>
        {description && (
          <Text style={styles.menuDescription}>{description}</Text>
        )}
      </View>
      {showChevron && (
        <ChevronRight size={20} color={colors.gray400 as any} />
      )}
    </Pressable>
  );
}

export default function MoreScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </Card>

        {/* Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <Card padding="none">
            <MenuItem
              icon={<Briefcase size={20} color={colors.businessPrimary as any} />}
              label="Projects"
              description="Manage your projects"
              onPress={() => console.log('Projects')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={<Users size={20} color={colors.businessPrimary as any} />}
              label="Team Members"
              description="Invite and manage team"
              onPress={() => console.log('Team')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={<FileText size={20} color={colors.businessPrimary as any} />}
              label="Reports"
              description="View financial reports"
              onPress={() => console.log('Reports')}
            />
          </Card>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card padding="none">
            <MenuItem
              icon={<Bell size={20} color={colors.gray600 as any} />}
              label="Notifications"
              onPress={() => console.log('Notifications')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={<Shield size={20} color={colors.gray600 as any} />}
              label="Security"
              onPress={() => console.log('Security')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={<Settings size={20} color={colors.gray600 as any} />}
              label="Preferences"
              onPress={() => console.log('Preferences')}
            />
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Card padding="none">
            <MenuItem
              icon={<HelpCircle size={20} color={colors.gray600 as any} />}
              label="Help & Support"
              onPress={() => console.log('Help')}
            />
          </Card>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Card padding="none">
            <MenuItem
              icon={<LogOut size={20} color={colors.error as any} />}
              label="Log Out"
              onPress={handleLogout}
              showChevron={false}
              destructive
            />
          </Card>
        </View>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.businessPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitial: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
  },
  userEmail: {
    fontSize: typography.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.cardPadding,
    minHeight: spacing.touchTarget + spacing.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  destructiveIcon: {
    backgroundColor: colors.statusError,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.gray900,
  },
  menuDescription: {
    fontSize: typography.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  destructiveText: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: spacing.cardPadding + 36 + spacing.md,
  },
  version: {
    fontSize: typography.xs,
    color: colors.gray400,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});
