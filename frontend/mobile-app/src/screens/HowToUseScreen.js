import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles';

const HowToUseScreen = ({ navigation }) => {
  const steps = [
    { 
      id: '1', 
      icon: 'hand-left-outline',
      title: 'Prepare the Gourd', 
      desc: 'Place the gourd on a clean, flat surface. Remove any leaves, stems, or objects that might obstruct the view. Ensure the gourd is dry and clean for better image quality.' 
    },
    { 
      id: '2', 
      icon: 'sunny-outline',
      title: 'Good Lighting', 
      desc: 'Natural daylight works best. Avoid direct harsh sunlight or dark shadows. If indoors, use diffuse white light from multiple angles to eliminate shadows on the gourd surface.' 
    },
    { 
      id: '3', 
      icon: 'crop-outline',
      title: 'Position the Camera', 
      desc: 'Hold your phone steady and align the gourd within the on-screen guide frame. Keep the camera at a 90-degree angle to the gourd surface, approximately 20-30cm away for optimal focus.' 
    },
    { 
      id: '4', 
      icon: 'camera-outline',
      title: 'Capture & Analyze', 
      desc: 'Tap the "Scan" button to capture the image. The app will automatically process the image using AI to determine the gourd\'s ripeness level. Wait a few seconds for analysis to complete.' 
    },
    { 
      id: '5', 
      icon: 'checkbox-outline',
      title: 'Review Results', 
      desc: 'Check the detailed results including ripeness percentage, recommended actions, and confidence level. Save the scan to your history to track ripeness progression over time.' 
    },
  ];

  const features = [
    {
      id: 'f1',
      icon: 'time-outline',
      title: 'History Tracking',
      desc: 'Access all your previous scans in the History tab. Compare results over time to monitor gourd development.',
    },
    {
      id: 'f2',
      icon: 'leaf-outline',
      title: 'Pollination Management',
      desc: 'Track your gourd plants, manage pollination records, and monitor growth stages in the Pollination tab.',
    },
    {
      id: 'f3',
      icon: 'newspaper-outline',
      title: 'Stay Updated',
      desc: 'Read the latest news, tips, and best practices for gourd cultivation in the News section.',
    },
    {
      id: 'f4',
      icon: 'person-outline',
      title: 'Profile & Settings',
      desc: 'Manage your account, view statistics, and customize app settings in your Profile.',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Use</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Ionicons name="information-circle" size={48} color={theme.colors.primary} />
          <Text style={styles.welcomeTitle}>Welcome to Gourd Ripeness Scanner</Text>
          <Text style={styles.welcomeText}>
            This guide will help you get the most accurate results when scanning your gourds. Follow these steps for best practices.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Scanning Process</Text>
        {steps.map((s, index) => (
          <View key={s.id} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIndex}>
                <Text style={styles.stepIndexText}>{s.id}</Text>
              </View>
              <Ionicons name={s.icon} size={24} color={theme.colors.primary} style={styles.stepIcon} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>App Features</Text>
        {features.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <Ionicons name={feature.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.tipsSection}>
          <View style={styles.tipsSectionHeader}>
            <Ionicons name="bulb" size={24} color={theme.colors.warning} />
            <Text style={styles.tipsTitle}>Pro Tips</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>Clean your camera lens before each scan for clearer images.</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>Scan the same gourd every 2-3 days to track ripeness progression accurately.</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>Use the History screen to compare past scans and identify patterns.</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>Avoid scanning wet gourds as moisture can affect color detection.</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>For best results, scan during daytime with natural lighting.</Text>
          </View>
        </View>

        <View style={styles.troubleshootSection}>
          <Text style={styles.troubleshootTitle}>Troubleshooting</Text>
          <View style={styles.troubleshootItem}>
            <Text style={styles.troubleshootQuestion}>❓ Results seem inaccurate?</Text>
            <Text style={styles.troubleshootAnswer}>
              Check lighting conditions and ensure the gourd is properly positioned within the frame. Try rescanning with better lighting.
            </Text>
          </View>
          <View style={styles.troubleshootItem}>
            <Text style={styles.troubleshootQuestion}>❓ Camera not working?</Text>
            <Text style={styles.troubleshootAnswer}>
              Make sure you've granted camera permissions in your device settings. Restart the app if needed.
            </Text>
          </View>
          <View style={styles.troubleshootItem}>
            <Text style={styles.troubleshootQuestion}>❓ Can't see scan history?</Text>
            <Text style={styles.troubleshootAnswer}>
              Ensure you're logged in to your account. History is saved per user account.
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.getStartedText}>Start Scanning Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background.primary,
  },
  headerRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg, 
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.background.secondary,
    backgroundColor: theme.colors.surface,
  },
  backButton: { 
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { 
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  content: { 
    padding: theme.spacing.lg, 
    paddingBottom: theme.spacing.xl * 2,
  },
  welcomeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  stepCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  stepIndexText: { 
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: '#fff',
  },
  stepIcon: {
    marginLeft: 'auto',
  },
  stepContent: { 
    flex: 1,
    paddingLeft: theme.spacing.xs,
  },
  stepTitle: { 
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  stepDesc: { 
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  tipsSection: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    lineHeight: 18,
  },
  troubleshootSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  troubleshootTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  troubleshootItem: {
    marginBottom: theme.spacing.md,
  },
  troubleshootQuestion: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  troubleshootAnswer: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    paddingLeft: theme.spacing.md,
  },
  getStartedButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  getStartedText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#fff',
  },
});

HowToUseScreen.routeName = 'HowToUse';
export default HowToUseScreen;
