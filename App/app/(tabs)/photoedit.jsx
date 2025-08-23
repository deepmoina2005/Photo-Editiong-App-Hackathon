import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { captureRef } from "react-native-view-shot";
import { Save, Share2 } from "lucide-react-native";

import Colors from "../../constants/Colors";
import ImageContainer from "../../components/PhotoEdit/ImagePreview";
import AdjustTab from "../../components/PhotoEdit/AdjustTab";

const { height } = Dimensions.get("window");

const PhotoEditor = () => {
  const [image, setImage] = useState(null);

  // Adjustment states
  const [brightnessValue, setBrightnessValue] = useState(1);
  const [contrastValue, setContrastValue] = useState(1);
  const [saturationValue, setSaturationValue] = useState(1);
  const [warmthValue, setWarmthValue] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [vignetteValue, setVignetteValue] = useState(0);

  const imageRef = useRef(null);

// ✅ Pick image with multiple crop options
const pickImage = async (cropType = "free") => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted" && status !== "limited") {
    Alert.alert("Permission required", "Please allow gallery access.");
    return;
  }

  let aspect = undefined; // default: free crop
  if (cropType === "square") aspect = [1, 1];
  if (cropType === "portrait") aspect = [3, 4];
  if (cropType === "landscape") aspect = [4, 3];

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect, // undefined = free crop
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};

  // ✅ Manual crop example
  const handleCrop = async () => {
    if (!image) return;

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        image,
        [{ crop: { originX: 0, originY: 0, width: 300, height: 300 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipResult.uri);
    } catch (error) {
      console.log("Crop error:", error);
      Alert.alert("Error", "Failed to crop image.");
    }
  };

  // ✅ Save image
  const saveImageToGallery = async () => {
    if (!image) return;

    try {
      const uri = await captureRef(imageRef.current, {
        format: "jpg",
        quality: 1,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted" && status !== "limited") {
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

  // ✅ Share image
  const shareImage = async () => {
    if (!image) return;

    try {
      const uri = await captureRef(imageRef.current, {
        format: "jpg",
        quality: 1,
      });
      const fileUri = FileSystem.documentDirectory + "edited_image.jpg";

      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device.");
        return;
      }

      await Sharing.shareAsync(fileUri, { mimeType: "image/jpeg" });
    } catch (error) {
      console.log("Share error:", error);
      Alert.alert("Error", "Failed to share image.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Save & Share Buttons */}
      {image && (
        <View style={styles.topButtonRow}>
          <Save size={28} color="white" onPress={saveImageToGallery} />
          <Share2
            size={28}
            color="white"
            onPress={shareImage}
            style={{ marginLeft: 15 }}
          />
        </View>
      )}

      {/* Image Preview */}
      <View style={{ flex: 1 }} ref={imageRef} collapsable={false}>
        <ImageContainer
          image={image}
          onPickImage={pickImage}
          brightnessValue={brightnessValue}
          contrastValue={contrastValue}
          saturationValue={saturationValue}
          warmthValue={warmthValue}
          vignetteValue={vignetteValue}
          rotation={rotation}
        />
      </View>

      {/* Adjustment Controls */}
      {image && (
        <View style={styles.controlsContainer}>
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
            onCropPress={handleCrop} // manual crop
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BLACK },
  topButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    paddingTop: 40,
    backgroundColor: "#000",
  },
  controlsContainer: {
    maxHeight: height * 0.45,
    backgroundColor: Colors.BLACK,
    borderTopWidth: 1,
    borderTopColor: "#444",
    padding: 12,
  },
});

export default PhotoEditor;