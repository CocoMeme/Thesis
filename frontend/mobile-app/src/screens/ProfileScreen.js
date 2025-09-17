import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '../services';
import { theme } from '../styles';

export const ProfileScreen = ({ navigation, onAuthChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ],
      { cancelable: false }
    );
  };

  const performLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      // Trigger auth state change to refresh navigation
      if (onAuthChange) {
        onAuthChange();
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ProfileItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.profileItemLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
      <View style={styles.profileItemRight}>
        <Text style={styles.profileItemValue}>{value}</Text>
        {onPress && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.text.secondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-box" size={60} color={theme.colors.primary} />
          </View>
          <Text style={styles.userName}>
            {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.profileItems}>
            <ProfileItem
              icon="account"
              title="First Name"
              value={user?.firstName || '-'}
            />
            <ProfileItem
              icon="account-outline"
              title="Last Name"
              value={user?.lastName || '-'}
            />
            <ProfileItem
              icon="email"
              title="Email"
              value={user?.email || '-'}
            />
            <ProfileItem
              icon="shield-check"
              title="Account Status"
              value={user?.emailVerified ? 'Verified' : 'Unverified'}
            />
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.profileItems}>
            <ProfileItem
              icon="history"
              title="Scan History"
              value="View your scans"
              onPress={() => navigation.navigate('History')}
            />
            <ProfileItem
              icon="help-circle"
              title="Help & Support"
              value="Get help"
            />
            <ProfileItem
              icon="information"
              title="About"
              value="App version 1.0.0"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={loading}
        >
          <MaterialCommunityIcons 
            name="logout" 
            size={20} 
            color="#FFFFFF" 
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>
            {loading ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontSize: theme.typography.h2.fontSize,
    fontFamily: theme.typography.h2.fontFamily,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontFamily: theme.typography.h2.fontFamily,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  profileItems: {
    backgroundColor: theme.colors.surface,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemValue: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIcon: {
    marginRight: theme.spacing.sm,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: theme.typography.button.fontSize,
    fontFamily: theme.typography.button.fontFamily,
  },
});