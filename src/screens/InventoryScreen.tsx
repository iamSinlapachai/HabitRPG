import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const InventoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
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

export default InventoryScreen;
