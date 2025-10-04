import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Pressable } from 'react-native';

const colors = {
  bg: '#0F172A',
  card: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  muted: '#9CA3AF',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
};

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  const [secure, setSecure] = useState(true);

  const toggleSecure = () => setSecure((prev) => !prev);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
        />
        <Pressable onPress={toggleSecure} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{secure ? 'Show' : 'Hide'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PasswordField;
