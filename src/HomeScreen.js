import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const NAV_ITEMS = [
  { key: 'home',    icon: 'home-outline',   label: 'Home' },
  { key: 'search',  icon: 'search-outline', label: 'Search' },
  { key: 'saved',   icon: 'heart-outline',  label: 'Saved' },
  { key: 'account', icon: 'person-outline', label: 'Account' },
];

export default function HomeScreen({ onAccountPress }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');

  const headerTop = Math.max(insets.top, Platform.OS === 'android' ? 20 : 12);
  const navBottom = insets.bottom > 0 ? insets.bottom : 12;

  const handleTabPress = (key) => {
    if (key === 'account') {
      onAccountPress?.();
      return;
    }
    setActiveTab(key);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* ── HEADER ───────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <View style={styles.headerRow}>
          {/* Account icon — left */}
          <Pressable
            onPress={onAccountPress}
            hitSlop={12}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
          >
            <Ionicons name="person-outline" size={23} color="#FFFFFF" />
          </Pressable>

          {/* Brand — center */}
          <Text style={styles.brand}>LUXEWEAVE</Text>

          {/* Cart icon — right */}
          <Pressable
            hitSlop={12}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
          >
            <View>
              <Ionicons name="bag-handle-outline" size={23} color="#FFFFFF" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>2</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      {/* ── CLEAN BODY CONTENT ──────────────────────── */}
      <View style={styles.content} />

      {/* ── STICKY BOTTOM NAVIGATION BAR ────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: navBottom }]}>
        <View style={styles.navRow}>
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.key;
            const activeColor = '#D4AF37';
            const inactiveColor = '#7E8B9B';

            return (
              <Pressable
                key={item.key}
                onPress={() => handleTabPress(item.key)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.tabButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={23}
                  color={active ? activeColor : inactiveColor}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: active ? activeColor : inactiveColor },
                    active && styles.tabLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },

  // ── Header ─────────────────────────────────────────
  header: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 100,
  },
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
  },
  brand: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 19,
    color: '#FFFFFF',
    letterSpacing: 5,
    textAlign: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: '#000000',
    lineHeight: 11,
  },

  // ── Body Content ───────────────────────────────────
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // ── Sticky Bottom Bar ──────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 6,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    gap: 2,
  },
  tabLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10.5,
    letterSpacing: 0.2,
    includeFontPadding: false,
    lineHeight: 13,
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});

