import { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from 'react-native-view-shot';

import Header from "../../components/PhotoEdit/EditHeader";
import ImageContainer from "../../components/PhotoEdit/ImagePreview";
import TabsNavigation from "../../components/PhotoEdit/TabsBar";
import AdjustTab from "../../components/PhotoEdit/AdjustTab";
import CropTab from "../../components/PhotoEdit/CropTab";

const { height } = Dimensions.get("window");

const PhotoEditor = () => {
  const [image, setImage] = useState(null);
  const [brightnessValue, setBrightnessValue] = useState(1);
  const [contrastValue, setContrastValue] = useState(1);
  const [saturationValue, setSaturationValue] = useState(1);
  const [warmthValue, setWarmthValue] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [vignetteValue, setVignetteValue] = useState(0);
  const [activeTab, setActiveTab] = useState("adjust");
  
  // New crop-related state
  const [cropEnabled, setCropEnabled] = useState(false);
  const [cropArea, setCropArea] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  
  const imageRef = useRef();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow gallery access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setOriginalImage(result.assets[0].uri); // Keep original for crop operations
      setCropEnabled(false);
      setCropArea(null);
    }
  };

  const resetAdjustments = () => {
    setBrightnessValue(1);
    setContrastValue(1);
    setSaturationValue(1);
    setWarmthValue(0);
    setRotation(0);
    setVignetteValue(0);
    setCropEnabled(false);
    setCropArea(null);
    if (originalImage) {
      setImage(originalImage);
    }
    Alert.alert("Reset", "All adjustments have been reset.");
  };

  const saveImage = async () => {
    try {
      if (!image) return;

      // First capture the view with all visual adjustments applied
      const uri = await captureRef(imageRef, {
        format: 'jpg',
        quality: 1,
      });

      // Request permission if not granted
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow access to save images.");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved", "Image saved successfully to your gallery!");
    } catch (error) {
      console.log("Save error:", error);
      Alert.alert("Error", "Failed to save image.");
    }
  };

  // New crop functions
  const handleToggleCrop = () => {
    setCropEnabled(true);
    setActiveTab("crop");
  };

  const handleCropAreaChange = (newCropArea) => {
    setCropArea(newCropArea);
  };

  const handleApplyCrop = async () => {
    if (!cropArea || !originalImage) return;

    try {
      // Get actual image dimensions
      Image.getSize(originalImage, async (imgWidth, imgHeight) => {
        // Calculate the display scale
        const displayWidth = width * 0.9;
        const aspectRatio = imgWidth / imgHeight;
        
        let displayImageWidth, displayImageHeight;
        if (aspectRatio > 1) {
          displayImageWidth = displayWidth;
          displayImageHeight = displayWidth / aspectRatio;
        } else {
          displayImageHeight = displayWidth;
          displayImageWidth = displayWidth * aspectRatio;
        }

        // Calculate crop coordinates relative to actual image size
        const scaleX = imgWidth / displayImageWidth;
        const scaleY = imgHeight / displayImageHeight;

        const actualCropX = cropArea.x * scaleX;
        const actualCropY = cropArea.y * scaleY;
        const actualCropWidth = cropArea.width * scaleX;
        const actualCropHeight = cropArea.height * scaleY;

        try {
          const croppedImage = await ImageManipulator.manipulateAsync(
            originalImage,
            [
              {
                crop: {
                  originX: actualCropX,
                  originY: actualCropY,
                  width: actualCropWidth,
                  height: actualCropHeight,
                },
              },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          );

          setImage(croppedImage.uri);
          setOriginalImage(croppedImage.uri);
          setCropEnabled(false);
          setCropArea(null);
          Alert.alert("Success", "Image cropped successfully!");
        } catch (cropError) {
          console.log("Crop error:", cropError);
          Alert.alert("Error", "Failed to crop image.");
        }
      });
    } catch (error) {
      console.log("Crop error:", error);
      Alert.alert("Error", "Failed to crop image.");
    }
  };

  const handleCancelCrop = () => {
    setCropEnabled(false);
    setCropArea(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "adjust":
        return (
          <AdjustTab
            brightnessValue={brightnessValue}
            setBrightnessValue={setBrightnessValue}
            contrastValue={contrastValue}
            setContrastValue={setContrastValue}
            saturationValue={saturationValue}
            setSaturationValue={setSaturationValue}
            warmthValue={warmthValue}
            setWarmthValue={setWarmthValue}
            vignetteValue={vignetteValue}
            setVignetteValue={setVignetteValue}
            rotation={rotation}
            setRotation={setRotation}
          />
        );
      case "crop":
        return (
          <CropTab
            cropEnabled={cropEnabled}
            onToggleCrop={handleToggleCrop}
            onApplyCrop={handleApplyCrop}
            onCancelCrop={handleCancelCrop}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Header onReset={resetAdjustments} onSave={saveImage} />

      <ImageContainer
        image={image}
        imageRef={imageRef}
        onPickImage={pickImage}
        brightnessValue={brightnessValue}
        contrastValue={contrastValue}
        saturationValue={saturationValue}
        warmthValue={warmthValue}
        rotation={rotation}
        cropEnabled={cropEnabled}
        onCropAreaChange={handleCropAreaChange}
      />

      {image && (
        <>
          <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <View style={styles.controlsContainer}>
            {renderTabContent()}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0D0D0D" 
  },
  controlsContainer: {
    maxHeight: height * 0.25,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
});

export default PhotoEditor;