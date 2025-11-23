/**
 * Role-based Tab Navigation
 *
 * SYSTEM_ADMIN:
 * - Mobile: Bottom tabs (Overview, Customers, Licenses, Subscriptions, Activity)
 * - Web: Sidebar navigation (handled in AdminLayout)
 *
 * CA Users:
 * - Mobile/Web: Bottom tabs (Home, Transactions, GST, Documents, More)
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { colors, spacing, typography, navigation as navConfig } from '@/constants/theme';
import {
  Home,
  FileText,
  Calculator,
  Folder,
  MoreHorizontal,
  LayoutDashboard,
  Users,
  Key,
  CreditCard,
  Activity,
} from '@tamagui/lucide-icons';
import { useAppSelector } from '@/store';
import { selectCurrentUser } from '@/store/authSlice';

interface TabBarBadgeProps {
  count?: number;
}

function TabBarBadge({ count }: TabBarBadgeProps) {
  if (!count || count <= 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectCurrentUser);
  const { width } = useWindowDimensions();

  // Check if user is system admin
  const isSystemAdmin = user?.role === 'SYSTEM_ADMIN';

  // On web with large screen, hide bottom tabs for admin (sidebar is used instead)
  const isWebLarge = Platform.OS === 'web' && width >= 768;
  const hideAdminTabs = isSystemAdmin && isWebLarge;

  // Mock data - replace with actual state
  const pendingGSTCount = 3;
  const licenseAlerts = 2;

  // Admin theme color (indigo)
  const adminColor = '#10B981';
  const activeColor = isSystemAdmin ? adminColor : colors.businessPrimary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: hideAdminTabs ? { display: 'none' } : {
          height: navConfig.bottomTabHeightWithoutSafeArea + insets.bottom,
          paddingBottom: insets.bottom || spacing.sm,
          paddingTop: spacing.sm,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray200,
        },
        tabBarLabelStyle: {
          fontSize: typography.xs,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      {/* ===== SYSTEM ADMIN TABS ===== */}

      {/* Admin Dashboard/Overview */}
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: 'Overview',
          href: isSystemAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboard
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Admin Overview',
        }}
      />

      {/* Admin Customers */}
      <Tabs.Screen
        name="admin-customers"
        options={{
          title: 'Customers',
          href: isSystemAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Manage Customers',
        }}
      />

      {/* Admin Licenses */}
      <Tabs.Screen
        name="admin-licenses"
        options={{
          title: 'Licenses',
          href: isSystemAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Key
                size={24}
                color={color as any}
                strokeWidth={focused ? 2.5 : 2}
              />
              <TabBarBadge count={licenseAlerts} />
            </View>
          ),
          tabBarAccessibilityLabel: `Licenses, ${licenseAlerts} alerts`,
        }}
      />

      {/* Admin Subscriptions */}
      <Tabs.Screen
        name="admin-subscriptions"
        options={{
          title: 'Billing',
          href: isSystemAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <CreditCard
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Subscriptions and Billing',
        }}
      />

      {/* Admin Activity */}
      <Tabs.Screen
        name="admin-activity"
        options={{
          title: 'Activity',
          href: isSystemAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Activity
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Activity Log',
        }}
      />

      {/* ===== CA USER TABS ===== */}

      {/* Home - Only for CA users */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: isSystemAdmin ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />

      {/* Transactions - Only for CA users */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          href: isSystemAdmin ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <FileText
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Transactions tab',
        }}
      />

      {/* GST - Only for CA users */}
      <Tabs.Screen
        name="gst"
        options={{
          title: 'GST',
          href: isSystemAdmin ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Calculator
                size={24}
                color={color as any}
                strokeWidth={focused ? 2.5 : 2}
              />
              <TabBarBadge count={pendingGSTCount} />
            </View>
          ),
          tabBarAccessibilityLabel: `GST tab, ${pendingGSTCount} pending items`,
        }}
      />

      {/* Documents - Only for CA users */}
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          href: isSystemAdmin ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Folder
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'Documents tab',
        }}
      />

      {/* More - Only for CA users */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          href: isSystemAdmin ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <MoreHorizontal
              size={24}
              color={color as any}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarAccessibilityLabel: 'More options tab',
        }}
      />

      {/* Hidden tabs - remove from navigation but keep for routing */}
      <Tabs.Screen
        name="tenants"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.badge,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
