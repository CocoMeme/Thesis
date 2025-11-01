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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '../services';
import { theme } from '../styles';

export const ProfileScreen = ({ navigation, onAuthChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationPin, setVerificationPin] = useState('');
  const [sendingPin, setSendingPin] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);

  // Logo configuration - adjust these values to customize the logo
  const logoConfig = {
    size: 270,           // Logo width and height
    opacity: 0.15,        // Logo opacity (0.0 to 1.0)
    top: -30,             // Distance from top
    right: -10,           // Distance from right
  };

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
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: performLogout },
      ],
      { cancelable: false }
    );
  };

  const performLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
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

  const renderProfileTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <View style={styles.profileItems}>
          <ProfileItem icon="account" title="First Name" value={user?.firstName || '-'} />
          <ProfileItem icon="account-outline" title="Last Name" value={user?.lastName || '-'} />
          <ProfileItem icon="email" title="Email" value={user?.email || '-'} />
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.profileItems}>
          <ProfileItem
            icon="history"
            title="Scan History"
            value="View your scans"
            onPress={() => navigation.navigate('History')}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.profileItems}>
          <ProfileItem icon="bell-outline" title="Notifications" value="Manage alerts" />
          <ProfileItem icon="translate" title="Language" value="English" />
          <ProfileItem icon="theme-light-dark" title="Theme" value="Light Mode" />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.profileItems}>
          <ProfileItem icon="help-circle" title="Help & Support" value="Get help" />
          <ProfileItem icon="information" title="About" value="App v1.0.0" />
          <ProfileItem icon="cube-outline" title="Model Version" value="Model v1.10.30" />
          <ProfileItem icon="file-document" title="Privacy Policy" value="Read policy" />
          <ProfileItem icon="shield-check" title="Terms of Service" value="Read terms" />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>{loading ? 'Logging out...' : 'Logout'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Background Logo */}
        <Image
          source={require('../../assets/logo/egourd-high-resolution-logo-white-transparent.png')}
          style={[
            styles.backgroundLogo,
            {
              width: logoConfig.size,
              height: logoConfig.size,
              opacity: logoConfig.opacity,
              top: logoConfig.top,
              right: logoConfig.right,
            }
          ]}
          resizeMode="contain"
        />
        
        <View style={styles.profileHeaderContainer}>
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={40} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={activeTab === 'profile' ? theme.colors.primary : theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <MaterialCommunityIcons
            name="cog"
            size={20}
            color={activeTab === 'settings' ? theme.colors.primary : theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'profile' ? renderProfileTab() : renderSettingsTab()}
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
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  header: { 
    paddingVertical: theme.spacing.xl, 
    paddingHorizontal: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundLogo: {
    position: 'absolute',
  },
  profileHeaderContainer: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { marginRight: theme.spacing.md },
  avatarImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: '#FFFFFF' },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfoContainer: { flex: 1, justifyContent: 'center' },
  userName: {
    fontSize: theme.typography.h2.fontSize,
    fontFamily: theme.typography.h2.fontFamily,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  activeTab: { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.secondary,
  },
  activeTabText: { color: theme.colors.primary, fontFamily: theme.fonts.semiBold },
  tabContent: { flex: 1 },
  section: { marginBottom: theme.spacing.lg, marginTop: theme.spacing.md },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  profileItems: { backgroundColor: theme.colors.surface },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  profileItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  profileItemTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  profileItemRight: { flexDirection: 'row', alignItems: 'center' },
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
  logoutButtonDisabled: { opacity: 0.6 },
  logoutIcon: { marginRight: theme.spacing.sm },
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
  resendButton: { padding: theme.spacing.sm, alignItems: 'center' },
  resendButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
  },
  buttonDisabled: { opacity: 0.6 },
});
