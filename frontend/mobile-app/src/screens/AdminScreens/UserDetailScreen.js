import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../../services';
import { theme } from '../../styles';

export const UserDetailScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('');

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userResult, statsResult] = await Promise.all([
        adminService.getUserProfile(userId),
        adminService.getUserStats(userId),
      ]);

      if (userResult.success) {
        setUser(userResult.user);
      }
      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const action = user.isActive ? 'deactivate' : 'activate';
    
    Alert.alert(
      `${action === 'activate' ? 'Activate' : 'Deactivate'} User`,
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'activate' ? 'Activate' : 'Deactivate',
          style: action === 'deactivate' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setActionLoading(true);
              const result = action === 'activate'
                ? await adminService.activateUser(userId)
                : await adminService.deactivateUser(userId);

              if (result.success) {
                Alert.alert('Success', `User ${action}d successfully`);
                loadUserData();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              Alert.alert('Error', `Failed to ${action} user`);
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = async (newRole) => {
    try {
      setActionLoading(true);
      const result = await adminService.changeUserRole(userId, newRole);

      if (result.success) {
        Alert.alert('Success', 'User role updated successfully');
        setShowRoleModal(false);
        loadUserData();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for suspension');
      return;
    }

    try {
      setActionLoading(true);
      const duration = suspendDuration ? parseInt(suspendDuration) : null;
      const result = await adminService.suspendUser(userId, suspendReason, duration);

      if (result.success) {
        Alert.alert('Success', 'User suspended successfully');
        setShowSuspendModal(false);
        setSuspendReason('');
        setSuspendDuration('');
        loadUserData();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              const result = await adminService.deleteUser(userId, false);

              if (result.success) {
                Alert.alert('Success', 'User deleted successfully');
                navigation.goBack();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.text.secondary} />
        <Text style={styles.loadingText}>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + 'DD']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user.firstName?.[0] || user.username?.[0] || user.email?.[0] || '?').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username || 'No name'}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getRoleBadgeColor(user.role) }]}>
              <Text style={[styles.badgeText, { color: getRoleTextColor(user.role) }]}>
                {user.role}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: user.isActive ? '#4CAF5020' : '#F4433620' }]}>
              <Text style={[styles.badgeText, { color: user.isActive ? '#4CAF50' : '#F44336' }]}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            {user.isEmailVerified && (
              <View style={[styles.badge, { backgroundColor: '#2196F320' }]}>
                <Ionicons name="shield-checkmark" size={12} color="#2196F3" />
                <Text style={[styles.badgeText, { color: '#2196F3', marginLeft: 4 }]}>
                  Verified
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="person" label="Username" value={user.username || 'N/A'} />
            <InfoRow icon="mail" label="Email" value={user.email} />
            <InfoRow icon="key" label="Provider" value={user.provider} />
            <InfoRow icon="calendar" label="Member Since" value={formatDate(user.createdAt)} />
            <InfoRow icon="time" label="Last Login" value={user.lastLogin ? formatDate(user.lastLogin) : 'Never'} />
            <InfoRow icon="log-in" label="Login Count" value={user.loginCount?.toString() || '0'} />
          </View>
        </View>

        {/* User Stats */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Statistics</Text>
            <View style={styles.statsGrid}>
              <StatBox
                icon="scan"
                label="Total Scans"
                value={stats.stats.totalScans || 0}
                color={theme.colors.primary}
              />
              <StatBox
                icon="leaf"
                label="Gourds Detected"
                value={stats.stats.totalGourdsDetected || 0}
                color="#4CAF50"
              />
              <StatBox
                icon="checkmark-circle"
                label="Accurate Scans"
                value={stats.stats.accurateScans || 0}
                color="#2196F3"
              />
              <StatBox
                icon="stats-chart"
                label="Accuracy"
                value={`${getAccuracy(stats.stats)}%`}
                color="#FF9800"
              />
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsCard}>
            <ActionButton
              icon={user.isActive ? 'close-circle' : 'checkmark-circle'}
              label={user.isActive ? 'Deactivate Account' : 'Activate Account'}
              color={user.isActive ? '#F44336' : '#4CAF50'}
              onPress={handleToggleStatus}
              loading={actionLoading}
            />
            <ActionButton
              icon="shield"
              label="Change Role"
              color={theme.colors.primary}
              onPress={() => setShowRoleModal(true)}
              loading={actionLoading}
            />
            <ActionButton
              icon="pause-circle"
              label="Suspend Account"
              color="#FF9800"
              onPress={() => setShowSuspendModal(true)}
              loading={actionLoading}
            />
            <ActionButton
              icon="trash"
              label="Delete Account"
              color="#F44336"
              onPress={handleDelete}
              loading={actionLoading}
            />
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Role Change Modal */}
      <Modal
        visible={showRoleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change User Role</Text>
            <Text style={styles.modalSubtitle}>
              Current role: <Text style={styles.modalHighlight}>{user.role}</Text>
            </Text>
            
            <View style={styles.roleOptions}>
              {['user', 'researcher', 'admin'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleOption, user.role === role && styles.roleOptionDisabled]}
                  onPress={() => handleChangeRole(role)}
                  disabled={user.role === role || actionLoading}
                >
                  <View style={[styles.roleOptionDot, { backgroundColor: getRoleTextColor(role) }]} />
                  <Text style={styles.roleOptionText}>{capitalizeFirst(role)}</Text>
                  {user.role === role && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowRoleModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        visible={showSuspendModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSuspendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suspend Account</Text>
            <Text style={styles.modalSubtitle}>
              Temporarily suspend {user.username || user.email}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Reason for suspension"
              value={suspendReason}
              onChangeText={setSuspendReason}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={styles.input}
              placeholder="Duration (days) - Optional"
              value={suspendDuration}
              onChangeText={setSuspendDuration}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSuspend}
              disabled={actionLoading}
            >
              <LinearGradient
                colors={['#FF9800', '#FF9800DD']}
                style={styles.modalSubmitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.modalSubmitText}>Suspend Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowSuspendModal(false);
                setSuspendReason('');
                setSuspendDuration('');
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={20} color={theme.colors.text.secondary} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const StatBox = ({ icon, label, value, color }) => (
  <View style={styles.statBox}>
    <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButton = ({ icon, label, color, onPress, loading }) => (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={20} color={color} />
    <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={color} />
  </TouchableOpacity>
);

const getRoleBadgeColor = (role) => {
  const colors = {
    admin: '#F4433620',
    researcher: '#FF980020',
    user: '#4CAF5020',
  };
  return colors[role] || '#9E9E9E20';
};

const getRoleTextColor = (role) => {
  const colors = {
    admin: '#F44336',
    researcher: '#FF9800',
    user: '#4CAF50',
  };
  return colors[role] || '#9E9E9E';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getAccuracy = (stats) => {
  if (!stats.totalScans || stats.totalScans === 0) return 0;
  return Math.round((stats.accurateScans / stats.totalScans) * 100);
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text.secondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text.secondary,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    textTransform: 'capitalize',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text.secondary,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: theme.colors.text.primary,
    marginLeft: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statBox: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text.secondary,
    marginBottom: 24,
  },
  modalHighlight: {
    fontFamily: 'Poppins_600SemiBold',
    color: theme.colors.primary,
  },
  roleOptions: {
    marginBottom: 24,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.background.secondary,
    marginBottom: 8,
  },
  roleOptionDisabled: {
    opacity: 0.6,
  },
  roleOptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  roleOptionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: theme.colors.text.primary,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.text.primary,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  modalSubmitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  modalSubmitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  modalCancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: theme.colors.text.secondary,
  },
});
