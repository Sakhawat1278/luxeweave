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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AuthFooter from './AuthFooter';

export default function SignupScreen({ onBack, onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
          {/* Top spacer matching login screen */}
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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>JOIN THE CURATED COMMUNITY</Text>
              </View>

              {/* Input 1: FULL NAME */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>FULL NAME</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your Name"
                  placeholderTextColor="#727D8C"
                  autoCapitalize="words"
                  autoCorrect={false}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  style={[
                    styles.input,
                    nameFocused && styles.inputFocused,
                  ]}
                />
              </View>

              {/* Input 2: EMAIL ADDRESS */}
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
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused,
                  ]}
                />
              </View>

              {/* Input 3: PASSWORD */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <View
                  style={[
                    styles.passwordRow,
                    passwordFocused && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
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

              {/* Terms & Privacy Agreement Checkbox (Identical design to LoginScreen) */}
              <Pressable
                onPress={() => setAgreed((prev) => !prev)}
                style={styles.termsRow}
                hitSlop={8}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreed && styles.checkboxChecked,
                  ]}
                >
                  {agreed && (
                    <Feather name="check" size={11} color="#0A0A0A" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I AGREE TO THE{' '}
                  <Text style={styles.termsHighlight}>TERMS OF SERVICE</Text>
                  {' '}AND{' '}
                  <Text style={styles.termsHighlight}>PRIVACY POLICY</Text>.
                </Text>
              </Pressable>

              {/* Tall REGISTER NOW Button (62px) */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => console.log('Register pressed', fullName, email)}
                  style={styles.registerButton}
                >
                  <Text style={styles.registerButtonText}>REGISTER NOW</Text>
                </Pressable>
              </Animated.View>
            </View>
          </ScrollView>

          {/* Footer: ALREADY A MEMBER? LOG IN with unified professional transition */}
          <AuthFooter
            promptText="ALREADY A MEMBER? "
            actionText="LOG IN"
            onPress={onNavigateToLogin || onBack}
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 28,
    paddingRight: 8,
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
  registerButton: {
    backgroundColor: '#FFFFFF',
    height: 62,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
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
  loginLinkText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});
