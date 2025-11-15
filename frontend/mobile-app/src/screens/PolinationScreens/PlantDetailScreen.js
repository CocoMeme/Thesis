import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles';
import { pollinationService } from '../../services';
import { Button, ImageCapture } from '../../components';
import { CustomHeader } from '../../components/CustomComponents/CustomHeader';

export const PlantDetailScreen = ({ navigation, route }) => {
  const { plantId, plant: initialPlant } = route.params;
  const [plant, setPlant] = useState(initialPlant);
  const [isLoading, setIsLoading] = useState(!initialPlant);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState('general');

  useEffect(() => {
    if (!initialPlant) {
      fetchPlantDetails();
    }
  }, [plantId]);

  const fetchPlantDetails = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const response = await pollinationService.getPollination(plantId);
      setPlant(response.data);
    } catch (error) {
      console.error('Error fetching plant details:', error);
      Alert.alert('Error', 'Failed to load plant details.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPlantDetails(false);
  };

  const handleEdit = () => {
    navigation.navigate('PlantForm', {
      plant,
      mode: 'edit',
      title: 'Edit Plant'
    });
  };

  const handleSelectGender = () => {
    Alert.alert(
      'Select Gender',
      'What type of flowers do you see?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Male Flowers',
          onPress: () => selectGender('male')
        },
        {
          text: 'Female Flowers',
          onPress: () => selectGender('female')
        }
      ]
    );
  };

  const selectGender = async (gender) => {
    try {
      await pollinationService.markFlowering(plantId, gender);
      Alert.alert('Success', `Gender selected as ${gender}! Pollination timeline updated.`);
      fetchPlantDetails(false);
    } catch (error) {
      console.error('Error selecting gender:', error);
      Alert.alert('Error', 'Failed to update gender.');
    }
  };

  const handleMarkPollinated = async () => {
    Alert.alert(
      'Mark Pollinated',
      'Confirm that this plant has been successfully pollinated?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Pollinated',
          onPress: async () => {
            try {
              await pollinationService.markPollinated(plantId);
              Alert.alert('Success', 'Plant marked as pollinated!');
              fetchPlantDetails(false);
            } catch (error) {
              console.error('Error marking pollination:', error);
              Alert.alert('Error', 'Failed to mark as pollinated.');
            }
          }
        }
      ]
    );
  };

  const handleAddImage = (imageType) => {
    setSelectedImageType(imageType);
    setShowImageCapture(true);
  };

  const handleImageCaptured = async (imageData) => {
    try {
      await pollinationService.addImage(plantId, imageData, '', selectedImageType);
      Alert.alert('Success', 'Image added successfully!');
      fetchPlantDetails(false);
    } catch (error) {
      console.error('Error adding image:', error);
      Alert.alert('Error', 'Failed to add image.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = () => {
    if (!plant?.datePlanted) return 0;
    const today = new Date();
    const plantedDate = new Date(plant.datePlanted);
    const diffTime = today - plantedDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPollinationStatus = () => {
    return pollinationService.getPollinationStatus(plant?.estimatedDates, plant?.datePollinated);
  };

  const renderImageGallery = () => {
    // Check if plant has an image (singular)
    if (!plant?.image || !plant.image.url) {
      return (
        <View style={styles.noImages}>
          <Ionicons name="image-outline" size={48} color={theme.colors.text.secondary} />
          <Text style={styles.noImagesText}>No photos yet</Text>
          <Text style={styles.noImagesSubtext}>
            Add photos to track your plant's progress
          </Text>
        </View>
      );
    }

    // Display the single image
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: plant.image.url }} style={styles.plantImage} />
        {plant.image.caption && (
          <Text style={styles.imageCaption} numberOfLines={2}>
            {plant.image.caption}
          </Text>
        )}
        {plant.image.uploadDate && (
          <Text style={styles.imageDate}>
            Added: {formatDate(plant.image.uploadDate)}
          </Text>
        )}
      </View>
    );
  };

  const headerRight = () => (
    <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
      <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading plant details...</Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Plant not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const pollinationStatus = getPollinationStatus();
  const plantAge = calculateAge();

  return (
    <View style={styles.container}>
      <CustomHeader
        title={pollinationService.formatPlantName(plant.name, 'english')}
        subtitle={pollinationService.formatPlantName(plant.name, 'tagalog')}
        onBack={() => navigation.goBack()}
        rightComponent={headerRight}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Status Overview */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Plant Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: pollinationService.getStatusColor(plant.status) }]}>
                <Text style={styles.statusText}>{plant.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.ageInfo}>
              <Text style={styles.ageNumber}>{plantAge}</Text>
              <Text style={styles.ageLabel}>days old</Text>
            </View>
          </View>

          <View style={styles.pollinationStatus}>
            <View style={[styles.pollinationBadge, { backgroundColor: pollinationStatus.color }]}>
              <Text style={styles.pollinationText}>
                Pollination: {pollinationStatus.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Gender Detection & Pollination Analysis */}
        <View style={styles.analysisCard}>
          <Text style={styles.cardTitle}>Gender & Pollination Information</Text>
          
          {/* Current Gender Status */}
          <View style={styles.analysisRow}>
            <Ionicons 
              name={plant.gender === 'male' ? 'male' : plant.gender === 'female' ? 'female' : 'help-circle-outline'} 
              size={20} 
              color={plant.gender === 'male' ? '#4A90E2' : plant.gender === 'female' ? '#E94B8A' : theme.colors.text.secondary} 
            />
            <Text style={styles.analysisText}>
              Current Gender: {plant.gender === 'undetermined' ? 'Not Determined Yet' : plant.gender.charAt(0).toUpperCase() + plant.gender.slice(1)}
            </Text>
          </View>

          {/* Gender Detection Timeline - only show if undetermined */}
          {plant.genderDetectionInfo && plant.gender === 'undetermined' && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subCardTitle}>You will know the gender on:</Text>
              
              <View style={styles.analysisRow}>
                <Ionicons name="male" size={20} color="#4A90E2" />
                <Text style={styles.analysisText}>
                  Male: {plant.genderDetectionInfo.maleDetection} 
                  {plant.genderDetectionInfo.canDetectMale ? ' ✅ Ready Now' : ''}
                </Text>
              </View>
              
              <View style={styles.analysisRow}>
                <Ionicons name="female" size={20} color="#E94B8A" />
                <Text style={styles.analysisText}>
                  Female: {plant.genderDetectionInfo.femaleDetection}
                  {plant.genderDetectionInfo.canDetectFemale ? ' ✅ Ready Now' : ''}
                </Text>
              </View>
            </>
          )}

          {/* Pollination Estimate - only show if gender is determined */}
          {plant.gender !== 'undetermined' && (
            <>
              <View style={styles.divider} />
              <View style={styles.pollinationEstimate}>
                <Text style={styles.estimateTitle}>Pollination Estimate:</Text>
                <Text style={styles.estimateText}>
                  {plant.pollinationEstimate}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Photo Gallery */}
        <View style={styles.galleryCard}>
          <View style={styles.galleryHeader}>
            <Text style={styles.cardTitle}>Photo Gallery</Text>
            <TouchableOpacity 
              style={styles.addPhotoButton}
              onPress={() => handleAddImage('general')}
            >
              <Ionicons name="camera-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {renderImageGallery()}
        </View>

        {/* Location Info */}
        {plant.location && (plant.location.garden || plant.location.plot) && (
          <View style={styles.locationCard}>
            <Text style={styles.cardTitle}>Location</Text>
            <View style={styles.locationInfo}>
              <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.locationText}>
                {plant.location.garden}
                {plant.location.plot && ` - Plot ${plant.location.plot}`}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {plant.gender === 'undetermined' && (
            <Button
              title="Select Gender"
              onPress={handleSelectGender}
              style={styles.actionButton}
            />
          )}
          
          {plant.gender !== 'undetermined' && !plant.datePollinated && (
            <Button
              title="Mark Pollinated"
              onPress={handleMarkPollinated}
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>

      {/* Image Capture Modal */}
      <ImageCapture
        visible={showImageCapture}
        onClose={() => setShowImageCapture(false)}
        onImageCaptured={handleImageCaptured}
        title="Add Plant Photo"
        imageType={selectedImageType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.h2,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  
  // Cards
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ageInfo: {
    alignItems: 'center',
  },
  ageNumber: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  ageLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  pollinationStatus: {
    marginTop: theme.spacing.sm,
  },
  pollinationBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.medium,
    alignSelf: 'flex-start',
  },
  pollinationText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subCardTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.background.secondary,
    marginVertical: theme.spacing.md,
  },

  // Analysis Card
  analysisCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.small,
  },
  analysisText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  pollinationEstimate: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  estimateTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  estimateText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Gallery
  galleryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addPhotoButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.small,
  },
  noImages: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  noImagesText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  noImagesSubtext: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  imageCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  imageDate: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontStyle: 'italic',
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background.secondary,
  },
  photoActionButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  photoActionText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginTop: 4,
    fontSize: 11,
  },

  // Location
  locationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },

  // Actions
  actionButtons: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
});