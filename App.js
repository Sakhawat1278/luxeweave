import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Animated,
  Easing,
  Dimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import Header from './src/Header';
import WelcomeScreen from './src/WelcomeScreen';
import AuthScreen from './src/AuthScreen';
import ForgotPasswordScreen from './src/ForgotPasswordScreen';
import HomeScreen from './src/HomeScreen';

const SW = Dimensions.get('window').width;
const SH = Math.max(Dimensions.get('screen').height, Dimensions.get('window').height);

const crossfade = (fadeOut, fadeIn, duration = 280) =>
  Animated.parallel([
    Animated.timing(fadeOut, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(fadeIn, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]);

export default function App() {
  // 'welcome' | 'login' | 'signup' | 'forgot'
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [welcomeAnimKey, setWelcomeAnimKey] = useState(0);

  const authRef = useRef(null);
  const forgotRef = useRef(null);
  const isTransitioning = useRef(false);

  // Independent opacity for each layer — always mounted, crossfade simultaneously
  const welcomeAnim = useRef(new Animated.Value(1)).current;
  const authAnim = useRef(new Animated.Value(0)).current;
  const forgotAnim = useRef(new Animated.Value(0)).current;
  const homeAnim = useRef(new Animated.Value(0)).current;

  // ── Navigation history stack ──────────────────────────────────────────────
  const layerHistory = useRef(['welcome']);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // Map screen name → layer key
  const screenToLayer = (screen) => {
    if (screen === 'login' || screen === 'signup') return 'auth';
    return screen; // 'welcome' | 'forgot' | 'home'
  };

  // Map layer key → its Animated.Value
  const animForLayer = (layer) => {
    if (layer === 'welcome') return welcomeAnim;
    if (layer === 'auth')    return authAnim;
    if (layer === 'forgot')  return forgotAnim;
    if (layer === 'home')    return homeAnim;
    return welcomeAnim;
  };

  // All forward navigation goes through here
  const navigateTo = (toScreen) => {
    if (isTransitioning.current) return;
    Keyboard.dismiss();

    const fromLayer = screenToLayer(currentScreen);
    const toLayer   = screenToLayer(toScreen);

    // Same layer → just update currentScreen for internal state tracking (no anim)
    if (fromLayer === toLayer) {
      setCurrentScreen(toScreen);
      return;
    }

    isTransitioning.current = true;

    // Per-screen setup before fading in
    if (toLayer === 'welcome') setWelcomeAnimKey((k) => k + 1);
    if (toLayer === 'forgot')  forgotRef.current?.reset();

    layerHistory.current.push(toLayer);
    setCurrentScreen(toScreen);

    crossfade(animForLayer(fromLayer), animForLayer(toLayer)).start(() => {
      isTransitioning.current = false;
    });
  };

  // History-based back — works from anywhere
  const goBack = () => {
    Keyboard.dismiss();
    if (isTransitioning.current) return;

    const layer = screenToLayer(currentScreen);

    // Internal back inside AuthScreen (signup → login, no layer change)
    if (layer === 'auth' && currentScreen === 'signup') {
      authRef.current?.switchToLogin();
      setCurrentScreen('login');
      return;
    }

    // Internal back inside ForgotPasswordScreen (step N → step N-1)
    if (layer === 'forgot') {
      const handled = forgotRef.current?.handleBack();
      if (handled) return;
      // Step 0 — fall through to pop history
    }

    // Nothing to go back to
    if (layerHistory.current.length <= 1) return;

    const fromLayer = layer;
    layerHistory.current.pop();
    const prevLayer = layerHistory.current[layerHistory.current.length - 1];

    if (prevLayer === 'welcome') setWelcomeAnimKey((k) => k + 1);

    isTransitioning.current = true;
    setCurrentScreen(prevLayer === 'auth' ? 'login' : prevLayer);

    crossfade(animForLayer(fromLayer), animForLayer(prevLayer)).start(() => {
      isTransitioning.current = false;
    });
  };

  // Android hardware back button support
  useEffect(() => {
    const onHardwareBack = () => {
      const layer = screenToLayer(currentScreen);
      if (layer === 'auth' && currentScreen === 'signup') {
        goBack();
        return true;
      }
      if (layer === 'forgot') {
        goBack();
        return true;
      }
      if (layerHistory.current.length > 1) {
        goBack();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [currentScreen]);

  // Show back button on all screens except welcome and home (home has its own header)
  const showBack = currentScreen !== 'welcome' && currentScreen !== 'home';

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Persistent header — hidden on home (HomeScreen has its own) */}
        {currentScreen !== 'home' && (
          <Header
            showBackButton={showBack}
            onBack={goBack}
          />
        )}

        {/* WelcomeScreen: always mounted, normal flex flow */}
        <Animated.View
          style={{ flex: 1, opacity: welcomeAnim }}
          pointerEvents={currentScreen !== 'welcome' ? 'none' : 'auto'}
        >
          <WelcomeScreen
            animKey={welcomeAnimKey}
            onSignIn={() => navigateTo('login')}
            onExplore={() => navigateTo('home')}
          />
        </Animated.View>

        {/* AuthScreen: always mounted, absolute overlay with explicit dimensions */}
        <Animated.View
          style={{ position: 'absolute', top: 0, left: 0, width: SW, height: SH, opacity: authAnim }}
          pointerEvents={currentScreen === 'login' || currentScreen === 'signup' ? 'auto' : 'none'}
        >
          <AuthScreen
            ref={authRef}
            initialMode="login"
            onModeChange={(mode) => setCurrentScreen(mode)}
            onBackToWelcome={goBack}
            onForgotPassword={() => navigateTo('forgot')}
            onSignIn={() => navigateTo('home')}
          />
        </Animated.View>

        {/* ForgotPasswordScreen: always mounted, absolute overlay with explicit dimensions */}
        <Animated.View
          style={{ position: 'absolute', top: 0, left: 0, width: SW, height: SH, opacity: forgotAnim }}
          pointerEvents={currentScreen === 'forgot' ? 'auto' : 'none'}
        >
          <ForgotPasswordScreen
            ref={forgotRef}
            onBackToLogin={goBack}
          />
        </Animated.View>

        {/* HomeScreen: always mounted, topmost layer */}
        <Animated.View
          style={{ position: 'absolute', top: 0, left: 0, width: SW, height: SH, opacity: homeAnim }}
          pointerEvents={currentScreen === 'home' ? 'auto' : 'none'}
        >
          <HomeScreen onAccountPress={() => navigateTo('login')} />
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

