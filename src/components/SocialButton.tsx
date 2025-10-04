import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const colors = {
  bg: '#0F172A',
  card: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  muted: '#9CA3AF',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
};

interface SocialButtonProps {
  text: string;
  onPress?: () => void;
  variant?: 'default' | 'primary';
}

const SocialButton: React.FC<SocialButtonProps> = ({ text, onPress, variant = 'default' }) => {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.defaultButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.defaultText]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  defaultButton: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultText: {
    color: colors.text,
  },
  primaryText: {
    color: colors.primaryText,
  },
});

export default SocialButton;
