import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AuthCard from '../components/AuthCard';
import LabeledField from '../components/LabeledField';
import OrDivider from '../components/OrDivider';
import PasswordField from '../components/PasswordField';
import SocialButton from '../components/SocialButton';

const colors = {
  bg: '#0F172A',
  card: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  muted: '#9CA3AF',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
  accent: '#22D3EE',
};

type Errors = {
  email?: string;
  password?: string;
};

type SignInScreenProps = {
  onSignIn?: (payload: { email: string; rememberMe: boolean }) => void;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleRememberMe = () => setRememberMe((prev) => !prev);

  const handleSubmit = () => {
    const nextErrors: Errors = {};
    const trimmedEmail = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (password.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      Alert.alert('Signed in', `Welcome back, ${trimmedEmail}!`);
      onSignIn?.({ email: trimmedEmail, rememberMe });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <AuthCard>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>H</Text>
            </View>

            <Text style={styles.title}>Sign in to Habitica</Text>
            <Text style={styles.subtitle}>
              Continue your adventure by accessing your character and quests.
            </Text>

            <View style={styles.fieldGroup}>
              <LabeledField
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <PasswordField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <View style={styles.optionsRow}>
              <Pressable style={styles.rememberMe} onPress={toggleRememberMe}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Text style={styles.checkboxCheck}>✓</Text> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Forgot password', 'Password reset flow coming soon!')}>
                <Text style={styles.linkText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </Pressable>

            <OrDivider />

            <SocialButton text="Continue with Google" onPress={() => Alert.alert('Google Sign-In')} />
            <SocialButton text="Continue with Apple" onPress={() => Alert.alert('Apple Sign-In')} />
          </AuthCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Habitica?</Text>
            <Pressable onPress={() => Alert.alert('Create account')}>
              <Text style={styles.linkText}>Create an account</Text>
            </Pressable>
          </View>

          <Text style={styles.termsText}>
            By continuing you agree to our
            <Text style={styles.inlineLink}> Terms of Service</Text> and
            <Text style={styles.inlineLink}> Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
    gap: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  fieldGroup: {
    width: '100%',
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: colors.text,
    fontSize: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
  },
  termsText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 24,
  },
  inlineLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignInScreen;
