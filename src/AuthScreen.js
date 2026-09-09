import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Easing,
  Keyboard,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AuthScreen = forwardRef(function AuthScreen(
  { initialMode = 'login', onModeChange, onBackToWelcome, onForgotPassword, onSignIn },
  ref
) {
  const [activeTab, setActiveTab] = useState(initialMode); // 'login' | 'signup'

  // Horizontal slide animation for flawless 60fps/120fps native transition
  const slideAnim = useRef(
    new Animated.Value(initialMode === 'signup' ? -SCREEN_WIDTH : 0)
  ).current;

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginEmailFocused, setLoginEmailFocused] = useState(false);
  const [loginPasswordFocused, setLoginPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form states - Signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupNameFocused, setSignupNameFocused] = useState(false);
  const [signupEmailFocused, setSignupEmailFocused] = useState(false);
  const [signupPasswordFocused, setSignupPasswordFocused] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Button interactive scales
  const loginButtonScale = useRef(new Animated.Value(1)).current;
  const signupButtonScale = useRef(new Animated.Value(1)).current;

  const goToSignup = () => {
    Keyboard.dismiss();
    setActiveTab('signup');
    onModeChange?.('signup');
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      useNativeDriver: true,
    }).start();
  };

  const goToLogin = () => {
    Keyboard.dismiss();
    setActiveTab('login');
    onModeChange?.('login');
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      useNativeDriver: true,
    }).start();
  };

  useImperativeHandle(ref, () => ({
    getMode: () => activeTab,
    isSignup: () => activeTab === 'signup',
    switchToLogin: () => goToLogin(),
    switchToSignup: () => goToSignup(),
  }));

  const makePressHandlers = (animScale) => ({
    onPressIn: () => {
      Animated.spring(animScale, {
        toValue: 0.97,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    },
    onPressOut: () => {
      Animated.spring(animScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    },
  });

  const loginPressHandlers = makePressHandlers(loginButtonScale);
  const signupPressHandlers = makePressHandlers(signupButtonScale);

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Persistent Top Spacer for Floating Header */}
      <View style={styles.headerSpacer} />

      {/* Horizontal Sliding Two-Page Container: Zero flicker, Zero text snap, Zero layout jump */}
      <Animated.View
        style={[
          styles.pagesTrack,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* ==================== PAGE 1: SIGN IN ==================== */}
        <View style={styles.page}>
          <SafeAreaView edges={['bottom']} style={styles.pageSafeArea}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoid}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <View style={styles.contentContainer}>
                  {/* Title Section */}
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>ENTER YOUR CREDENTIALS</Text>
                  </View>

                  {/* IDENTIFIER Input */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>IDENTIFIER</Text>
                    <TextInput
                      value={loginEmail}
                      onChangeText={setLoginEmail}
                      placeholder="Email Address"
                      placeholderTextColor="#727D8C"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setLoginEmailFocused(true)}
                      onBlur={() => setLoginEmailFocused(false)}
                      style={[
                        styles.input,
                        loginEmailFocused && styles.inputFocused,
                      ]}
                    />
                  </View>

                  {/* SECRET Input */}
                  <View style={styles.fieldWrapper}>
                    <View style={styles.secretHeader}>
                      <Text style={styles.fieldLabel}>SECRET</Text>
                      <Pressable
                        onPress={onForgotPassword}
                        hitSlop={10}
                      >
                        <Text style={styles.lostLink}>LOST?</Text>
                      </Pressable>
                    </View>
                    <View
                      style={[
                        styles.passwordRow,
                        loginPasswordFocused && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        value={loginPassword}
                        onChangeText={setLoginPassword}
                        placeholder="Password"
                        placeholderTextColor="#727D8C"
                        secureTextEntry={!loginShowPassword}
                        autoCapitalize="none"
                        onFocus={() => setLoginPasswordFocused(true)}
                        onBlur={() => setLoginPasswordFocused(false)}
                        style={styles.passwordInput}
                      />
                      <Pressable
                        onPress={() => setLoginShowPassword((prev) => !prev)}
                        hitSlop={12}
                        style={styles.eyeIcon}
                      >
                        <Feather
                          name={loginShowPassword ? 'eye' : 'eye-off'}
                          size={18}
                          color="#8E99A8"
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* Remember Me Option */}
                  <Pressable
                    onPress={() => setRememberMe((prev) => !prev)}
                    style={styles.rememberMeRow}
                    hitSlop={8}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        rememberMe && styles.checkboxChecked,
                      ]}
                    >
                      {rememberMe && (
                        <Feather name="check" size={11} color="#0A0A0A" />
                      )}
                    </View>
                    <Text style={styles.rememberMeText}>REMEMBER ME</Text>
                  </Pressable>

                  {/* Tall SIGN IN Button (62px) */}
                  <Animated.View
                    style={{ transform: [{ scale: loginButtonScale }] }}
                  >
                    <Pressable
                      {...loginPressHandlers}
                      onPress={onSignIn}
                      style={styles.primaryButton}
                    >
                      <Text style={styles.primaryButtonText}>SIGN IN</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </ScrollView>

              {/* Footer: BECOME A MEMBER. JOIN NOW */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>BECOME A MEMBER. </Text>
                <Pressable
                  onPress={goToSignup}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.footerActionPressable,
                    pressed && styles.footerActionPressed,
                  ]}
                >
                  <Text style={styles.footerActionText}>JOIN NOW</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>

        {/* ==================== PAGE 2: SIGN UP ==================== */}
        <View style={styles.page}>
          <SafeAreaView edges={['bottom']} style={styles.pageSafeArea}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoid}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <View style={styles.contentContainer}>
                  {/* Title Section */}
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                      JOIN THE CURATED COMMUNITY
                    </Text>
                  </View>

                  {/* FULL NAME Input */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>FULL NAME</Text>
                    <TextInput
                      value={signupName}
                      onChangeText={setSignupName}
                      placeholder="Your Name"
                      placeholderTextColor="#727D8C"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onFocus={() => setSignupNameFocused(true)}
                      onBlur={() => setSignupNameFocused(false)}
                      style={[
                        styles.input,
                        signupNameFocused && styles.inputFocused,
                      ]}
                    />
                  </View>

                  {/* EMAIL ADDRESS Input */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                    <TextInput
                      value={signupEmail}
                      onChangeText={setSignupEmail}
                      placeholder="name@example.com"
                      placeholderTextColor="#727D8C"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setSignupEmailFocused(true)}
                      onBlur={() => setSignupEmailFocused(false)}
                      style={[
                        styles.input,
                        signupEmailFocused && styles.inputFocused,
                      ]}
                    />
                  </View>

                  {/* PASSWORD Input */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>PASSWORD</Text>
                    <View
                      style={[
                        styles.passwordRow,
                        signupPasswordFocused && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        value={signupPassword}
                        onChangeText={setSignupPassword}
                        placeholder="••••••••"
                        placeholderTextColor="#727D8C"
                        secureTextEntry={!signupShowPassword}
                        autoCapitalize="none"
                        onFocus={() => setSignupPasswordFocused(true)}
                        onBlur={() => setSignupPasswordFocused(false)}
                        style={styles.passwordInput}
                      />
                      <Pressable
                        onPress={() =>
                          setSignupShowPassword((prev) => !prev)
                        }
                        hitSlop={12}
                        style={styles.eyeIcon}
                      >
                        <Feather
                          name={signupShowPassword ? 'eye' : 'eye-off'}
                          size={18}
                          color="#8E99A8"
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* Terms & Privacy Agreement Checkbox */}
                  <Pressable
                    onPress={() => setAgreeTerms((prev) => !prev)}
                    style={styles.termsRow}
                    hitSlop={8}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        agreeTerms && styles.checkboxChecked,
                      ]}
                    >
                      {agreeTerms && (
                        <Feather name="check" size={11} color="#0A0A0A" />
                      )}
                    </View>
                    <Text style={styles.termsText}>
                      I AGREE TO THE{' '}
                      <Text style={styles.termsHighlight}>
                        TERMS OF SERVICE
                      </Text>{' '}
                      AND{' '}
                      <Text style={styles.termsHighlight}>
                        PRIVACY POLICY
                      </Text>
                      .
                    </Text>
                  </Pressable>

                  {/* Tall REGISTER NOW Button (62px) */}
                  <Animated.View
                    style={{ transform: [{ scale: signupButtonScale }] }}
                  >
                    <Pressable
                      {...signupPressHandlers}
                      onPress={() =>
                        console.log('Register pressed', signupName, signupEmail)
                      }
                      style={styles.primaryButton}
                    >
                      <Text style={styles.primaryButtonText}>REGISTER NOW</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </ScrollView>

              {/* Footer: ALREADY A MEMBER? LOG IN */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>ALREADY A MEMBER? </Text>
                <Pressable
                  onPress={goToLogin}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.footerActionPressable,
                    pressed && styles.footerActionPressed,
                  ]}
                >
                  <Text style={styles.footerActionText}>LOG IN</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
});

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  headerSpacer: {
    height: Platform.OS === 'android' ? 76 : 68,
  },
  pagesTrack: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  pageSafeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  contentContainer: {
    width: '100%',
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 2.2,
    color: '#A2ACB9',
  },
  fieldWrapper: {
    marginBottom: 28,
  },
  fieldLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: '#A2ACB9',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  inputFocused: {
    borderBottomColor: '#FFFFFF',
  },
  secretHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lostLink: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: '#A2ACB9',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    paddingLeft: 12,
    paddingVertical: 8,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: -4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  rememberMeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: '#A2ACB9',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 28,
    paddingRight: 8,
  },
  termsText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10.5,
    lineHeight: 17,
    letterSpacing: 1.2,
    color: '#A2ACB9',
  },
  termsHighlight: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    height: 62,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13.5,
    color: '#0A0A0A',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
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
  footerActionPressable: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  footerActionPressed: {
    opacity: 0.5,
  },
  footerActionText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});
