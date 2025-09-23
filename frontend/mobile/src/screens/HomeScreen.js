import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles';

export default function HomeScreen({ navigation }) {
  const handleNavigateToCamera = () => {
    navigation.navigate('Camera');
  };

  const handleNavigateToHistory = () => {
    navigation.navigate('History');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="leaf" size={32} color="#4CAF50" />
          <Text style={styles.title}>Gourd Scanner</Text>
        </View>
        <Text style={styles.subtitle}>Identify gourds with AI</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={[styles.actionCard, styles.primaryCard]}
            onPress={handleNavigateToCamera}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons name="camera" size={32} color="#FFFFFF" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Scan Gourd</Text>
              <Text style={styles.cardSubtitle}>Take a photo to identify</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleNavigateToHistory}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons name="history" size={32} color="#4CAF50" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>View History</Text>
              <Text style={styles.cardSubtitle}>See your past scans</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.recentScans}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cellphone" size={48} color="#9E9E9E" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubtext}>Start by scanning your first gourd!</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  quickActions: {
    marginBottom: theme.spacing.xl,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  recentScans: {
    marginBottom: theme.spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});