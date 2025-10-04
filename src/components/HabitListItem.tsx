import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HabitListItemProps = {
  title: string;
  reward: string;
  status: 'completed' | 'startable';
  onStart?: () => void;
};

const HabitListItem: React.FC<HabitListItemProps> = ({ title, reward, status, onStart }) => {
  const isCompleted = status === 'completed';

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <View style={styles.infoContainer}>
        {isCompleted ? <Text style={styles.checkMark}>✅</Text> : null}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
          <Text style={[styles.reward, isCompleted && styles.completedReward]}>{reward}</Text>
        </View>
      </View>
      {status === 'startable' ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 12,
  },
  completedContainer: {
    backgroundColor: '#f3f4f6',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkMark: {
    fontSize: 18,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2933',
  },
  completedText: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  reward: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  completedReward: {
    color: '#9ca3af',
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HabitListItem;
