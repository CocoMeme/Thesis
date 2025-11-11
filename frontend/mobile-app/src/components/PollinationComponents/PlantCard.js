import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles';
import { pollinationService } from '../../services';

export const PlantCard = ({ plant, onPress, onEdit, onDelete }) => {
  const getStatusColor = (status) => pollinationService.getStatusColor(status);
  const getPollinationStatus = () => pollinationService.getPollinationStatus(plant.estimatedDates, plant.datePollinated);
  
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAge = () => {
    if (!plant.datePlanted) return 0;
    const today = new Date();
    const plantedDate = new Date(plant.datePlanted);
    const diffTime = today - plantedDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const pollinationStatus = getPollinationStatus();
  const plantAge = calculateAge();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>
            {pollinationService.formatPlantName(plant.name, 'english')}
          </Text>
          <Text style={styles.plantNameTagalog}>
            {pollinationService.formatPlantName(plant.name, 'tagalog')}
          </Text>
          <View style={styles.ageContainer}>
            <Text style={styles.ageText}>{plantAge} days old</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plant.status) }]}>
            <Text style={styles.statusText}>{plant.status.toUpperCase()}</Text>
          </View>
          <View style={[styles.pollinationBadge, { backgroundColor: pollinationStatus.color }]}>
            <Text style={styles.pollinationText}>{pollinationStatus.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Plant Image */}
      {plant.image && plant.image.url && (
        <Image 
          source={{ uri: plant.image.url }} 
          style={styles.plantImage}
          resizeMode="cover"
        />
      )}

      {/* Plant Info Header */}
      <View style={styles.headerRow}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>Planted: {formatDate(plant.datePlanted)}</Text>
        </View>

        {/* Gender Display */}
        <View style={styles.genderSection}>
          <View style={styles.detailRow}>
            <Ionicons 
              name={plant.gender === 'male' ? 'male' : plant.gender === 'female' ? 'female' : 'help-circle-outline'} 
              size={16} 
              color={plant.gender === 'male' ? '#4A90E2' : plant.gender === 'female' ? '#E94B8A' : theme.colors.text.secondary} 
            />
            <Text style={[styles.detailText, { fontWeight: '600' }]}>
              Gender: {plant.gender === 'undetermined' ? 'Not Determined Yet' : plant.gender.charAt(0).toUpperCase() + plant.gender.slice(1)}
            </Text>
          </View>
        </View>

        {/* Gender Detection Analysis */}
        {plant.genderDetectionInfo && plant.gender === 'undetermined' && (
          <View style={styles.analysisSection}>
            <Text style={styles.analysisTitle}>You will know the gender on:</Text>
            <View style={styles.detailRow}>
              <Ionicons name="male" size={16} color="#4A90E2" />
              <Text style={styles.detailText}>
                Male: {plant.genderDetectionInfo.maleDetection} 
                {plant.genderDetectionInfo.canDetectMale ? ' ✓ Ready Now' : ''}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="female" size={16} color="#E94B8A" />
              <Text style={styles.detailText}>
                Female: {plant.genderDetectionInfo.femaleDetection}
                {plant.genderDetectionInfo.canDetectFemale ? ' ✓ Ready Now' : ''}
              </Text>
            </View>
          </View>
        )}

        {/* Pollination Estimation */}
        {plant.gender !== 'undetermined' && (
          <View style={styles.analysisSection}>
            <Text style={styles.analysisTitle}>Pollination Estimate:</Text>
            <View style={styles.detailRow}>
              <Ionicons name="heart" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { fontWeight: '600' }]}>
                {plant.pollinationEstimate}
              </Text>
            </View>
          </View>
        )}

        {plant.location?.garden && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.detailText}>
              {plant.location.garden}
              {plant.location.plot && ` - Plot ${plant.location.plot}`}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  plantNameTagalog: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
  ageContainer: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    alignSelf: 'flex-start',
  },
  ageText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
    marginBottom: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pollinationBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  pollinationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  plantImage: {
    width: '100%',
    height: 150,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    marginBottom: theme.spacing.sm,
  },
  details: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  genderSection: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  analysisSection: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.sm,
  },
  analysisTitle: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.background.secondary,
    paddingTop: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    flex: 0.45,
    justifyContent: 'center',
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  deleteButton: {
    // Additional styles for delete button if needed
  },
  deleteText: {
    color: theme.colors.error,
  },
});