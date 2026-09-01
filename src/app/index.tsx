import React, { useState } from 'react';
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
            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpText}>Loginssss</Text>
            </TouchableOpacity>
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
                placeholder="Create a password"
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
              <TouchableOpacity style={styles.rememberWrap}>
                <View style={styles.checkbox} />
                <Text style={styles.rememberText}>I agree to terms</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Create account</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or sign up with</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}></Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.linkText}>Log in</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f1ff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
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
    fontWeight: '800',
    color: '#1D1B2A',
    letterSpacing: -0.5,
  },
  helpButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ede7ff',
  },
  helpText: {
    color: '#5B4BDB',
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#1E1B39',
    borderRadius: 28,
    padding: 24,
    marginBottom: 22,
    minHeight: 180,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#A78BFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#D7D5EB',
    marginTop: 8,
    fontSize: 15,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  label: {
    color: '#36344A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E2FF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F1D2C',
    marginBottom: 14,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E2FF',
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
    color: '#5B4BDB',
    fontWeight: '700',
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
    backgroundColor: '#EAE4FF',
    borderWidth: 1,
    borderColor: '#B7A8FF',
    marginRight: 8,
  },
  rememberText: {
    color: '#504D68',
    fontSize: 12,
  },
  linkText: {
    color: '#5B4BDB',
    fontWeight: '700',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#5B4BDB',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  orText: {
    textAlign: 'center',
    color: '#8B8CA7',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F2EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: '#1D1B2A',
    fontSize: 22,
    fontWeight: '700',
  },
  signupText: {
    textAlign: 'center',
    color: '#5B586E',
    marginTop: 24,
    fontSize: 14,
  },
});

