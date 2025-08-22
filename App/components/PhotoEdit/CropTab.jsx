// CropTab.js - Using React Native Image Crop Picker with Draggable Handles
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImagePicker from 'react-native-image-crop-picker';

const CropTab = ({ 
  cropEnabled, 
  onToggleCrop, 
  onApplyCrop, 
  onCancelCrop, 
  imageUri,
  onImageCropped 
}) => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openCropPicker = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select an image first to crop.');
      return;
    }

    try {
      setIsProcessing(true);
      
      const croppedImage = await ImagePicker.openCropper({
        path: imageUri,
        width: 300,
        height: 300,
        cropping: true,
        cropperActiveWidgetColor: '#FF3366',
        cropperStatusBarColor: '#FF3366',
        cropperToolbarColor: '#FF3366',
        cropperToolbarWidgetColor: '#FFFFFF',
        freeStyleCropEnabled: true,
        showCropGuidelines: true,
        showCropFrame: true,
        enableRotationGesture: true,
        // Draggable handles configuration
        cropperChooseText: 'Choose',
        cropperCancelText: 'Cancel',
        includeExif: true,
        includeBase64: false,
        mediaType: 'photo',
        // Enhanced cropping features
        smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Videos', 'Bursts'],
        useFrontCamera: false,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        compressImageQuality: 0.8,
      });

      setCroppedImage(croppedImage);
      
      if (onImageCropped) {
        onImageCropped(croppedImage);
      }
      
      // Apply the crop automatically
      if (onApplyCrop) {
        onApplyCrop(croppedImage);
      }

      Alert.alert('Success', 'Image cropped successfully!');
      
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Crop error:', error);
        Alert.alert('Error', 'Failed to crop image. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const openAdvancedCropPicker = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select an image first to crop.');
      return;
    }

    try {
      setIsProcessing(true);
      
      const croppedImage = await ImagePicker.openCropper({
        path: imageUri,
        cropping: true,
        // Advanced draggable handles settings
        cropperActiveWidgetColor: '#FF3366',
        cropperStatusBarColor: '#1A1A1A',
        cropperToolbarColor: '#1A1A1A',
        cropperToolbarWidgetColor: '#FFFFFF',
        cropperTintColor: '#FF3366',
        freeStyleCropEnabled: true,
        showCropGuidelines: true,
        showCropFrame: true,
        enableRotationGesture: true,
        hideBottomControls: false,
        // Custom aspect ratios
        avoidEmptySpaceAroundImage: false,
        // Quality settings
        compressImageMaxWidth: 2000,
        compressImageMaxHeight: 2000,
        compressImageQuality: 0.9,
        includeExif: true,
        // Format options
        mediaType: 'photo',
        forceJpg: false,
      });

      setCroppedImage(croppedImage);
      
      if (onImageCropped) {
        onImageCropped(croppedImage);
      }

      Alert.alert('Success', 'Advanced crop applied successfully!');
      
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Advanced crop error:', error);
        Alert.alert('Error', 'Failed to apply advanced crop. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCrop = () => {
    setCroppedImage(null);
    if (onCancelCrop) {
      onCancelCrop();
    }
  };

  return (
    <View style={styles.cropContainer}>
      <Text style={styles.instructionText}>
        {cropEnabled 
          ? 'Professional cropping with draggable handles and guidelines' 
          : 'Advanced image cropping with React Native Image Crop Picker'
        }
      </Text>
      
      {/* Preview cropped image if available */}
      {croppedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Cropped Preview:</Text>
          <Image source={{ uri: croppedImage.path }} style={styles.previewImage} />
          <Text style={styles.previewInfo}>
            {croppedImage.width} × {croppedImage.height} • {Math.round(croppedImage.size / 1024)} KB
          </Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        {!cropEnabled ? (
          <View style={styles.buttonGrid}>
            <TouchableOpacity 
              style={[styles.primaryButton, isProcessing && styles.disabledButton]} 
              onPress={openCropPicker}
              disabled={isProcessing}
            >
              <Ionicons name="crop-outline" size={20} color="white" />
              <Text style={styles.buttonText}>
                {isProcessing ? 'Processing...' : 'Quick Crop'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, isProcessing && styles.disabledButton]} 
              onPress={openAdvancedCropPicker}
              disabled={isProcessing}
            >
              <Ionicons name="settings-outline" size={20} color="white" />
              <Text style={styles.buttonText}>
                {isProcessing ? 'Processing...' : 'Advanced Crop'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cropControls}>
            <TouchableOpacity style={styles.cancelButton} onPress={resetCrop}>
              <Ionicons name="close-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.applyButton} onPress={openCropPicker}>
              <Ionicons name="checkmark-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Crop Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Feature highlights */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Cropping Features:</Text>
        <View style={styles.featureGrid}>
          <View style={styles.featureRow}>
            <Ionicons name="resize-outline" size={16} color="#FF3366" />
            <Text style={styles.featureText}>Draggable corner handles</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="move-outline" size={16} color="#FF3366" />
            <Text style={styles.featureText}>Pan & zoom gestures</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="grid-outline" size={16} color="#FF3366" />
            <Text style={styles.featureText}>Composition guidelines</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="refresh-outline" size={16} color="#FF3366" />
            <Text style={styles.featureText}>Rotation support</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="shapes-outline" size={16} color="#FF3366" />
            <Text style={styles.featureText}>Free-form cropping</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="images-outline" size={16} color="#FF3366" />
            <Text style={styles.featureText}>High-quality output</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cropContainer: {
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    width: '100%',
  },
  previewLabel: {
    color: '#FF3366',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  previewInfo: {
    color: '#CCC',
    fontSize: 12,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonGrid: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF3366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: '#FF3366',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  secondaryButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  disabledButton: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  cropControls: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#555',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF3366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6,
    elevation: 2,
    shadowColor: '#FF3366',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
  },
  featuresTitle: {
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureGrid: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    color: '#CCC',
    fontSize: 13,
    flex: 1,
  },
});

export default CropTab;