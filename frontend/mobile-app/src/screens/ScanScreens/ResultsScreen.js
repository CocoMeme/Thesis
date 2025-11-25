import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles';
import { scanService } from '../../services';

const { width } = Dimensions.get('window');

export const ResultsScreen = ({ route, navigation }) => {
  const { imageUri, prediction, scanId } = route.params;
  const [isSaving, setIsSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const isHistoryView = !!scanId;

  // Helper: Get gender icon
  const getGenderIcon = (gender) => {
    return gender === 'male' ? 'male' : 'female';
  };

  // Helper: Get gender color
  const getGenderColor = (gender) => {
    return gender === 'male' ? '#4A90E2' : '#E94B9E';
  };

  // Helper: Get confidence level and color
  const getConfidenceLevel = (confidence) => {
    if (confidence >= 90) return { label: 'Very High', color: '#2ECC71' };
    if (confidence >= 75) return { label: 'High', color: '#3498DB' };
    if (confidence >= 60) return { label: 'Moderate', color: '#F39C12' };
    return { label: 'Low', color: '#E74C3C' };
  };

  // Helper: Get flower information
  const getFlowerInfo = (gender) => {
    if (gender === 'male') {
      return {
        title: '🌼 Male Flower',
        description: 'Male flowers produce pollen and typically appear in clusters. They have thin stems and no fruit development at the base. These flowers are essential for pollination but do not produce gourds themselves.',
        characteristics: [
          'Thin, long stem',
          'No swelling at base',
          'Produces pollen',
          'Appears in clusters',
          'Opens early morning'
        ]
      };
    } else {
      return {
        title: '🌸 Female Flower',
        description: 'Female flowers have a small gourd-like structure at the base of the flower. After pollination, this develops into a mature gourd. These are the fruit-producing flowers of the plant.',
        characteristics: [
          'Miniature gourd at base',
          'Thicker, shorter stem',
          'Receives pollen',
          'Develops into fruit',
          'Fewer per plant'
        ]
      };
    }
  };

  // Handler: Delete scan
  const handleDelete = async () => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await scanService.deleteScan(scanId);
              Alert.alert('Success', 'Scan deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete scan');
            }
          }
        }
      ]
    );
  };

  // Handler: Save scan to backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const scanData = {
        prediction: prediction.gender,
        confidence: prediction.confidence,
        diseaseInfo: {}, // Placeholder for future disease detection
        location: null, // Placeholder for location data
        notes: '',
      };

      await scanService.saveScan(scanData, imageUri);
      
      Alert.alert(
        'Success! 🎉',
        'Scan saved to your history!',
        [
          {
            text: 'View History',
            onPress: () => navigation.navigate('Profile', { 
              screen: 'ProfileMain', 
              params: { initialTab: 'history' } 
            })
          },
          {
            text: 'Take Another',
            onPress: () => navigation.navigate('CameraMain')
          }
        ]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        'Save Failed',
        'Failed to save scan. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Retake photo
  const handleRetake = () => {
    navigation.navigate('CameraMain');
  };

  // Handler: Share results
  const handleShare = () => {
    Alert.alert(
      'Share Results',
      'Sharing feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleRetake} style={styles.headerButton}>
            <Ionicons name="camera-outline" size={22} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={22} color="#000000" />
          </TouchableOpacity>
          {isHistoryView ? (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={22} color="#000000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.headerButton}>
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Ionicons name="save-outline" size={22} color="#000000" />
              )}
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, isHistoryView, isSaving]);

  const confidenceInfo = getConfidenceLevel(prediction.confidence);
  const flowerInfo = getFlowerInfo(prediction.gender);

  return (
    <ScrollView style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        
        {imageLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        
        {/* Quick Result Badge */}
        <View style={[
          styles.resultBadge,
          { backgroundColor: getGenderColor(prediction.gender) }
        ]}>
          <Ionicons 
            name={getGenderIcon(prediction.gender)} 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.resultBadgeText}>
            {prediction.gender.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Results Card */}
      <View style={styles.resultsCard}>
        
        {/* Main Result Header */}
        <View style={styles.resultHeader}>
          <Ionicons 
            name={getGenderIcon(prediction.gender)} 
            size={64} 
            color={getGenderColor(prediction.gender)} 
          />
          <Text style={[
            styles.genderText, 
            { color: getGenderColor(prediction.gender) }
          ]}>
            {prediction.gender.toUpperCase()} FLOWER
          </Text>
        </View>

        {/* Confidence Section */}
        <View style={styles.confidenceContainer}>
          <View style={styles.confidenceHeader}>
            <Text style={styles.confidenceLabel}>Confidence Level</Text>
            <View style={[
              styles.confidenceBadge,
              { backgroundColor: confidenceInfo.color }
            ]}>
              <Text style={styles.confidenceBadgeText}>
                {confidenceInfo.label}
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${prediction.confidence}%`,
                  backgroundColor: confidenceInfo.color
                }
              ]} 
            />
          </View>
          
          <Text style={styles.confidencePercentage}>
            {prediction.confidence.toFixed(1)}%
          </Text>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.metadataText}>
              Processing time: {prediction.processingTime}ms
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Ionicons name="git-branch-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.metadataText}>
              Model: {prediction.modelType} v{prediction.modelVersion}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.metadataText}>
              {new Date(prediction.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {flowerInfo.title}
          </Text>
          <Text style={styles.infoDescription}>
            {flowerInfo.description}
          </Text>
          
          {/* Characteristics List */}
          <View style={styles.characteristicsList}>
            <Text style={styles.characteristicsTitle}>Key Characteristics:</Text>
            {flowerInfo.characteristics.map((char, index) => (
              <View key={index} style={styles.characteristicItem}>
                <Ionicons name="checkmark-circle" size={16} color={getGenderColor(prediction.gender)} />
                <Text style={styles.characteristicText}>{char}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips Box */}
        <View style={styles.tipsBox}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#F39C12" />
            <Text style={styles.tipsTitle}>Pro Tip</Text>
          </View>
          <Text style={styles.tipsText}>
            {prediction.gender === 'male' 
              ? 'Male flowers usually appear first. They help pollinate female flowers but won\'t produce fruit.'
              : 'Pollinate female flowers in the early morning for best results. You can use a small brush to transfer pollen from male flowers.'
            }
          </Text>
        </View>

      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  resultBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resultBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.xs,
  },
  resultsCard: {
    padding: theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  genderText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    letterSpacing: 1,
  },
  confidenceContainer: {
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  confidenceBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
  confidenceBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
    marginVertical: theme.spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.small,
  },
  confidencePercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  metadata: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  metadataText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  infoBox: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  characteristicsList: {
    marginTop: theme.spacing.sm,
  },
  characteristicsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  characteristicText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  tipsBox: {
    backgroundColor: '#FFF9E6',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F39C12',
    marginLeft: theme.spacing.sm,
  },
  tipsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
});
