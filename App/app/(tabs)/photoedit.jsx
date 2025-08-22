import { useState, useRef } from "react";
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
import { captureRef } from "react-native-view-shot";
import Colors from "../../constants/Colors";
import ImageContainer from "../../components/PhotoEdit/ImagePreview";
import TabsNavigation from "../../components/PhotoEdit/TabsBar";
import AdjustTab from "../../components/PhotoEdit/AdjustTab";

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

  const imageRef = useRef(null);

  // Pick image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted" && status !== "limited") {
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

  // Reset adjustments
  const resetAdjustments = () => {
    setBrightnessValue(1);
    setContrastValue(1);
    setSaturationValue(1);
    setWarmthValue(0);
    setRotation(0);
    setVignetteValue(0);
    Alert.alert("Reset", "All adjustments have been reset.");
  };

  // Save image
  const saveImage = async () => {
    try {
      if (!image) return;

      const uri = await captureRef(imageRef, {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={{ flex: 1 }} ref={imageRef} collapsable={false}>
        <ImageContainer
          image={image}
          onPickImage={pickImage}
          brightnessValue={brightnessValue}
          contrastValue={contrastValue}
          saturationValue={saturationValue}
          warmthValue={warmthValue}
          vignetteValue={vignetteValue}  // ✅ now applied
          rotation={rotation}
        />
      </View>

      {image && (
        <>
          <TabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSave={saveImage}
            onReset={resetAdjustments}
          />
          <View style={styles.controlsContainer}>
            {activeTab === "adjust" && (
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
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  controlsContainer: {
    maxHeight: height * 0.25,
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: Colors.WHITE,
  },
});

export default PhotoEditor;
