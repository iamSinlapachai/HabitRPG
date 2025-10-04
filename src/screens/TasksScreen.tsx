import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TasksScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default TasksScreen;
