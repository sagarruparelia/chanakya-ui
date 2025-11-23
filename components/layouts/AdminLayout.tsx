/**
 * AdminLayout - Responsive layout for System Admin
 * - Web: Left sidebar navigation + main content
 * - Mobile: Bottom tab navigation (handled by Expo Router)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  LayoutDashboard,
  Users,
  Key,
  CreditCard,
  Activity,
  Bell,
  LogOut,
  Shield,
} from '@tamagui/lucide-icons';

import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCurrentUser, logout } from '@/store/authSlice';

// Breakpoint for showing sidebar
const SIDEBAR_BREAKPOINT = 768;

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  badge?: number;
  onPress: () => void;
}

function NavItem({ icon, label, isActive, badge, onPress }: NavItemProps) {
  return (
    <Pressable
      style={[styles.navItem, isActive && styles.navItemActive]}
      onPress={onPress}
    >
      <View style={styles.navItemIcon}>{icon}</View>
      <Text style={[styles.navItemLabel, isActive && styles.navItemLabelActive]}>
        {label}
      </Text>
      {badge && badge > 0 && (
        <View style={styles.navBadge}>
          <Text style={styles.navBadgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const showSidebar = Platform.OS === 'web' && width >= SIDEBAR_BREAKPOINT;

  // Mock notification count
  const notificationCount = 3;
  const licenseAlerts = 2;

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  const navItems = [
    {
      icon: <LayoutDashboard size={20} color={pathname.includes('overview') || pathname === '/admin-dashboard' ? colors.businessPrimary : colors.gray500} />,
      label: 'Overview',
      href: '/(tabs)/admin-dashboard',
    },
    {
      icon: <Users size={20} color={pathname.includes('customers') ? colors.businessPrimary : colors.gray500} />,
      label: 'Customers',
      href: '/(tabs)/admin-customers',
    },
    {
      icon: <Key size={20} color={pathname.includes('licenses') ? colors.businessPrimary : colors.gray500} />,
      label: 'Licenses',
      href: '/(tabs)/admin-licenses',
      badge: licenseAlerts,
    },
    {
      icon: <CreditCard size={20} color={pathname.includes('subscriptions') ? colors.businessPrimary : colors.gray500} />,
      label: 'Subscriptions',
      href: '/(tabs)/admin-subscriptions',
    },
    {
      icon: <Activity size={20} color={pathname.includes('activity') ? colors.businessPrimary : colors.gray500} />,
      label: 'Activity',
      href: '/(tabs)/admin-activity',
    },
  ];

  // Mobile view: just render children (bottom tabs handled by Expo Router)
  if (!showSidebar) {
    return <>{children}</>;
  }

  // Web view: render sidebar + content
  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Shield size={24} color={colors.white} />
          </View>
          <View>
            <Text style={styles.logoTitle}>System Admin</Text>
            <Text style={styles.logoSubtitle}>Super Admin</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={styles.navList}>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href || (item.href.includes('admin-dashboard') && pathname.includes('admin-dashboard'))}
              badge={item.badge}
              onPress={() => router.push(item.href as any)}
            />
          ))}
        </View>

        {/* User Section */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SA'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Super Admin'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'admin@chanakya.com'}</Text>
          </View>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleLogout}>
          <LogOut size={18} color={colors.gray500} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>
          <Pressable style={styles.notificationButton}>
            <Bell size={24} color={colors.gray600} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.gray50,
  },
  sidebar: {
    width: 280,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.gray200,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.gray900,
  },
  logoSubtitle: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  navList: {
    flex: 1,
    gap: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  navItemActive: {
    backgroundColor: colors.businessLight,
  },
  navItemIcon: {
    width: 20,
  },
  navItemLabel: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.gray600,
    fontWeight: '500',
  },
  navItemLabelActive: {
    color: colors.businessPrimary,
    fontWeight: '600',
  },
  navBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  navBadgeText: {
    color: colors.white,
    fontSize: typography.xs,
    fontWeight: '600',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    marginTop: spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.businessPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray900,
  },
  userEmail: {
    fontSize: typography.xs,
    color: colors.gray500,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  signOutText: {
    fontSize: typography.sm,
    color: colors.gray500,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.gray900,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
    padding: spacing.xl,
    overflow: 'scroll' as any,
  },
});

export default AdminLayout;
