import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { 
  WelcomeHeader, 
  QuickActionCard, 
  StatsSection,
  RecentScanCard,
  TipCard,
  CustomAlert,
  FeaturedScanCard,
} from '../components';
import { theme } from '../styles';

export const HomeScreen = ({ navigation, route }) => {
  // Top Banner
  // Mock data - replace with real data from API/storage
  const [userName] = useState('Coco Meme');
  const [stats] = useState({
    totalScans: 24,
    readyGourds: 18,
    pendingGourds: 6,
  });
  
  // Get user and handlers from route params
  const user = route?.params?.user;
  const onNotificationPress = route?.params?.onNotificationPress;
  const onMenuPress = route?.params?.onMenuPress;
  
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
  
  const tips = [
    'Take photos in good lighting for better analysis results.',
    'Position the gourd within the guide frame for accurate scanning.',
    'Scan gourds regularly to track their ripeness progression.',
    'Clean the camera lens before scanning for clearer images.',
  ];

  // Show welcome alert when user just logged in
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
          onNotificationPress={onNotificationPress}
          onMenuPress={onMenuPress}
        />
        
        <View style={styles.content}>
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
});