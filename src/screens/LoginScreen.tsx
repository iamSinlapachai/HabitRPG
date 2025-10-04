import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AuthCard from '../components/AuthCard';
import SocialButton from '../components/SocialButton';

const colors = {
  bg: '#0F172A',
  card: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  muted: '#9CA3AF',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
  error: '#F87171',
};

type Errors = {
  email?: string;
  password?: string;
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [secure, setSecure] = useState(true);

  const toggleRemember = () => setRemember((prev) => !prev);
  const toggleSecure = () => setSecure((prev) => !prev);

  const handleLogin = () => {
    const nextErrors: Errors = {};
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      Alert.alert('Signed in', JSON.stringify({ email, remember }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <AuthCard>
            <View style={styles.headerIcon} />
            <Text style={styles.title}>Welcome</Text>

            <View style={styles.fieldGroup}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secure}
                />
                <Pressable onPress={toggleSecure} style={styles.toggleSecureButton}>
                  <Text style={styles.toggleSecureText}>{secure ? 'Show' : 'Hide'}</Text>
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.optionsRow}>
              <Pressable style={styles.rememberContainer} onPress={toggleRemember}>
                <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                  {remember ? <Text style={styles.checkboxCheck}>✓</Text> : null}
                </View>
                <Text style={styles.optionText}>Remember password</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.forgotText}>Forget your password?</Text>
              </Pressable>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Log in</Text>
            </Pressable>

            <Text style={styles.helperText}>Or</Text>

            <SocialButton text="Continue with Google" onPress={() => console.log('Google')} />
          </AuthCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Pressable>
              <Text style={styles.footerLink}>Sing up</Text>
            </Pressable>
          </View>
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
    paddingVertical: 32,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  fieldGroup: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 16,
  },
  passwordInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 8,
  },
  toggleSecureButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  toggleSecureText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.muted,
    marginRight: 6,
  },
  footerLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export default LoginScreen;
