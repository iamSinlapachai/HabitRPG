import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CurrencyPillProps = {
  label: string;
  value: number;
};

const CurrencyPill: React.FC<CurrencyPillProps> = ({ label, value }) => {
  const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{displayValue}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d2d6dc',
    backgroundColor: '#f8fafc',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2933',
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
});

export default CurrencyPill;
