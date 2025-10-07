import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { 
  WelcomeHeader, 
  QuickActionCard, 
  StatsSection,
  RecentScanCard,
  TipCard,
} from '../components';
import { theme } from '../styles';

export const HomeScreen = ({ navigation }) => {
  // Mock data - replace with real data from API/storage
  const [userName] = useState('John');
  const [stats] = useState({
    totalScans: 24,
    readyGourds: 18,
    pendingGourds: 6,
  });
  
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
  
  const tips = [
    'Take photos in good lighting for better analysis results.',
    'Position the gourd within the guide frame for accurate scanning.',
    'Scan gourds regularly to track their ripeness progression.',
    'Clean the camera lens before scanning for clearer images.',
  ];

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
        <WelcomeHeader userName={userName} />
        
        <View style={styles.content}>
          {/* Stats Section */}
          <View style={styles.section}>
            <StatsSection
              totalScans={stats.totalScans}
              readyGourds={stats.readyGourds}
              pendingGourds={stats.pendingGourds}
              onStatsPress={handleStatsPress}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <QuickActionCard
              icon="camera"
              title="Scan Gourd"
              subtitle="Take a photo to analyze"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Camera')}
            />
            <QuickActionCard
              icon="time"
              title="Scan History"
              subtitle="View past scans and results"
              color={theme.colors.info}
              onPress={() => navigation.navigate('History')}
            />
            <QuickActionCard
              icon="person"
              title="My Profile"
              subtitle="Manage account settings"
              color={theme.colors.secondary}
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  viewAllButton: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
  },
});