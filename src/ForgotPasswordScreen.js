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

const ForgotPasswordScreen = forwardRef(function ForgotPasswordScreen(
  { onBackToLogin },
  ref
) {
  // Internal step: 0=email, 1=otp, 2=reset
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Email step
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  // OTP step — 4 individual refs (hooks can't be in loops)
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRef0 = useRef(null);
  const otpRef1 = useRef(null);
  const otpRef2 = useRef(null);
  const otpRef3 = useRef(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

  // Reset step
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [newPassFocused, setNewPassFocused] = useState(false);
  const [confirmPassFocused, setConfirmPassFocused] = useState(false);

  // Button scales
  const sendScale = useRef(new Animated.Value(1)).current;
  const verifyScale = useRef(new Animated.Value(1)).current;
  const updateScale = useRef(new Animated.Value(1)).current;

  const goToStep = (target) => {
    Keyboard.dismiss();
    setStep(target);
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH * target,
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      useNativeDriver: true,
    }).start();
  };

  useImperativeHandle(ref, () => ({
    handleBack: () => {
      if (step > 0) {
        goToStep(step - 1);
        return true; // handled internally
      }
      return false; // parent should navigate away
    },
    reset: () => {
      setStep(0);
      slideAnim.setValue(0);
      setEmail('');
      setOtp(['', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    },
  }));

  const pressHandlers = (scale) => ({
    onPressIn: () =>
      Animated.spring(scale, { toValue: 0.97, friction: 8, tension: 100, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }).start(),
  });

  const handleOtpChange = (text, index) => {
    const char = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    if (char && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
      otpRefs[index - 1].current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.headerSpacer} />

      <Animated.View style={[styles.pagesTrack, { transform: [{ translateX: slideAnim }] }]}>

        {/* ===== PAGE 1: FORGOT PASSWORD ===== */}
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
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                      ENTER YOUR REGISTERED EMAIL TO RECEIVE A RECOVERY CODE.
                    </Text>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="name@example.com"
                      placeholderTextColor="#727D8C"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      style={[styles.input, emailFocused && styles.inputFocused]}
                    />
                  </View>

                  <Animated.View style={{ transform: [{ scale: sendScale }] }}>
                    <Pressable
                      {...pressHandlers(sendScale)}
                      onPress={() => goToStep(1)}
                      style={styles.primaryButton}
                    >
                      <Text style={styles.primaryButtonText}>SEND CODE</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </ScrollView>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>REMEMBER IT? </Text>
                <Pressable
                  onPress={onBackToLogin}
                  hitSlop={12}
                  style={({ pressed }) => [styles.footerLink, pressed && styles.footerLinkPressed]}
                >
                  <Text style={styles.footerLinkText}>BACK TO LOGIN</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>

        {/* ===== PAGE 2: VERIFICATION (OTP) ===== */}
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
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>Verification</Text>
                    <Text style={styles.subtitle}>
                      {'ENTER '}
                      <Text style={styles.subtitleAccent}>THE 4-DIGIT CODE</Text>
                      {' SENT TO YOUR INBOX.'}
                    </Text>
                  </View>

                  {/* 4-digit OTP boxes */}
                  <View style={styles.otpRow}>
                    {[0, 1, 2, 3].map((i) => (
                      <View key={i} style={[styles.otpBox, otp[i] ? styles.otpBoxFilled : null]}>
                        <TextInput
                          ref={otpRefs[i]}
                          value={otp[i]}
                          onChangeText={(t) => handleOtpChange(t, i)}
                          onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                          keyboardType="number-pad"
                          maxLength={1}
                          selectTextOnFocus
                          caretHidden
                          style={styles.otpInput}
                        />
                      </View>
                    ))}
                  </View>

                  <Animated.View style={{ transform: [{ scale: verifyScale }] }}>
                    <Pressable
                      {...pressHandlers(verifyScale)}
                      onPress={() => goToStep(2)}
                      style={styles.primaryButton}
                    >
                      <Text style={styles.primaryButtonText}>VERIFY & CONTINUE</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </ScrollView>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>DIDN'T RECEIVE A CODE? </Text>
                <Pressable
                  onPress={() => console.log('Resend code')}
                  hitSlop={12}
                  style={({ pressed }) => [styles.footerLink, pressed && styles.footerLinkPressed]}
                >
                  <Text style={styles.footerLinkText}>RESEND CODE</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>

        {/* ===== PAGE 3: RESET PASSWORD ===== */}
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
                  <View style={styles.titleSection}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                      SECURE YOUR ACCOUNT WITH A NEW IDENTITY SECRET.
                    </Text>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>NEW SECRET</Text>
                    <View style={[styles.passwordRow, newPassFocused && styles.inputFocused]}>
                      <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Password"
                        placeholderTextColor="#727D8C"
                        secureTextEntry={!showNewPass}
                        autoCapitalize="none"
                        onFocus={() => setNewPassFocused(true)}
                        onBlur={() => setNewPassFocused(false)}
                        style={styles.passwordInput}
                      />
                      <Pressable onPress={() => setShowNewPass((p) => !p)} hitSlop={12} style={styles.eyeIcon}>
                        <Feather name={showNewPass ? 'eye' : 'eye-off'} size={18} color="#8E99A8" />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>CONFIRM SECRET</Text>
                    <View style={[styles.passwordRow, confirmPassFocused && styles.inputFocused]}>
                      <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="#727D8C"
                        secureTextEntry={!showConfirmPass}
                        autoCapitalize="none"
                        onFocus={() => setConfirmPassFocused(true)}
                        onBlur={() => setConfirmPassFocused(false)}
                        style={styles.passwordInput}
                      />
                      <Pressable onPress={() => setShowConfirmPass((p) => !p)} hitSlop={12} style={styles.eyeIcon}>
                        <Feather name={showConfirmPass ? 'eye' : 'eye-off'} size={18} color="#8E99A8" />
                      </Pressable>
                    </View>
                  </View>

                  <Animated.View style={{ transform: [{ scale: updateScale }] }}>
                    <Pressable
                      {...pressHandlers(updateScale)}
                      onPress={onBackToLogin}
                      style={styles.primaryButton}
                    >
                      <Text style={styles.primaryButtonText}>UPDATE SECRET</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>

      </Animated.View>
    </View>
  );
});

export default ForgotPasswordScreen;

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
    width: SCREEN_WIDTH * 3,
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

  // ── Title ──────────────────────────────────────
  titleSection: {
    marginBottom: 38,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    color: '#A2ACB9',
    lineHeight: 18,
  },
  subtitleAccent: {
    color: '#D4AF37',
  },

  // ── Form fields ────────────────────────────────
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

  // ── OTP ───────────────────────────────────────
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 36,
  },
  otpBox: {
    flex: 1,
    height: 68,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    backgroundColor: '#242424',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  otpInput: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 0,
  },

  // ── Primary button ─────────────────────────────
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

  // ── Footer ─────────────────────────────────────
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
  footerLink: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  footerLinkPressed: {
    opacity: 0.5,
  },
  footerLinkText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});
