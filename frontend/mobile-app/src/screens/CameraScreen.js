import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CameraScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Camera Screen - Coming Soon!</Text>
      <Text style={styles.subtitle}>
        Camera integration will be added here
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