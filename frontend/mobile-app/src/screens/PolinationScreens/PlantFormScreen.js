import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles';
import { pollinationService } from '../../services';
import { PlantForm } from '../../components';

export const PlantFormScreen = ({ navigation, route }) => {
  const { plant, mode = 'create', title } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await pollinationService.createPollination(formData);
        Alert.alert(
          'Success',
          'Plant added successfully! You can now track its growth and pollination.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        await pollinationService.updatePollination(plant._id, formData);
        Alert.alert(
          'Success',
          'Plant updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error saving plant:', error);
      
      let errorMessage = 'An error occurred while saving the plant.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(e => e.message).join('\n');
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <PlantForm
          initialData={plant}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          title={title || (mode === 'create' ? 'Add New Plant' : 'Edit Plant')}
          isLoading={isLoading}
        />
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});