import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type StatBarProps = {
  label: string;
  value: number;
  max: number;
  color: string;
};

const formatNumber = (num: number) => {
  return Number.isInteger(num) ? num.toString() : num.toFixed(1);
};

const StatBar: React.FC<StatBarProps> = ({ label, value, max, color }) => {
  const clampedMax = Math.max(max, 1);
  const clampedValue = Math.min(Math.max(value, 0), clampedMax);
  const progress = clampedValue / clampedMax;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {formatNumber(clampedValue)}/{formatNumber(clampedMax)}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
  },
  barBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});

export default StatBar;
