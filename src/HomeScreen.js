import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const IMG_QUIET_LUXURY = require('../assets/hero_quiet_luxury.png');

const MOOD_CATEGORIES = [
  { id: 'new-in',      label: 'New in',      icon: 'sparkles-outline' },
  { id: 'tops',        label: 'Tops',        icon: 'shirt-outline' },
  { id: 'tailoring',   label: 'Tailoring',   icon: 'briefcase-outline' },
  { id: 'accessories', label: 'Accessories', icon: 'diamond-outline' },
  { id: 'outerwear',   label: 'Outerwear',   icon: 'layers-outline' },
  { id: 'footwear',    label: 'Footwear',    icon: 'footsteps-outline' },
];

const NAV_ITEMS = [
  { key: 'home',    icon: 'home-outline',   label: 'Home' },
  { key: 'search',  icon: 'search-outline', label: 'Search' },
  { key: 'saved',   icon: 'heart-outline',  label: 'Saved' },
  { key: 'account', icon: 'person-outline', label: 'Account' },
];

export default function HomeScreen({ onAccountPress }) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMood, setSelectedMood] = useState(null);

  const headerTop = Math.max(insets.top, Platform.OS === 'android' ? 20 : 12);
  const navBottom = insets.bottom > 0 ? insets.bottom : 12;

  const handleTabPress = (key) => {
    if (key === 'account') {
      onAccountPress?.();
      return;
    }
    setActiveTab(key);
  };

  const handleShopCollection = () => {
    scrollViewRef.current?.scrollTo({ y: SCREEN_HEIGHT - 60, animated: true });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* ── HOME HEADER ─────────────────────────────── */}
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

      {/* ── SCROLLABLE FEED ─────────────────────────── */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.feed}
        contentContainerStyle={[
          styles.feedContent,
          {
            paddingTop: 0,
            paddingBottom: navBottom + 64,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO BANNER (Quiet Luxury Editorial) ──────────────── */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={IMG_QUIET_LUXURY}
            style={styles.heroBanner}
            imageStyle={styles.heroBannerImage}
            resizeMode="cover"
          >
            {/* Top scrim for brand header legibility */}
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.42)', 'transparent']}
              locations={[0, 0.16]}
              style={styles.heroTopScrim}
              pointerEvents="none"
            />

            {/* Bottom cinematic gradient overlay + editorial content */}
            <LinearGradient
              colors={[
                'transparent',
                'rgba(0, 0, 0, 0.25)',
                'rgba(0, 0, 0, 0.75)',
              ]}
              locations={[0, 0.50, 0.95]}
              style={styles.heroContentGradient}
            >
              {/* Season Overline */}
              <Text style={styles.heroSeason}>AUTUMN / WINTER 24</Text>

              {/* Editorial Title */}
              <Text style={styles.heroTitle}>Quiet{'\n'}Luxury</Text>

              {/* Shop Collection CTA Button */}
              <Pressable
                onPress={handleShopCollection}
                style={({ pressed }) => [
                  styles.heroCtaBtn,
                  pressed && styles.heroCtaBtnPressed,
                ]}
                hitSlop={8}
              >
                <Text style={styles.heroCtaText}>SHOP COLLECTION</Text>
              </Pressable>
            </LinearGradient>
          </ImageBackground>
        </View>



        <View style={styles.moodSection}>
          <View style={styles.moodHeader}>
            <View>
              <Text style={styles.moodOverline}>EXPLORE</Text>
              <Text style={styles.moodTitle}>Shop by mood</Text>
            </View>
            <Pressable
              hitSlop={10}
              style={({ pressed }) => [styles.viewAllBtn, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodTrack}
          >
            {MOOD_CATEGORIES.map((item) => {
              const isSelected = selectedMood === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedMood(isSelected ? null : item.id)}
                  style={({ pressed }) => [
                    styles.moodItem,
                    pressed && styles.moodItemPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.moodCircle,
                      isSelected && styles.moodCircleSelected,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color="#191816"
                    />
                  </View>
                  <Text
                    style={[
                      styles.moodLabel,
                      isSelected && styles.moodLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
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

  // ── Feed ScrollView ────────────────────────────────
  feed: {
    flex: 1,
  },
  feedContent: {
    flexGrow: 1,
  },

  // ── Hero Banner ────────────────────────────────────
  heroSection: {
    marginBottom: 28,
  },
  heroBanner: {
    width: '100%',
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  heroBannerImage: {
    resizeMode: 'cover',
  },
  heroTopScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroContentGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroSeason: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11.5,
    letterSpacing: 4,
    color: 'rgba(255, 255, 255, 0.82)',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 58,
    lineHeight: 64,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 26,
  },
  heroCtaBtn: {
    backgroundColor: '#FFFFFF',
    width: '68%',
    maxWidth: 240,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  heroCtaBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  heroCtaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    letterSpacing: 2.5,
    color: '#000000',
    textAlign: 'center',
  },

  // ── Shop by Mood Section ───────────────────────────
  moodSection: {
    marginBottom: 34,
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  moodOverline: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10.5,
    color: '#A0988A',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  moodTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  viewAllBtn: {
    paddingBottom: 2,
  },
  viewAllText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
  },
  moodTrack: {
    paddingHorizontal: 16,
    gap: 16,
  },
  moodItem: {
    alignItems: 'center',
    width: 68,
  },
  moodItemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  moodCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4DDD3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodCircleSelected: {
    borderColor: '#D4AF37',
    backgroundColor: '#EDE7DE',
  },
  moodLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 8,
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: '#D4AF37',
    fontFamily: 'PlusJakartaSans_600SemiBold',
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
