import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ onExplore, onSignIn, animKey = 0 }) {
  // Staggered rising entrance animated values for headline, description, and actions
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const headlineTranslateY = useRef(new Animated.Value(28)).current;

  const descOpacity = useRef(new Animated.Value(0)).current;
  const descTranslateY = useRef(new Animated.Value(22)).current;

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = useRef(new Animated.Value(20)).current;

  // Interactive scale animations for primary button
  const buttonScale = useRef(new Animated.Value(1)).current;
  const signInOpacity = useRef(new Animated.Value(1)).current;

  // Runs on first mount AND every time animKey changes (i.e. every return from login)
  useEffect(() => {
    // Stop any in-flight animations and reset to start state
    headlineOpacity.stopAnimation();
    headlineTranslateY.stopAnimation();
    descOpacity.stopAnimation();
    descTranslateY.stopAnimation();
    actionsOpacity.stopAnimation();
    actionsTranslateY.stopAnimation();

    headlineOpacity.setValue(0);
    headlineTranslateY.setValue(28);
    descOpacity.setValue(0);
    descTranslateY.setValue(22);
    actionsOpacity.setValue(0);
    actionsTranslateY.setValue(20);

    Animated.stagger(120, [
      // 1. Headline entrance (smooth rise + fade)
      Animated.parallel([
        Animated.timing(headlineOpacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headlineTranslateY, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 2. Description entrance (smooth rise + fade)
      Animated.parallel([
        Animated.timing(descOpacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(descTranslateY, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 3. Action buttons entrance (smooth rise + fade)
      Animated.parallel([
        Animated.timing(actionsOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(actionsTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [animKey]);

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.965,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleSignInPressIn = () => {
    Animated.timing(signInOpacity, {
      toValue: 0.55,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handleSignInPressOut = () => {
    Animated.timing(signInOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Background Photography */}
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Top-to-middle: Black to Transparent */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.92)',
            'rgba(0, 0, 0, 0.60)',
            'rgba(0, 0, 0, 0.20)',
            'transparent',
          ]}
          locations={[0, 0.35, 0.70, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topGradient}
          pointerEvents="none"
        />

        {/* Bottom-to-middle: Black to Transparent */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(0, 0, 0, 0.25)',
            'rgba(0, 0, 0, 0.65)',
            'rgba(0, 0, 0, 0.88)',
            '#000000',
          ]}
          locations={[0, 0.22, 0.52, 0.80, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.bottomGradient}
          pointerEvents="none"
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topSpacer} />

          {/* Bottom Content Area */}
          <View style={styles.bottomContent}>
            {/* Headline with smooth rise animation */}
            <Animated.View
              style={{
                opacity: headlineOpacity,
                transform: [{ translateY: headlineTranslateY }],
              }}
            >
              <Text style={styles.headline}>
                {'Elevate Your\nEveryday\nStyle'}
              </Text>
            </Animated.View>

            {/* Description with smooth rise animation */}
            <Animated.View
              style={{
                opacity: descOpacity,
                transform: [{ translateY: descTranslateY }],
              }}
            >
              <Text style={styles.description}>
                {'Discover a curated collection of\npremium essentials designed for\nthe modern individual.'}
              </Text>
            </Animated.View>

            {/* Action Buttons with smooth entrance & interactive spring press */}
            <Animated.View
              style={{
                opacity: actionsOpacity,
                transform: [{ translateY: actionsTranslateY }],
              }}
            >
              {/* Primary Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <Pressable
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                  onPress={onExplore || onSignIn}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>EXPLORE COLLECTION</Text>
                </Pressable>
              </Animated.View>

              {/* Secondary Sign In Link with custom tactile feedback */}
              <Pressable
                onPressIn={handleSignInPressIn}
                onPressOut={handleSignInPressOut}
                onPress={onSignIn}
                style={styles.signInWrapper}
              >
                <Animated.View style={[styles.signInInner, { opacity: signInOpacity }]}>
                  <Text style={styles.signInText}>SIGN IN</Text>
                  <View style={styles.signInUnderline} />
                </Animated.View>
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '66%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSpacer: {
    height: 50,
  },
  bottomContent: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 16 : 28,
  },
  headline: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: Math.min(width * 0.118, 46),
    lineHeight: Math.min(width * 0.138, 54),
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 23,
    color: 'rgba(255, 255, 255, 0.84)',
    marginBottom: 36,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    height: 62,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13.5,
    color: '#0A0A0A',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
  signInWrapper: {
    alignSelf: 'center',
    marginTop: 22,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  signInInner: {
    alignItems: 'center',
  },
  signInText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
  signInUnderline: {
    height: 1.5,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginTop: 3.5,
  },
});
