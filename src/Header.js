import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ showBackButton = false, onBack }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 20 : 12) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.headerRow}>
        {showBackButton ? (
          <Pressable
            onPress={onBack}
            hitSlop={16}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.5 },
            ]}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}

        <Text style={styles.brandTitle}>LUXEWEAVE</Text>

        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    height: 56,
  },
  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 38,
    height: 38,
  },
  brandTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 19,
    color: '#FFFFFF',
    letterSpacing: 5,
    textAlign: 'center',
  },
});
