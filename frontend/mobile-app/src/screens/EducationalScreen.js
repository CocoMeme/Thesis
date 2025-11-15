import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles';

const EducationalScreen = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Get YouTube thumbnail URL with fallback options
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    // Try different thumbnail qualities
    // maxresdefault (1280x720), hqdefault (480x360), mqdefault (320x180), default (120x90)
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const videoTutorials = [
    {
      id: 'v1',
      title: 'How to Hand Pollinate Gourds',
      description: 'Step-by-step guide on manual pollination techniques for better fruit production.',
      duration: '5:30',
      thumbnail: null,
      url: 'https://www.youtube.com/watch?v=zF_ZQFaaEkc',
      category: 'Pollination',
    },
    {
      id: 'v2',
      title: 'Identifying Male vs Female Flowers',
      description: 'Learn to distinguish between male and female gourd flowers quickly.',
      duration: '3:45',
      thumbnail: null,
      url: 'https://www.youtube.com/watch?v=rWodaeBEinM',
      category: 'Identification',
    },
    {
      id: 'v3',
      title: 'Insect and Wind Pollination',
      description: 'Understand the pollination process carried out by insects and wind.',
      duration: '4:20',
      thumbnail: null,
      url: 'https://www.youtube.com/watch?v=bAr6Ccg-1PA',
      category: 'Pollination',
    },
  ];

  const guides = [
    {
      id: 'g1',
      title: 'Male vs Female Gourd Flowers',
      icon: 'flower-outline',
      color: theme.colors.primary,
      sections: [
        {
          subtitle: 'Male Flowers',
          points: [
            'Appear first, usually 1-2 weeks before female flowers',
            'Grow on long, thin stems',
            'Have a thin stalk with no swelling at the base',
            'Produce pollen on the stamen in the center',
            'More abundant than female flowers',
          ],
        },
        {
          subtitle: 'Female Flowers',
          points: [
            'Have a small gourd-shaped swelling at the base (ovary)',
            'Shorter, thicker stems than male flowers',
            'Contain a stigma that receives pollen',
            'Will develop into fruit if successfully pollinated',
            'Open for only one day, usually early morning',
          ],
        },
        {
          subtitle: 'Visual Identification',
          points: [
            'Look for the miniature gourd at the base - this is ALWAYS female',
            'No swelling at base = male flower',
            'Male flowers outnumber female flowers typically 10:1',
          ],
        },
      ],
    },
    {
      id: 'g2',
      title: 'Hand Pollination Steps',
      icon: 'hand-right-outline',
      color: theme.colors.success,
      sections: [
        {
          subtitle: 'Best Time',
          points: [
            'Early morning (6-10 AM) when flowers are fresh',
            'Before bees and other pollinators become active',
            'On dry, sunny days for best results',
          ],
        },
        {
          subtitle: 'Step-by-Step Process',
          points: [
            '1. Identify fresh male and female flowers (both must be open)',
            '2. Pick a male flower and remove all petals',
            '3. Gently brush the pollen-covered stamen against the stigma',
            '4. Use one male flower for 2-3 female flowers',
            '5. Mark pollinated flowers with string or ribbon',
            '6. Close female flower petals gently after pollination',
          ],
        },
        {
          subtitle: 'Success Tips',
          points: [
            'Use fresh pollen from flowers that just opened',
            'Pollinate multiple female flowers to increase chances',
            'Track pollination dates for harvest timing',
            'Protect pollinated flowers from insects for a few hours',
          ],
        },
      ],
    },
    {
      id: 'g3',
      title: 'Ripeness Indicators',
      icon: 'checkmark-circle-outline',
      color: theme.colors.warning,
      sections: [
        {
          subtitle: 'Visual Signs',
          points: [
            'Skin color changes from light to deep, rich tones',
            'Surface becomes harder and less glossy',
            'Stem begins to dry and turn brown',
            'Tendril near the fruit dries and turns brown',
          ],
        },
        {
          subtitle: 'Physical Tests',
          points: [
            'Knock on the gourd - should sound hollow',
            'Press thumbnail into skin - should resist puncturing',
            'Stem should be dry and woody, not green',
            'Gourd should feel heavy for its size',
          ],
        },
        {
          subtitle: 'Harvest Timing',
          points: [
            'Wait until after first light frost for best hardening',
            'Leave 2-3 inches of stem attached when cutting',
            'Handle carefully to avoid bruising',
            'Cure in dry, warm location for several weeks',
          ],
        },
      ],
    },
    {
      id: 'g4',
      title: 'Common Growing Problems',
      icon: 'alert-circle-outline',
      color: theme.colors.error,
      sections: [
        {
          subtitle: 'Poor Fruit Set',
          points: [
            'Insufficient pollination - try hand pollination',
            'Too much nitrogen fertilizer - reduce feeding',
            'Extreme temperatures affecting flower development',
            'Lack of male flowers - be patient, they come first',
          ],
        },
        {
          subtitle: 'Fruit Rot',
          points: [
            'Remove rotting fruit immediately to prevent spread',
            'Improve air circulation around plants',
            'Avoid overhead watering - water at base',
            'Elevate fruit off ground with straw or boards',
          ],
        },
        {
          subtitle: 'Yellowing Leaves',
          points: [
            'Normal for older leaves - remove them',
            'Overwatering - reduce watering frequency',
            'Nutrient deficiency - apply balanced fertilizer',
            'Pest damage - inspect for insects',
          ],
        },
      ],
    },
  ];

  const quickFacts = [
    {
      id: 'f1',
      icon: 'time-outline',
      title: 'Flower Lifespan',
      fact: 'Gourd flowers are only viable for pollination for a few hours in the early morning.',
    },
    {
      id: 'f2',
      icon: 'water-outline',
      title: 'Watering Needs',
      fact: 'Gourds need 1-2 inches of water per week, more during fruit development.',
    },
    {
      id: 'f3',
      icon: 'sunny-outline',
      title: 'Sunlight',
      fact: 'Gourds require full sun (6-8 hours daily) for optimal growth and fruit production.',
    },
    {
      id: 'f4',
      icon: 'leaf-outline',
      title: 'Pollination Success',
      fact: 'Only 20-30% of female flowers naturally get pollinated. Hand pollination increases this to 80-90%.',
    },
    {
      id: 'f5',
      icon: 'calendar-outline',
      title: 'Days to Maturity',
      fact: 'Most gourds take 90-120 days from pollination to full maturity.',
    },
    {
      id: 'f6',
      icon: 'thermometer-outline',
      title: 'Temperature',
      fact: 'Gourds grow best in temperatures between 70-95°F (21-35°C).',
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleVideoPress = (url) => {
    Linking.openURL(url).catch(err => console.error('Error opening video:', err));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Educational Resources</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Ionicons name="school" size={48} color={theme.colors.primary} />
          <Text style={styles.welcomeTitle}>Learn About Gourd Cultivation</Text>
          <Text style={styles.welcomeText}>
            Master the art of growing, pollinating, and harvesting gourds with our comprehensive guides and video tutorials.
          </Text>
        </View>

        {/* Video Tutorials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="play-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Video Tutorials</Text>
          </View>
          {videoTutorials.map((video) => {
            const thumbnailUrl = getYouTubeThumbnail(video.url);
            return (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => handleVideoPress(video.url)}
                activeOpacity={0.7}
              >
                <View style={styles.videoThumbnail}>
                  {thumbnailUrl ? (
                    <>
                      <Image 
                        source={{ uri: thumbnailUrl }}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                        onError={(e) => {
                          console.log('Thumbnail load error for:', video.title, e.nativeEvent.error);
                        }}
                      />
                      <View style={styles.playOverlay}>
                        <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.9)" />
                      </View>
                    </>
                  ) : (
                    <Ionicons name="play-circle" size={48} color={theme.colors.primary} />
                  )}
                  <View style={styles.videoDuration}>
                    <Text style={styles.videoDurationText}>{video.duration}</Text>
                  </View>
                </View>
                <View style={styles.videoInfo}>
                  <View style={styles.videoCategoryBadge}>
                    <Text style={styles.videoCategoryText}>{video.category}</Text>
                  </View>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoDescription}>{video.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Facts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={24} color={theme.colors.warning} />
            <Text style={styles.sectionTitle}>Quick Facts</Text>
          </View>
          <View style={styles.factsGrid}>
            {quickFacts.map((item) => (
              <View key={item.id} style={styles.factCard}>
                <Ionicons name={item.icon} size={28} color={theme.colors.primary} />
                <Text style={styles.factTitle}>{item.title}</Text>
                <Text style={styles.factText}>{item.fact}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Guides Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={24} color={theme.colors.success} />
            <Text style={styles.sectionTitle}>Detailed Guides</Text>
          </View>
          {guides.map((guide) => (
            <View key={guide.id} style={styles.guideCard}>
              <TouchableOpacity
                style={styles.guideHeader}
                onPress={() => toggleSection(guide.id)}
                activeOpacity={0.7}
              >
                <View style={styles.guideHeaderLeft}>
                  <View style={[styles.guideIcon, { backgroundColor: guide.color + '20' }]}>
                    <Ionicons name={guide.icon} size={24} color={guide.color} />
                  </View>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                </View>
                <Ionicons 
                  name={expandedSection === guide.id ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color={theme.colors.text.secondary} 
                />
              </TouchableOpacity>

              {expandedSection === guide.id && (
                <View style={styles.guideContent}>
                  {guide.sections.map((section, index) => (
                    <View key={index} style={styles.guideSection}>
                      <Text style={styles.guideSubtitle}>{section.subtitle}</Text>
                      {section.points.map((point, pointIndex) => (
                        <View key={pointIndex} style={styles.guidePoint}>
                          <View style={styles.bulletPoint} />
                          <Text style={styles.guidePointText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Additional Resources Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link" size={24} color={theme.colors.info} />
            <Text style={styles.sectionTitle}>Additional Resources</Text>
          </View>
          <View style={styles.resourceCard}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.colors.primary} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Need Help?</Text>
              <Text style={styles.resourceText}>
                Check our FAQ section or contact support for personalized assistance with your gourd growing questions.
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => navigation.navigate('Community')}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={24} color={theme.colors.success} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Community Forum</Text>
              <Text style={styles.resourceText}>
                Join our growing community of gourd enthusiasts to share tips, photos, and experiences.
              </Text>
              <View style={styles.resourceAction}>
                <Text style={styles.resourceActionText}>Join Discussion</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.success} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Pollination')}
        >
          <Ionicons name="leaf" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>Go to Pollination Management</Text>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  videoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  videoThumbnail: {
    height: 180,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  videoDuration: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
  },
  videoInfo: {
    padding: theme.spacing.md,
  },
  videoCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  videoCategoryText: {
    fontSize: 11,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  videoTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  videoDescription: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  factCard: {
    width: '50%',
    padding: theme.spacing.xs,
  },
  factCardInner: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
    minHeight: 140,
  },
  factCard: {
    width: '50%',
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    margin: theme.spacing.xs,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
    minHeight: 140,
  },
  factTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  factText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  guideCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
    overflow: 'hidden',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  guideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  guideIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  guideTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  guideContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background.secondary,
  },
  guideSection: {
    marginTop: theme.spacing.md,
  },
  guideSubtitle: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  guidePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    marginRight: theme.spacing.sm,
  },
  guidePointText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  resourceContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  resourceTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  resourceText: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  resourceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  resourceActionText: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.success,
    marginRight: 4,
  },
  actionButton: {
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
  actionButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#fff',
  },
});

EducationalScreen.routeName = 'Educational';
export default EducationalScreen;
