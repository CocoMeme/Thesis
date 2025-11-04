import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { 
  WelcomeHeader, 
  QuickActionCard, 
  StatsSection,
  RecentScanCard,
  TipCard,
  CustomAlert,
  FeaturedScanCard,
  NewsCard,
  NewsModal,
} from '../components';
import { theme } from '../styles';
import { getAllNews, getPopupNews, markNewsAsRead } from '../services/newsService';
import { authService } from '../services';

export const HomeScreen = ({ navigation, route }) => {
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
  
  const tips = [
    'Take photos in good lighting for better analysis results.',
    'Position the gourd within the guide frame for accurate scanning.',
    'Scan gourds regularly to track their ripeness progression.',
    'Clean the camera lens before scanning for clearer images.',
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
    } finally {
      setLoadingNews(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader 
          userName={userName} 
          user={user}
          onNotificationPress={handleNotificationPress}
          onMenuPress={handleMenuPress}
        />
        
        <View style={styles.content}>
          {/* News & Updates Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>News & Updates</Text>
            </View>
            
            {loadingNews ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : news.length > 0 ? (
              <>
                {news.map((newsItem) => (
                  <NewsCard
                    key={newsItem._id}
                    news={newsItem}
                    onPress={() => handleNewsPress(newsItem)}
                  />
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No updates available</Text>
              </View>
            )}
          </View>

          {/* Featured Scan Card */}
          <View style={styles.section}>
            <FeaturedScanCard onPress={() => navigation.navigate('Camera')} />
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <StatsSection
              totalScans={stats.totalScans}
              readyGourds={stats.readyGourds}
              pendingGourds={stats.pendingGourds}
              onStatsPress={handleStatsPress}
              recentScans={recentScans}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <QuickActionCard
              icon="history"
              title="Scan History"
              subtitle="View past scans and results"
              color={theme.colors.info}
              gradientColors={[theme.colors.info, '#2874a6']}
              onPress={() => navigation.navigate('History')}
            />
            <QuickActionCard
              icon="account"
              title="My Profile"
              subtitle="Manage account settings"
              color={theme.colors.secondary}
              gradientColors={[theme.colors.secondary, '#c9c940']}
              onPress={() => navigation.navigate('Profile')}
            />
          </View>

          {/* Tips */}
          {showTip && (
            <View style={styles.section}>
              <TipCard
                tip={tips[currentTipIndex]}
                onDismiss={() => setShowTip(false)}
                onNext={handleNextTip}
              />
            </View>
          )}

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Scans</Text>
                <Text 
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate('History')}
                >
                  View All
                </Text>
              </View>
              {recentScans.map((scan) => (
                <RecentScanCard
                  key={scan.id}
                  imageUri={scan.imageUri}
                  result={scan.result}
                  date={scan.date}
                  onPress={() => {
                    // Navigate to scan details
                    // navigation.navigate('ScanDetails', { scanId: scan.id });
                  }}
                />
              ))}
            </View>
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
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  viewAllButton: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
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
});