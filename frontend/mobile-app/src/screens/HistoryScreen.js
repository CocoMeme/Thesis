import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History Screen</Text>
      <Text style={styles.subtitle}>
        Your scan history will appear here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});