import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../styles';

export const QuickActionCard = ({ icon, title, subtitle, color, gradientColors, isPrimary, onPress }) => {
  if (isPrimary) {
    // Primary action with gradient background
    return (
      <TouchableOpacity style={styles.primaryContainer} onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={gradientColors || [color, color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryGradient}
        >
          <View style={styles.primaryIconContainer}>
            <MaterialCommunityIcons name={icon} size={32} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.primaryTitle}>{title}</Text>
            <Text style={styles.primarySubtitle}>{subtitle}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.8)" />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular action with gradient border
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <LinearGradient
          colors={gradientColors || [color + '40', color + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <MaterialCommunityIcons name={icon} size={26} color={color} />
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md + 4,
  },
  primaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  primarySubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    marginBottom: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
});
