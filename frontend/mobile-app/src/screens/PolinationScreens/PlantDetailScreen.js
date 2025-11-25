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
import * as Notifications from 'expo-notifications';
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
    // Setup notification channel on mount
    setupNotificationChannel();
  }, [plantId]);

  const setupNotificationChannel = async () => {
    try {
      await Notifications.setNotificationChannelAsync('pollination', {
        name: 'Pollination Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
      });
    } catch (error) {
      console.error('Error setting up notification channel:', error);
    }
  };

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
              Alert.alert('Success', 'Plant marked as pollinated! Now check if it was successful.');
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

  const handlePollinationCheck = (success) => {
    const status = success ? 'Successful' : 'Failed';
    Alert.alert(
      `Mark as ${status}`,
      success
        ? 'Are you sure the pollination was successful?'
        : 'Are you sure the pollination failed? This flower cannot be re-pollinated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await pollinationService.updatePollinationStatus(plantId, status);
              
              // Send success notification
              if (success) {
                try {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: '🌸 Pollination Successful!',
                      body: `${pollinationService.formatPlantName(plant.name, 'english')} has been successfully pollinated!`,
                      sound: 'default',
                      badge: 1,
                      data: {
                        plantId,
                        plantName: plant.name,
                        type: 'pollination-success'
                      },
                      android: {
                        channelId: 'pollination',
                        priority: 'max',
                        vibrate: [0, 250, 250, 250],
                      },
                    },
                    trigger: { seconds: 1 }
                  });
                } catch (notifError) {
                  console.error('Error sending notification:', notifError);
                }
              }

              Alert.alert(
                'Success',
                success
                  ? '🌸 Pollination was successful! Plant advancing to FRUITING stage.'
                  : '❌ Pollination failed. This flower cannot be re-pollinated.',
                [{ text: 'OK', onPress: () => fetchPlantDetails(false) }]
              );
            } catch (error) {
              console.error('Error updating pollination status:', error);
              Alert.alert('Error', 'Failed to update status.');
            }
          }
        }
      ]
    );
  };

  const handleHarvest = () => {
    Alert.alert(
      'Mark as Harvested',
      'Is the fruit ready to harvest?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Harvest',
          onPress: async () => {
            try {
              await pollinationService.updateStatus(plantId, 'harvested');
              
              // Send harvest notification
              try {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: '🎉 Harvest Complete!',
                    body: `Your ${pollinationService.formatPlantName(plant.name, 'english')} is ready to harvest!`,
                    sound: 'default',
                    badge: 1,
                    data: {
                      plantId,
                      plantName: plant.name,
                      type: 'harvest-complete'
                    },
                    android: {
                      channelId: 'pollination',
                      priority: 'max',
                      vibrate: [0, 250, 250, 250],
                    },
                  },
                  trigger: { seconds: 1 }
                });
              } catch (notifError) {
                console.error('Error sending harvest notification:', notifError);
              }

              Alert.alert('Success', 'Plant marked as harvested! 🎉');
              fetchPlantDetails(false);
            } catch (error) {
              console.error('Error harvesting:', error);
              Alert.alert('Error', 'Failed to mark as harvested.');
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

  const hasPollinationBeenDecided = () => {
    if (!plant?.pollinationStatus || plant.pollinationStatus.length === 0) {
      return false;
    }
    // Check if the most recent pollination status is Successful or Failed
    const lastStatus = plant.pollinationStatus[plant.pollinationStatus.length - 1];
    return lastStatus.statuspollination === 'Successful' || lastStatus.statuspollination === 'Failed';
  };

  // Helper to format date for display
  const formatDateDisplay = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // Helper to render pollination timeline
  const renderPollinationTimeline = () => {
    if (plant.gender !== 'female' || !plant.datePollinated) {
      return null;
    }

    const reminderTimes = pollinationService.getPollinationReminderTimes(plant.name, plant.datePollinated);
    if (!reminderTimes) return null;

    return (
      <View style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <Ionicons name="notifications" size={20} color={theme.colors.primary} />
          <Text style={styles.timelineTitle}>Pollination Reminders</Text>
        </View>
        
        <Text style={styles.pollinationDate}>
          📅 {formatDateDisplay(plant.datePollinated)}
        </Text>
        <Text style={styles.plantTypeInfo}>
          {reminderTimes.timing.description}
        </Text>

        <View style={styles.timelineContainer}>
          {/* 1 Hour Before Reminder */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#FF9800' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>⏰ {reminderTimes.displayTimes.oneHourBefore}</Text>
              <Text style={styles.timelineLabel}>1 Hour Before Window</Text>
              <Text style={styles.timelineMessage}>🔔 Get your tools ready!</Text>
            </View>
          </View>

          {/* 30 Minutes Before Reminder */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#FF6F00' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>⏰ {reminderTimes.displayTimes.thirtyMinsBefore}</Text>
              <Text style={styles.timelineLabel}>30 Minutes Before</Text>
              <Text style={styles.timelineMessage}>🌸 Pollination window is opening soon!</Text>
            </View>
          </View>

          {/* Pollination Window Open */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#4CAF50' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>🌸 {reminderTimes.displayTimes.windowStart} - {reminderTimes.displayTimes.windowEnd}</Text>
              <Text style={styles.timelineLabel}>Pollination Window</Text>
              <Text style={styles.timelineMessage}>✅ Flowers are open - Time to pollinate!</Text>
            </View>
          </View>
        </View>

        <View style={styles.timelineTip}>
          <Ionicons name="bulb" size={16} color={theme.colors.primary} />
          <Text style={styles.timelineTipText}>
            Only female flowers will produce fruits. Mark gender before pollinating!
          </Text>
        </View>
      </View>
    );
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
          
          {plant.gender !== 'undetermined' && plant.status === 'flowering' && !plant.datePollinated && (
            <Button
              title="Mark Pollinated"
              onPress={handleMarkPollinated}
              style={styles.actionButton}
            />
          )}

          {/* Pollination Success Check - Only show when status is 'pollinated' and decision hasn't been made */}
          {plant.status === 'pollinated' && !hasPollinationBeenDecided() && (
            <View style={styles.pollinationCheckContainer}>
              <Text style={styles.pollinationCheckTitle}>Was the pollination successful?</Text>
              <View style={styles.checkButtonsRow}>
                <Button
                  title="✓ Successful"
                  onPress={() => handlePollinationCheck(true)}
                  style={[styles.actionButton, styles.successButton]}
                />
                <Button
                  title="✗ Failed"
                  onPress={() => handlePollinationCheck(false)}
                  style={[styles.actionButton, styles.failedButton]}
                />
              </View>
            </View>
          )}

          {/* Show result once decision has been made */}
          {plant.status === 'pollinated' && hasPollinationBeenDecided() && (
            <View style={styles.pollnationResultContainer}>
              {plant.pollinationStatus[plant.pollinationStatus.length - 1].statuspollination === 'Successful' ? (
                <View style={styles.successResultBanner}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.successResultText}>Pollination Successful! ✓</Text>
                </View>
              ) : (
                <View style={styles.failedResultBanner}>
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                  <Text style={styles.failedResultText}>Pollination Failed - Cannot Retry ❌</Text>
                </View>
              )}
            </View>
          )}

          {/* Harvest Button - Only show when status is 'fruiting' */}
          {plant.status === 'fruiting' && (
            <Button
              title="Mark as Harvested"
              onPress={handleHarvest}
              style={styles.actionButton}
            />
          )}

          {/* Show message when harvested */}
          {plant.status === 'harvested' && (
            <View style={styles.harvestedBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.harvestedText}>Harvest Complete! 🎉</Text>
            </View>
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
  
  // Pollination Check Container
  pollinationCheckContainer: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  pollinationCheckTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  checkButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  successButton: {
    flex: 0.48,
    backgroundColor: '#4CAF50',
  },
  failedButton: {
    flex: 0.48,
    backgroundColor: '#F44336',
  },

  // Pollination Result Container
  pollnationResultContainer: {
    marginBottom: theme.spacing.md,
  },
  successResultBanner: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successResultText: {
    ...theme.typography.bodyMedium,
    color: '#2E7D32',
    marginLeft: theme.spacing.md,
    fontWeight: '700',
    fontSize: 16,
  },
  failedResultBanner: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    borderWidth: 2,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failedResultText: {
    ...theme.typography.bodyMedium,
    color: '#C62828',
    marginLeft: theme.spacing.md,
    fontWeight: '700',
    fontSize: 16,
  },
  
  // Harvested Banner
  harvestedBanner: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  harvestedText: {
    ...theme.typography.h3,
    color: '#2E7D32',
    marginLeft: theme.spacing.md,
    fontWeight: '700',
  },
});