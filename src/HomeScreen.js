import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';



const IMG_SCULPTED = require('../assets/hero_sculpted.jpg');
const IMG_ATELIER  = require('../assets/hero_atelier.jpg');
const IMG_CAPSULE  = require('../assets/hero_capsule.jpg');

const HERO_SLIDERS = [
  {
    id: '1',
    badge: 'LIMITED EDITION',
    title: 'The Sculpted\nCollection',
    cta: 'EXPLORE NOW',
    image: IMG_SCULPTED,
  },
  {
    id: '2',
    badge: 'ATELIER CAPSULE',
    title: 'The Monolith\nOvercoat',
    cta: 'EXPLORE NOW',
    image: IMG_ATELIER,
  },
  {
    id: '3',
    badge: 'AUTUMN / WINTER 2026',
    title: 'Architectural\nMinimalism',
    cta: 'EXPLORE NOW',
    image: IMG_CAPSULE,
  },
];

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
  const [activeTab, setActiveTab] = useState('home');
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnims = useRef(
    HERO_SLIDERS.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;
  const activeSlideRef = useRef(0);
  const isAnimating = useRef(false);
  const autoPlayTimer = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goToSlide = (nextIndex) => {
    if (nextIndex === activeSlideRef.current || isAnimating.current) return;
    const currentIndex = activeSlideRef.current;
    isAnimating.current = true;

    setActiveSlide(nextIndex);
    activeSlideRef.current = nextIndex;

    Animated.parallel([
      Animated.timing(slideAnims[currentIndex], {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnims[nextIndex], {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isAnimating.current = false;
    });
  };

  const goToNextSlide = () => {
    const next = (activeSlideRef.current + 1) % HERO_SLIDERS.length;
    goToSlide(next);
  };

  const goToPrevSlide = () => {
    const prev = (activeSlideRef.current - 1 + HERO_SLIDERS.length) % HERO_SLIDERS.length;
    goToSlide(prev);
  };

  const startAutoPlay = () => {
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      goToNextSlide();
    }, 4500);
  };

  const resetAutoPlay = () => {
    startAutoPlay();
  };

  useEffect(() => {
    // Pre-warm image decoder for slides 2 & 3 so they show instantly on transition
    Image.prefetch(Image.resolveAssetSource(IMG_ATELIER).uri);
    Image.prefetch(Image.resolveAssetSource(IMG_CAPSULE).uri);
    startAutoPlay();
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.nativeEvent.pageX;
    touchStartY.current = e.nativeEvent.pageY;
  };

  const handleTouchEnd = (e) => {
    const dx = e.nativeEvent.pageX - touchStartX.current;
    const dy = e.nativeEvent.pageY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
      if (dx < 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
      resetAutoPlay();
    }
  };

  const handleIndicatorPress = (index) => {
    if (index === activeSlideRef.current) return;
    goToSlide(index);
    resetAutoPlay();
  };

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
        style={styles.feed}
        contentContainerStyle={[
          styles.feedContent,
          {
            paddingTop: headerTop + 56 + 10,
            paddingBottom: navBottom + 64,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SEARCH BAR ─────────────────────────────── */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#9EAAB8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search collections, coats, cashmere..."
              placeholderTextColor="#687584"
              style={styles.searchInput}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 ? (
              <Pressable
                onPress={() => setSearchQuery('')}
                hitSlop={8}
                style={styles.searchActionBtn}
              >
                <Ionicons name="close-circle" size={17} color="#8E99A8" />
              </Pressable>
            ) : (
              <Pressable
                hitSlop={8}
                style={styles.searchActionBtn}
              >
                <Ionicons name="options-outline" size={18} color="#D4AF37" />
              </Pressable>
            )}
          </View>
        </View>


        {/* ── SHOP BY MOOD SECTION ───────────────────── */}
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

  // ── Search Bar ─────────────────────────────────────
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 0,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#FFFFFF',
    marginLeft: 10,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  searchActionBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Hero Promo Banner Section ──────────────────────
  heroSection: {
    marginBottom: 24,
  },
  bannerContainer: {
    marginHorizontal: 16,
    height: 480,
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  bannerCard: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerImageInner: {
    borderRadius: 0,
    resizeMode: 'cover',
  },
  bannerGradient: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 32,
    paddingTop: 20,
    justifyContent: 'flex-end',
  },

  // Editorial Text & CTA
  bannerBottom: {
    alignItems: 'flex-start',
  },
  bannerBadge: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10.5,
    letterSpacing: 2.4,
    color: 'rgba(255, 255, 255, 0.72)',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bannerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    lineHeight: 38,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 0,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#000000',
    letterSpacing: 2,
    textAlign: 'center',
  },

  // Minimalist Segmented Pagination Inside Slider
  sliderPagination: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  indicatorTouch: {
    paddingVertical: 6,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationIndicator: {
    height: 3,
    borderRadius: 0,
  },
  paginationIndicatorActive: {
    width: 24,
    backgroundColor: '#D4AF37',
  },
  paginationIndicatorInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
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
