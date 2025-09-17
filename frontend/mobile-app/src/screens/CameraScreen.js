import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles';

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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  text: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});