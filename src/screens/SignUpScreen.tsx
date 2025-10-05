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
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type SignUpScreenProps = {
  onSignUp?: (payload: { username: string; email: string }) => void;
  onNavigateToSignIn?: () => void;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToSignIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = () => {
    const nextErrors: Errors = {};

    if (username.trim().length < 3) {
      nextErrors.username = 'Display name must be at least 3 characters.';
    }

    const trimmedEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (password.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSignUp?.({ username: username.trim(), email: trimmedEmail });
      Alert.alert('Account created', 'Welcome to Habitica!');
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

            <Text style={styles.title}>Create your Habitica account</Text>
            <Text style={styles.subtitle}>
              Start building better habits and track your progress on every quest.
            </Text>

            <View style={styles.fieldGroup}>
              <LabeledField
                label="Display name"
                placeholder="Choose a display name"
                value={username}
                onChangeText={setUsername}
              />
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>

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
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <PasswordField
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Sign up</Text>
            </Pressable>

            <OrDivider />

            <SocialButton text="Continue with Google" onPress={() => Alert.alert('Google Sign-Up')} />
            <SocialButton text="Continue with Apple" onPress={() => Alert.alert('Apple Sign-Up')} />
          </AuthCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={onNavigateToSignIn}>
              <Text style={styles.linkText}>Sign in</Text>
            </Pressable>
          </View>

          <Text style={styles.termsText}>
            By creating an account you agree to our
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
  linkText: {
    color: colors.primary,
    fontWeight: '600',
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

export default SignUpScreen;
