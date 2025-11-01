import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles';
import { modelService } from '../services/modelService';

export const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const cameraRef = useRef(null);

  // Initialize model when component mounts
  useEffect(() => {
    const initializeModel = async () => {
      try {
        console.log('🤖 Initializing model service...');
        await modelService.initialize();
        setIsModelReady(true);
        console.log('✅ Model service ready');
        
        // Optional: Warm up the model for faster first prediction
        await modelService.warmUp();
        console.log('🔥 Model warmed up');
      } catch (error) {
        console.error('❌ Model initialization failed:', error);
        Alert.alert(
          'Model Error',
          'Failed to load AI model. The app will still work but predictions may not be available.',
          [{ text: 'OK' }]
        );
      }
    };

    initializeModel();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery access is required to pick images.');
      }
    })();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture: ' + error.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const analyzePicture = async () => {
    try {
      setIsProcessing(true);
      
      // Ensure model is ready
      if (!isModelReady) {
        Alert.alert(
          'Model Loading',
          'AI model is still loading. Please wait a moment and try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('🔍 Analyzing image...');
      
      // Run prediction
      const prediction = await modelService.predictFlowerGender(capturedImage);
      
      console.log('✅ Prediction complete:', prediction);
      
      // Navigate to results screen with prediction data
      navigation.navigate('Results', {
        imageUri: capturedImage,
        prediction: prediction
      });
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      
      // Show user-friendly error message
      Alert.alert(
        'Analysis Failed',
        error.message || 'Unable to analyze the image. Please try again with a clearer photo.',
        [
          { text: 'Retake', onPress: retakePicture },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          {/* Show processing overlay */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.processingText}>Analyzing flower...</Text>
              <Text style={styles.processingSubtext}>This may take a moment</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={retakePicture}
            disabled={isProcessing}
          >
            <Ionicons name="close-circle" size={32} color={theme.colors.error} />
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.analyzeButton]} 
            onPress={analyzePicture}
            disabled={isProcessing || !isModelReady}
          >
            {isProcessing ? (
              <ActivityIndicator size={32} color={theme.colors.success} />
            ) : (
              <Ionicons 
                name="checkmark-circle" 
                size={32} 
                color={isModelReady ? theme.colors.success : theme.colors.text.secondary} 
              />
            )}
            <Text style={[
              styles.actionButtonText,
              (!isModelReady || isProcessing) && styles.actionButtonTextDisabled
            ]}>
              {isProcessing ? 'Analyzing...' : isModelReady ? 'Analyze' : 'Loading...'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.centerGuide}>
            <View style={styles.guidebox} />
            <Text style={styles.guideText}>Position gourd within frame</Text>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Ionicons name="images" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={takePicture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidebox: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.large,
    backgroundColor: 'transparent',
  },
  guideText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    marginTop: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  galleryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  placeholder: {
    width: 56,
    height: 56,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
  },
  permissionButtonText: {
    ...theme.typography.button,
    color: '#FFFFFF',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    ...theme.typography.h3,
    color: '#FFFFFF',
    marginTop: theme.spacing.lg,
    fontWeight: '600',
  },
  processingSubtext: {
    ...theme.typography.body,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background.primary,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  analyzeButton: {
    paddingHorizontal: theme.spacing.xl,
  },
  actionButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  actionButtonTextDisabled: {
    color: theme.colors.text.secondary,
    opacity: 0.6,
  },
});