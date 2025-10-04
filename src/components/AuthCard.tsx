import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

const colors = {
  bg: '#0F172A',
  card: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  muted: '#9CA3AF',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
};

interface AuthCardProps {
  children: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    width: '90%',
    alignSelf: 'center',
  },
});

export default AuthCard;
