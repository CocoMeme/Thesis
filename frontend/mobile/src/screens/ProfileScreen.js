import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles';

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    totalScans: 15,
    accuracy: '92%',
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement sign out functionality
            Alert.alert('Info', 'Sign out functionality will be implemented next');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Info', 'Edit profile functionality will be implemented next');
  };

  const handleExportData = () => {
    Alert.alert('Info', 'Export data functionality will be implemented next');
  };

  const handleSupport = () => {
    Alert.alert('Info', 'Support functionality will be implemented next');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Info', 'Privacy policy will be implemented next');
  };

  const handleTermsOfService = () => {
    Alert.alert('Info', 'Terms of service will be implemented next');
  };

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const getIconName = (emoji) => {
    const iconMap = {
      '🌙': 'weather-night',
      '📱': 'cellphone',
      '📤': 'export',
      '🗑️': 'delete-outline',
      '❓': 'help-circle-outline',
      '🔒': 'lock-outline',
      '📄': 'file-document-outline',
      '🔄': 'refresh',
      '❌': 'close-circle-outline'
    };
    return iconMap[emoji] || 'help-circle-outline';
  };

  const ProfileItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.itemLeft}>
        <MaterialCommunityIcons 
          name={getIconName(icon)} 
          size={24} 
          color={theme.colors.primary} 
          style={styles.itemIcon}
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <MaterialCommunityIcons name="chevron-right" size={20} color="#9E9E9E" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userJoinDate}>Member since {user.joinDate}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ProfileSection title="Statistics">
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.accuracy}</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Species Found</Text>
          </View>
        </View>
      </ProfileSection>

      <ProfileSection title="Settings">
        <ProfileItem
          icon="🔔"
          title="Notifications"
          subtitle="Scan reminders and updates"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
            />
          }
        />
        <ProfileItem
          icon="🌙"
          title="Dark Mode"
          subtitle="Enable dark theme"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
            />
          }
        />
        <ProfileItem
          icon="📱"
          title="App Version"
          subtitle="1.0.0"
        />
      </ProfileSection>

      <ProfileSection title="Data">
        <ProfileItem
          icon="📤"
          title="Export Data"
          subtitle="Download your scan history"
          onPress={handleExportData}
        />
        <ProfileItem
          icon="🗑️"
          title="Clear History"
          subtitle="Remove all scan data"
          onPress={() => Alert.alert('Info', 'Clear history functionality will be implemented next')}
        />
      </ProfileSection>

      <ProfileSection title="Support & Legal">
        <ProfileItem
          icon="❓"
          title="Help & Support"
          subtitle="Get help with the app"
          onPress={handleSupport}
        />
        <ProfileItem
          icon="🔒"
          title="Privacy Policy"
          subtitle="How we handle your data"
          onPress={handlePrivacyPolicy}
        />
        <ProfileItem
          icon="📄"
          title="Terms of Service"
          subtitle="App usage terms"
          onPress={handleTermsOfService}
        />
      </ProfileSection>

      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userJoinDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: 1,
    padding: theme.spacing.md,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: theme.spacing.md,
    width: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text,
  },
  itemSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  itemArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  signOutSection: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.surface,
  },
});