import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from 'react-native-view-shot';

const { width, height } = Dimensions.get("window");

const PhotoEditor = () => {
  const [image, setImage] = useState(null);
  const [brightnessValue, setBrightnessValue] = useState(1);
  const [contrastValue, setContrastValue] = useState(1);
  const [saturationValue, setSaturationValue] = useState(1);
  const [warmthValue, setWarmthValue] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [vignetteValue, setVignetteValue] = useState(0);
  const [activeTab, setActiveTab] = useState("adjust");
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
    }
  };

  const resetAdjustments = () => {
    setBrightnessValue(1);
    setContrastValue(1);
    setSaturationValue(1);
    setWarmthValue(0);
    setRotation(0);
    setVignetteValue(0);
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

  // Apply CSS filters for the preview (these won't be in the saved image)
  const getImageStyle = () => {
    return {
      width: width * 0.9,
      height: width * 0.9,
      transform: [{ rotate: `${rotation}deg` }],
      resizeMode: "contain",
      borderRadius: 12,
      // CSS filter effects for preview only
      filter: `brightness(${brightnessValue}) contrast(${contrastValue}) saturate(${saturationValue}) sepia(${warmthValue/100})`,
    };
  };

  const applyCrop = async (ratio) => {
  if (!image) return;

  try {
    // First, get the actual image size
    Image.getSize(image, async (imgWidth, imgHeight) => {
      let cropWidth = imgWidth;
      let cropHeight = imgHeight;
      let originX = 0;
      let originY = 0;

      if (ratio === "1:1") {
        cropWidth = cropHeight = Math.min(imgWidth, imgHeight);
        originX = (imgWidth - cropWidth) / 2;
        originY = (imgHeight - cropHeight) / 2;
      } else if (ratio === "4:3") {
        cropHeight = (imgWidth * 3) / 4;
        if (cropHeight > imgHeight) {
          cropHeight = imgHeight;
          cropWidth = (imgHeight * 4) / 3;
        }
        originX = (imgWidth - cropWidth) / 2;
        originY = (imgHeight - cropHeight) / 2;
      } else if (ratio === "16:9") {
        cropHeight = (imgWidth * 9) / 16;
        if (cropHeight > imgHeight) {
          cropHeight = imgHeight;
          cropWidth = (imgHeight * 16) / 9;
        }
        originX = (imgWidth - cropWidth) / 2;
        originY = (imgHeight - cropHeight) / 2;
      } else if (ratio === "3:4") {
        cropWidth = (imgHeight * 3) / 4;
        if (cropWidth > imgWidth) {
          cropWidth = imgWidth;
          cropHeight = (imgWidth * 4) / 3;
        }
        originX = (imgWidth - cropWidth) / 2;
        originY = (imgHeight - cropHeight) / 2;
      } else if (ratio === "9:16") {
        cropWidth = (imgHeight * 9) / 16;
        if (cropWidth > imgWidth) {
          cropWidth = imgWidth;
          cropHeight = (imgWidth * 16) / 9;
        }
        originX = (imgWidth - cropWidth) / 2;
        originY = (imgHeight - cropHeight) / 2;
      } else {
        // Free crop (no action)
        return;
      }

      try {
        const cropped = await ImageManipulator.manipulateAsync(
          image,
          [
            {
              crop: {
                originX: originX,
                originY: originY,
                width: cropWidth,
                height: cropHeight,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        setImage(cropped.uri);
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

  const renderAdjustTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="sunny-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Brightness</Text>
          <Text style={styles.valueText}>{brightnessValue.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.2}
          maximumValue={2}
          value={brightnessValue}
          onValueChange={setBrightnessValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="contrast-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Contrast</Text>
          <Text style={styles.valueText}>{contrastValue.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2}
          value={contrastValue}
          onValueChange={setContrastValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="color-filter-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Saturation</Text>
          <Text style={styles.valueText}>{saturationValue.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          value={saturationValue}
          onValueChange={setSaturationValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="thermometer-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Warmth</Text>
          <Text style={styles.valueText}>{warmthValue}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={warmthValue}
          onValueChange={setWarmthValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="aperture-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Vignette</Text>
          <Text style={styles.valueText}>{vignetteValue}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={vignetteValue}
          onValueChange={setVignetteValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="sync-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Rotation</Text>
          <Text style={styles.valueText}>{rotation}°</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={360}
          step={1}
          value={rotation}
          onValueChange={setRotation}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>
    </ScrollView>
  );

  const renderFiltersTab = () => (
    <ScrollView horizontal style={styles.filtersContainer} showsHorizontalScrollIndicator={false}>
      {[
        { name: "Original", icon: "remove-outline" },
        { name: "Clarendon", icon: "contrast-outline" },
        { name: "Juno", icon: "flower-outline" },
        { name: "Lark", icon: "sunny-outline" },
        { name: "Moon", icon: "moon-outline" },
        { name: "Gingham", icon: "grid-outline" },
        { name: "Aden", icon: "color-palette-outline" },
        { name: "Valencia", icon: "heart-outline" },
      ].map((filter, index) => (
        <TouchableOpacity key={index} style={styles.filterItem}>
          <View style={styles.filterIconContainer}>
            <Ionicons name={filter.icon} size={24} color="#FF3366" />
          </View>
          <Text style={styles.filterText}>{filter.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderCropTab = () => (
    <ScrollView horizontal style={styles.cropContainer} showsHorizontalScrollIndicator={false}>
      {[
        { ratio: "Free", icon: "resize-outline" },
        { ratio: "1:1", icon: "square-outline" },
        { ratio: "4:3", icon: "phone-portrait-outline" },
        { ratio: "16:9", icon: "desktop-outline" },
        { ratio: "3:4", icon: "phone-portrait-outline" },
        { ratio: "9:16", icon: "phone-portrait-outline" },
      ].map((crop, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.cropItem}
          onPress={() => applyCrop(crop.ratio)}
        >
          <View style={styles.cropIconContainer}>
            <Ionicons name={crop.icon} size={24} color="#FF3366" />
          </View>
          <Text style={styles.cropText}>{crop.ratio}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Imagine AI</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={resetAdjustments}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={saveImage}>
            <Ionicons name="save-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Area with ref for capture */}
      <View style={styles.imageContainer} ref={imageRef} collapsable={false}>
        {!image ? (
          <TouchableOpacity onPress={pickImage} style={styles.selectButtonContainer}>
            <LinearGradient
              colors={["#FF6B6B", "#FF3366"]}
              style={styles.selectButton}
            >
              <Ionicons name="image-outline" size={32} color="white" />
              <Text style={styles.selectButtonText}>Choose Photo</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <Image
            source={{ uri: image }}
            style={getImageStyle()}
          />
        )}
      </View>

      {/* Tabs Navigation */}
      {image && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "adjust" && styles.activeTab]} 
            onPress={() => setActiveTab("adjust")}
          >
            <Ionicons 
              name="options-outline" 
              size={20} 
              color={activeTab === "adjust" ? "#FF3366" : "#888"} 
            />
            <Text style={[styles.tabText, activeTab === "adjust" && styles.activeTabText]}>
              Adjust
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === "filters" && styles.activeTab]} 
            onPress={() => setActiveTab("filters")}
          >
            <Ionicons 
              name="color-palette-outline" 
              size={20} 
              color={activeTab === "filters" ? "#FF3366" : "#888"} 
            />
            <Text style={[styles.tabText, activeTab === "filters" && styles.activeTabText]}>
              Filters
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === "crop" && styles.activeTab]} 
            onPress={() => setActiveTab("crop")}
          >
            <Ionicons 
              name="crop-outline" 
              size={20} 
              color={activeTab === "crop" ? "#FF3366" : "#888"} 
            />
            <Text style={[styles.tabText, activeTab === "crop" && styles.activeTabText]}>
              Crop
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Controls Container */}
      {image && (
        <View style={styles.controlsContainer}>
          {activeTab === "adjust" && renderAdjustTab()}
          {activeTab === "filters" && renderFiltersTab()}
          {activeTab === "crop" && renderCropTab()}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0D0D0D" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 35,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  selectButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectButton: {
    width: width * 0.6,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#FF3366",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  selectButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "700",
    marginTop: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF3366",
  },
  tabText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  controlsContainer: {
    maxHeight: height * 0.25,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  tabContent: {
    padding: 20,
  },
  sliderBox: { 
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: { 
    color: "white", 
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginLeft: 8,
  },
  valueText: { 
    color: "#FF3366", 
    fontWeight: "600",
    fontSize: 12,
    minWidth: 30,
    textAlign: "right",
  },
  slider: { 
    width: "100%", 
    height: 30,
  },
  filtersContainer: {
    flexDirection: "row",
    padding: 15,
  },
  filterItem: {
    alignItems: "center",
    marginRight: 20,
  },
  filterIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  filterText: {
    color: "white",
    fontSize: 12,
  },
  cropContainer: {
    flexDirection: "row",
    padding: 15,
  },
  cropItem: {
    alignItems: "center",
    marginRight: 20,
  },
  cropIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cropText: {
    color: "white",
    fontSize: 12,
  },
});

export default PhotoEditor;