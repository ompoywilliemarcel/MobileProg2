import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Text style={styles.brand}>OnlineShop</Text>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpText}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Fresh arrivals</Text>
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join now and shop your favorite essentials</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Smith"
              placeholderTextColor="#8B8CA7"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#8B8CA7"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="   Create a password"
                placeholderTextColor="#8B8CA7"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowPassword((value) => !value)}
              >
                <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat password"
              placeholderTextColor="#8B8CA7"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />

            <View style={styles.rowBetween}>
              <View style={styles.rememberWrap}>
                <TouchableOpacity
                  onPress={() => setAgreedToTerms((value) => !value)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: agreedToTerms }}
                >
                  <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                    {agreedToTerms && <Text style={styles.checkboxMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
                <Text style={styles.rememberText}>
                  I agree to{' '}
                  <Link href="/terms" asChild>
                    <Text style={styles.terms}>Terms & Conditions</Text>
                  </Link>
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, !agreedToTerms && styles.primaryButtonDisabled]}
              disabled={!agreedToTerms}
              accessibilityRole="button"
              accessibilityState={{ disabled: !agreedToTerms }}
              accessibilityHint={
                agreedToTerms
                  ? 'Creates your account'
                  : 'Agree to the Terms and Conditions to create an account'
              }
            >
              <Text style={styles.primaryButtonText}>Create account</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or sign up with</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>f</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.signupText}>
            Already have an account?{' '}
            <Link href="/login" asChild>
              <Text style={styles.linkText}>Log in</Text>
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#acd3f2',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.8,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  helpButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  helpText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    marginBottom: 22,
    minHeight: 180,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#CBD5E1',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '400',
    color: '#0d0d0e',
    marginBottom: 14,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 12,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  showButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  showButtonText: {
    color: '#0284C7',
    fontWeight: '600',
    fontSize: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 18,
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#94A3B8',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
    textAlign: 'center',
  },
  rememberText: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#0284C7',
    fontWeight: '600',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#0284C7',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  orText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '600',
  },
  signupText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  terms: {
    color: '#0284C7',
    fontWeight: '600',
  },
  
});

