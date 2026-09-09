import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import AuthFooter from './AuthFooter';

export default function LoginScreen({ onBack, onNavigateToJoin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <View style={styles.topSpacer} />

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
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor="#727D8C"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused,
                  ]}
                />
              </View>

              {/* SECRET Input */}
              <View style={styles.fieldWrapper}>
                <View style={styles.secretHeader}>
                  <Text style={styles.fieldLabel}>SECRET</Text>
                  <Pressable
                    onPress={() => console.log('Lost password pressed')}
                    hitSlop={10}
                  >
                    <Text style={styles.lostLink}>LOST?</Text>
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.passwordRow,
                    passwordFocused && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#727D8C"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    style={styles.passwordInput}
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={12}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showPassword ? 'eye' : 'eye-off'}
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

              {/* Tall SIGN IN Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => console.log('Sign in pressed')}
                  style={styles.signInButton}
                >
                  <Text style={styles.signInButtonText}>SIGN IN</Text>
                </Pressable>
              </Animated.View>

              </Animated.View>
            </View>
          </ScrollView>

          {/* Footer: BECOME A MEMBER. JOIN NOW with unified professional transition */}
          <AuthFooter
            promptText="BECOME A MEMBER. "
            actionText="JOIN NOW"
            onPress={onNavigateToJoin}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSpacer: {
    height: 48,
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
    marginBottom: 24,
    marginTop: -8,
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
  signInButton: {
    backgroundColor: '#FFFFFF',
    height: 62,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13.5,
    color: '#0A0A0A',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  dividerText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 2,
    color: '#8E99A8',
    paddingHorizontal: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  socialButton: {
    flex: 1,
    height: 62,
    borderRadius: 4,
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
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
  joinNowText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});
