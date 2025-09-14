import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components';
import { theme } from '../styles';

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Gourd Scanner</Text>
        <Text style={styles.subtitle}>
          Scan your gourds to predict harvest readiness
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Start Scanning"
            onPress={() => navigation.navigate('Camera')}
            style={styles.button}
          />
          
          <Button
            title="View History"
            variant="outline"
            onPress={() => navigation.navigate('History')}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});