import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../styles';

export const TestPlantForm = ({ onCancel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Plant Form</Text>
      <Text style={styles.subtitle}>If you can see this, the navigation works!</Text>
      
      <TouchableOpacity style={styles.button} onPress={onCancel}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
  },
  buttonText: {
    ...theme.typography.button,
    color: '#FFFFFF',
  },
});