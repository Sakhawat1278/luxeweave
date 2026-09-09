import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  Animated,
  Easing,
  Platform,
} from 'react-native';

export default function AuthFooter({ promptText, actionText, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.94,
      friction: 8,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 6,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 8,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress?.();
    });
  };

  return (
    <Animated.View
      style={[
        styles.footerRow,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.footerText}>{promptText}</Text>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          hitSlop={14}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 36 : 46,
    paddingTop: 12,
  },
  footerText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: '#A2ACB9',
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  actionButtonPressed: {
    opacity: 0.6,
  },
  actionText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});
