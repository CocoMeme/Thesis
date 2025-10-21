import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '../services';
import { theme } from '../styles';

export const ProfileScreen = ({ navigation, onAuthChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationPin, setVerificationPin] = useState('');
  const [sendingPin, setSendingPin] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);

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

  const handleVerifyEmail = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'No email found');
      return;
    }

    if (user.emailVerified || user.isEmailVerified) {
      Alert.alert('Already Verified', 'Your email is already verified');
      return;
    }

    setSendingPin(true);
    const result = await authService.sendVerificationPin(user.email);
    setSendingPin(false);

    if (result.success) {
      setVerificationModalVisible(true);
      Alert.alert('Success', 'Verification PIN sent to your email. Please check your inbox.');
    } else {
      Alert.alert('Error', result.message || 'Failed to send verification PIN');
    }
  };

  const handleVerifyPin = async () => {
    if (!verificationPin || verificationPin.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit PIN');
      return;
    }

    setVerifyingPin(true);
    const result = await authService.verifyEmailWithPin(user.email, verificationPin);
    setVerifyingPin(false);

    if (result.success) {
      setVerificationModalVisible(false);
      setVerificationPin('');
      Alert.alert('Success', 'Email verified successfully!');
      // Reload user data
      await loadUserData();
    } else {
      Alert.alert('Error', result.message || 'Failed to verify email');
    }
  };

  const handleResendPin = async () => {
    setSendingPin(true);
    const result = await authService.sendVerificationPin(user.email);
    setSendingPin(false);

    if (result.success) {
      Alert.alert('Success', 'New verification PIN sent to your email');
      setVerificationPin('');
    } else {
      Alert.alert('Error', result.message || 'Failed to resend verification PIN');
    }
  };

  const ProfileItem = ({ icon, title, value, onPress, badge, badgeColor }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.profileItemLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
      <View style={styles.profileItemRight}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor || theme.colors.primary }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.profileItemValue}>{value}</Text>
        {onPress && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.text.secondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const isVerified = user?.emailVerified || user?.isEmailVerified;

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
              value={isVerified ? 'Verified' : 'Unverified'}
              badge={isVerified ? 'Verified' : 'Not Verified'}
              badgeColor={isVerified ? theme.colors.success : theme.colors.warning}
              onPress={!isVerified ? handleVerifyEmail : undefined}
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

      {/* Verification Modal */}
      <Modal
        visible={verificationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVerificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify Your Email</Text>
              <TouchableOpacity onPress={() => setVerificationModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter the 6-digit PIN sent to your email address
            </Text>

            <TextInput
              style={styles.pinInput}
              value={verificationPin}
              onChangeText={setVerificationPin}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor={theme.colors.text.secondary}
            />

            <TouchableOpacity
              style={[styles.verifyButton, verifyingPin && styles.buttonDisabled]}
              onPress={handleVerifyPin}
              disabled={verifyingPin}
            >
              {verifyingPin ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resendButton, sendingPin && styles.buttonDisabled]}
              onPress={handleResendPin}
              disabled={sendingPin}
            >
              <Text style={styles.resendButtonText}>
                {sendingPin ? 'Sending...' : 'Resend PIN'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: theme.typography.body.fontFamily,
    color: '#FFFFFF',
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontFamily: theme.typography.h2.fontFamily,
    color: theme.colors.text.primary,
  },
  modalDescription: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  pinInput: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: 24,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: theme.spacing.lg,
  },
  verifyButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.button.fontSize,
    fontFamily: theme.typography.button.fontFamily,
    fontWeight: '600',
  },
  resendButton: {
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  resendButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});