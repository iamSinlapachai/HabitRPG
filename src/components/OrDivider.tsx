import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colors = {
  bg: '#0F172A',
  card: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  muted: '#9CA3AF',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
};

const OrDivider: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  text: {
    color: colors.muted,
    marginHorizontal: 12,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default OrDivider;
