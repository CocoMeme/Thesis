import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles';

export const CustomHeader = ({ 
  user, 
  onNotificationPress, 
  onMenuPress,
  showAvatar = true 
}) => {
  // Get first letter of first name or fallback to 'U'
  const getInitials = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return 'User';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      {/* Left side - Avatar and Name */}
      <View style={styles.leftSection}>
        {showAvatar && (
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
        )}
        <View style={styles.nameContainer}>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.userName}>{getDisplayName()}</Text>
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
            color={theme.colors.text.primary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onMenuPress}
        >
          <MaterialCommunityIcons 
            name="dots-vertical" 
            size={24} 
            color={theme.colors.text.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + theme.spacing.xs : theme.spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
  nameContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  userName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});