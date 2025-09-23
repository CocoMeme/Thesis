import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles';

const { width } = Dimensions.get('window');

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    try {
      // TODO: Implement camera permission request
      Alert.alert('Info', 'Camera permission functionality will be implemented next');
    } catch (error) {
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  const takePicture = async () => {
    setLoading(true);
    try {
      // TODO: Implement camera capture and API call
      console.log('Taking picture...');
      Alert.alert('Success', 'Picture taken! Analysis will be implemented next');
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      // TODO: Implement image picker
      Alert.alert('Info', 'Gallery picker functionality will be implemented next');
    } catch (error) {
      Alert.alert('Error', 'Failed to access gallery');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan Gourd</Text>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <MaterialCommunityIcons name="camera" size={64} color="#9E9E9E" style={styles.cameraIcon} />
          <Text style={styles.cameraText}>Camera View</Text>
          <Text style={styles.cameraSubtext}>Camera integration coming soon</Text>
        </View>

        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.instructionText}>
            Position the gourd within the frame
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={pickFromGallery}
        >
          <Text style={styles.galleryButtonText}>📁</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, loading && styles.captureButtonDisabled]}
          onPress={takePicture}
          disabled={loading}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => Alert.alert('Info', 'Flash toggle coming soon')}
        >
          <Text style={styles.flashButtonText}>⚡</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.tipText}>
          💡 Tip: Ensure good lighting for better results
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cameraIcon: {
    marginBottom: theme.spacing.md,
  },
  cameraText: {
    fontSize: theme.fontSize.lg,
    color: '#fff',
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cameraSubtext: {
    fontSize: theme.fontSize.md,
    color: '#ccc',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'transparent',
  },
  instructionText: {
    position: 'absolute',
    bottom: 100,
    fontSize: theme.fontSize.md,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  galleryButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  flashButtonText: {
    fontSize: 24,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});