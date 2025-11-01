import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../styles';

export const WelcomeHeader = ({ 
  userName, 
  user,
  onNotificationPress,
  onMenuPress 
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get first letter of first name or fallback to 'U'
  const getInitials = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Background Logo */}
        <Image 
          source={require('../../../assets/logo/egourd-high-resolution-logo-white-transparent.png')} 
          style={styles.backgroundLogo}
          resizeMode="contain"
        />
        
        {/* Top Row - Avatar, Name and Action Icons */}
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              {user?.profilePicture ? (
                <Image 
                  source={{ uri: user.profilePicture }} 
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
              )}
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{userName || user?.firstName || 'User'}!</Text>
            </View>
          </View>

          {/* Right side - Action Icons */}
          <View style={styles.rightSection}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={onNotificationPress}
            >
              <MaterialCommunityIcons 
                name="bell-outline" 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={onMenuPress}
            >
              <MaterialCommunityIcons 
                name="dots-vertical" 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logo/egourd-high-resolution-logo-name-grayscale-transparent.png')} 
            style={styles.mainLogo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Ready to scan your gourds?</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.gradient.start,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundLogo: {
    position: 'absolute',
    height: 320,
    width: '100%',
    opacity: 0.1,
    left: -120,
    top: -20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
  nameSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  mainLogo: {
    width: 240,
    height: 80,
    tintColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  userName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
