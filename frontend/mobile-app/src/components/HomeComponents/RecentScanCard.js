import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles';

export const RecentScanCard = ({ imageUri, result, date, onPress }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getStatusConfig = (result) => {
    if (result?.toLowerCase().includes('ready')) {
      return {
        color: theme.colors.primary,
        gradient: [theme.colors.primary, '#4a8a3f'],
        icon: 'checkmark-circle',
      };
    }
    if (result?.toLowerCase().includes('almost')) {
      return {
        color: theme.colors.secondary,
        gradient: [theme.colors.secondary, '#c9c940'],
        icon: 'time-outline',
      };
    }
    return {
      color: theme.colors.info,
      gradient: [theme.colors.info, '#2874a6'],
      icon: 'information-circle',
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const statusConfig = getStatusConfig(result);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.image}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
            {isLoading && (
              <View style={[styles.image, styles.loadingOverlay]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
              style={styles.imageOverlay}
            />
          </>
        ) : (
          <LinearGradient
            colors={['#f5f5f5', '#e0e0e0']}
            style={[styles.image, styles.placeholderImage]}
          >
            <Ionicons name="image-outline" size={32} color={theme.colors.text.secondary} />
          </LinearGradient>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.result} numberOfLines={1}>{result || 'Analysis Result'}</Text>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>
        <LinearGradient
          colors={[statusConfig.color + '25', statusConfig.color + '15']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusBadge}
        >
          <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {result?.split(' ')[0] || 'Completed'}
          </Text>
        </LinearGradient>
      </View>
      <Ionicons name="chevron-forward" size={22} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.medium,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: theme.borderRadius.medium,
    borderBottomRightRadius: theme.borderRadius.medium,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  result: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.small,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
  },
});
