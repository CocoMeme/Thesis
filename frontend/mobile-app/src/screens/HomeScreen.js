import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { 
  WelcomeHeader, 
  QuickActionCard, 
  RecentScanCard,
  TipCard,
  CustomAlert,
  NewsCard,
  NewsModal,
} from '../components';
import { theme } from '../styles';
import { getAllNews, getPopupNews, markNewsAsRead } from '../services/newsService';
import { authService, connectionService } from '../services';

const TAB_BAR_HEIGHT = 70;

export const HomeScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  // Top Banner
  // Mock data - replace with real data from API/storage
  const [userName] = useState('Coco Meme');
  const [stats] = useState({
    totalScans: 24,
    readyGourds: 18,
    pendingGourds: 6,
  });
  
  // User state
  const [user, setUser] = useState(null);
  
  // Load user data
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

  // Handlers for header buttons
  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'Notification feature coming soon!');
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Menu Options', 
      'What would you like to do?',
      [
        { text: 'How to Use', onPress: () => navigation.navigate('HowToUse') },
        { text: 'Settings', onPress: () => console.log('Settings pressed') },
        { text: 'Help', onPress: () => console.log('Help pressed') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  const [recentScans] = useState([
    {
      id: '1',
      imageUri: null,
      result: 'Ready for Harvest',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      imageUri: null,
      result: 'Almost Ready',
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [alert, setAlert] = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] });
  const [news, setNews] = useState([]);
  const [popupNews, setPopupNews] = useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const tips = [
    'Take photos in good lighting for better analysis results.',
    'Position the gourd within the guide frame for accurate scanning.',
    'Scan gourds regularly to track their ripeness progression.',
    'Clean the camera lens before scanning for clearer images.',
  ];

  const summaryStats = [
    { id: 'total', label: 'Total scans', value: stats.totalScans || 0 },
    { id: 'ready', label: 'Ready', value: stats.readyGourds || 0 },
    { id: 'pending', label: 'Pending', value: stats.pendingGourds || 0 },
  ];

  const newsPreview = news.slice(0, showDetails ? 3 : 1);

  const quickTools = [
    {
      id: 'history',
      label: 'History',
      icon: 'time-outline',
      action: () => navigation.navigate('History'),
    },
    {
      id: 'howto',
      label: 'How to Use',
      icon: 'help-circle-outline',
      action: () => navigation.navigate('HowToUse'),
    },
    {
      id: 'news',
      label: 'News',
      icon: 'newspaper-outline',
      action: () => navigation.navigate('News'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person-outline',
      action: () => navigation.navigate('Profile'),
    },
  ];

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoadingNews(true);
      
      // Fetch latest news (limited to 5)
      const newsResponse = await getAllNews({ limit: 5 });
      if (newsResponse.success) {
        setNews(newsResponse.data);
      }

      // Fetch popup news if user is logged in
      if (user) {
        try {
          const popupResponse = await getPopupNews();
          if (popupResponse.success && popupResponse.data.length > 0) {
            setPopupNews(popupResponse.data);
          }
        } catch (error) {
          console.log('No popup news or error fetching:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error; // Re-throw to handle in onRefresh
    } finally {
      setLoadingNews(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('🔄 Refreshing data and reconnecting to backend...');
      
      // Check backend connection first
      const connectionCheck = await connectionService.checkBackendConnection();
      
      if (!connectionCheck.connected) {
        console.log('⚠️  Backend not connected, attempting to reconnect...');
        
        // Try to reconnect with retries
        const reconnectResult = await connectionService.reconnectToBackend(3, 2000);
        
        if (!reconnectResult.success) {
          throw new Error('Failed to reconnect to backend server');
        }
        
        console.log(`✅ Reconnected after ${reconnectResult.attempts} attempt(s)`);
      } else {
        console.log('✅ Backend connection is healthy');
      }
      
      // Reload user data
      await loadUserData();
      
      // Reload news data
      await fetchNews();
      
      console.log('✅ Refresh completed successfully');
      
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      
      Alert.alert(
        'Connection Error',
        'Unable to reconnect to the server. Please check your connection and try again.',
        [
          { 
            text: 'Retry', 
            onPress: () => onRefresh() 
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
    } finally {
      setRefreshing(false);
    }
  };

  // Show welcome alert and then popup news when user just logged in
  useEffect(() => {
    if (route?.params?.showWelcome) {
      // Small delay to ensure smooth navigation transition
      const timer = setTimeout(() => {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Welcome Back!',
          message: 'Login successful! Ready to scan your gourds.',
          buttons: [],
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [route?.params?.showWelcome]);

  // Show popup news after welcome alert is closed
  useEffect(() => {
    if (!alert.visible && popupNews.length > 0 && route?.params?.showWelcome) {
      // Delay to show popup news after welcome alert
      const timer = setTimeout(() => {
        if (currentPopupIndex < popupNews.length) {
          setSelectedNews(popupNews[currentPopupIndex]);
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [alert.visible, popupNews, currentPopupIndex, route?.params?.showWelcome]);

  const handleNewsPress = (newsItem) => {
    console.log('📰 News pressed:', {
      id: newsItem._id,
      title: newsItem.title,
      hasBody: !!newsItem.body,
      bodyLength: newsItem.body?.length,
      category: newsItem.category
    });
    setSelectedNews(newsItem);
  };

  const handleNewsModalClose = () => {
    // If there are more popup news to show
    if (currentPopupIndex < popupNews.length - 1) {
      const nextIndex = currentPopupIndex + 1;
      setCurrentPopupIndex(nextIndex);
      
      // Show next popup news after a short delay
      setTimeout(() => {
        setSelectedNews(popupNews[nextIndex]);
      }, 300);
    } else {
      setSelectedNews(null);
      // Reset for next login
      setCurrentPopupIndex(0);
    }
  };

  const handleMarkAsRead = async (newsId) => {
    try {
      await markNewsAsRead(newsId);
    } catch (error) {
      console.log('Error marking news as read:', error);
    }
  };

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handleStatsPress = (type) => {
    // Navigate to filtered history
    navigation.navigate('History', { filter: type });
  };

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const scrollContentPadding = useMemo(
    () => ({ paddingBottom: theme.spacing.xl + insets.bottom + TAB_BAR_HEIGHT }),
    [insets.bottom]
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={scrollContentPadding}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} // Android
            tintColor={theme.colors.primary} // iOS
          />
        }
      >
        <WelcomeHeader 
          userName={userName} 
          user={user}
          onNotificationPress={handleNotificationPress}
          onMenuPress={handleMenuPress}
          isRefreshing={refreshing}
        />
        
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Ready to scan?</Text>
              <Text style={styles.heroSubtitle}>Capture a new gourd in seconds.</Text>
            </View>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('Camera')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>Open Camera</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.toolsCard}>
              <Text style={styles.toolsHeading}>Quick tools</Text>
              <View style={styles.toolsRow}>
                {quickTools.map((tool, index) => (
                  <TouchableOpacity
                    key={tool.id}
                    style={[styles.toolButton, index > 0 && styles.toolButtonSeparator]}
                    onPress={tool.action}
                    activeOpacity={0.85}
                  >
                    <View style={styles.toolIconWrap}>
                      <Ionicons name={tool.icon} size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.toolLabel}>{tool.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.sectionTitleStandalone]}>Snapshot</Text>
            <View style={styles.statRow}>
              {summaryStats.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.statPill, index !== summaryStats.length - 1 && styles.statPillSpacer]}
                  onPress={() => handleStatsPress(item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Update</Text>
              {news.length > 1 && !loadingNews && (
                <TouchableOpacity onPress={() => news[0] && handleNewsPress(news[0])}>
                  <Text style={styles.sectionAction}>Open feed</Text>
                </TouchableOpacity>
              )}
            </View>

            {loadingNews ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : news.length > 0 ? (
              newsPreview.map((newsItem) => (
                <NewsCard
                  key={newsItem._id}
                  news={newsItem}
                  onPress={() => handleNewsPress(newsItem)}
                  compact
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No updates available</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.toggleButton, showDetails && styles.toggleButtonActive]}
            onPress={handleToggleDetails}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleButtonText}>
              {showDetails ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <>
              <View style={styles.collapsibleSection}>
                <Text style={[styles.sectionTitle, styles.sectionTitleStandalone]}>Quick Actions</Text>
                <QuickActionCard
                  icon="time-outline"
                  title="Scan History"
                  subtitle="View past scans and results"
                  color={theme.colors.info}
                  gradientColors={[theme.colors.info, '#2874a6']}
                  onPress={() => navigation.navigate('History')}
                />
                <QuickActionCard
                  icon="person-outline"
                  title="My Profile"
                  subtitle="Manage account settings"
                  color={theme.colors.secondary}
                  gradientColors={[theme.colors.secondary, '#c9c940']}
                  onPress={() => navigation.navigate('Profile')}
                />
              </View>

              {showTip && (
                <View style={styles.collapsibleSection}>
                  <TipCard
                    tip={tips[currentTipIndex]}
                    onDismiss={() => setShowTip(false)}
                    onNext={handleNextTip}
                  />
                </View>
              )}

              {recentScans.length > 0 && (
                <View style={styles.collapsibleSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Scans</Text>
                    <Text
                      style={styles.sectionAction}
                      onPress={() => navigation.navigate('History')}
                    >
                      View all
                    </Text>
                  </View>
                  {recentScans.map((scan) => (
                    <RecentScanCard
                      key={scan.id}
                      imageUri={scan.imageUri}
                      result={scan.result}
                      date={scan.date}
                      onPress={() => {}}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Welcome Alert */}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      {/* News Modal */}
      <NewsModal
        visible={!!selectedNews}
        news={selectedNews}
        onClose={handleNewsModalClose}
        onMarkAsRead={handleMarkAsRead}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  heroText: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  heroButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  heroButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.background.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  sectionTitleStandalone: {
    marginBottom: theme.spacing.sm,
  },
  sectionAction: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  toolsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  toolsHeading: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toolsRow: {
    flexDirection: 'row',
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  toolButtonSeparator: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.background.secondary,
  },
  toolIconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  toolLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
  },
  statRow: {
    flexDirection: 'row',
  },
  statPill: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  statPillSpacer: {
    marginRight: theme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyState: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  toggleButton: {
    alignSelf: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.xl,
  },
  toggleButtonActive: {
    marginBottom: theme.spacing.lg,
  },
  toggleButtonText: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  collapsibleSection: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
  },
});