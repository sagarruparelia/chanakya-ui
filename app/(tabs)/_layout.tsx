/**
 * Business User Bottom Tab Navigation - Based on UX Guidelines
 * 5 tabs: Home, Transactions, GST, Documents, More
 * Green theme (#10B981)
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { colors, spacing, typography, navigation as navConfig } from '@/constants/theme';
import { Home, FileText, Calculator, Folder, MoreHorizontal } from '@tamagui/lucide-icons';

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

  // Mock data - replace with actual state
  const pendingGSTCount = 3;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.businessPrimary,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
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
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
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
      <Tabs.Screen
        name="gst"
        options={{
          title: 'GST',
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
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
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
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
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
