// EnhancedImage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Sparkles, Image as ImageIcon } from "lucide-react-native";
import { enhancedImageAPI } from "../../utils/enhancedImageApi"; // your TechHK API helper

export default function EnhancedImage({ visible, onClose }) {
  const [image, setImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission required", "Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
        setEnhancedImage(null);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Enhance image using TechHK API
  const enhanceImage = async () => {
    if (!image) return Alert.alert("No image", "Please select an image first.");

    try {
      setLoading(true);

      // Prepare file for API
      const file = {
        uri: image,
        name: image.split("/").pop(),
        type: "image/jpeg",
      };

      const result = await enhancedImageAPI(file);
      if (!result?.image) return Alert.alert("Error", "Enhanced image not returned");

      setEnhancedImage(result.image);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to enhance image.");
    } finally {
      setLoading(false);
    }
  };

  // Save enhanced image to gallery
  const saveImageToGallery = async () => {
    if (!enhancedImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Cannot save image without permission.");
        return;
      }

      const fileUri = FileSystem.documentDirectory + "enhanced_image.png";

      if (enhancedImage.startsWith("data:image")) {
        const base64Data = enhancedImage.split("base64,")[1].replace(/\s/g, '');
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        await FileSystem.downloadAsync(enhancedImage, fileUri);
      }

      const finalUri = fileUri.startsWith("file://") ? fileUri : "file://" + fileUri;
      const asset = await MediaLibrary.createAssetAsync(finalUri);
      await MediaLibrary.createAlbumAsync("Enhanced Images", asset, false);

      Alert.alert("Download Complete", "Image saved to your gallery!");
    } catch (err) {
      console.error(err);
      Alert.alert("Download Failed", "Could not save the image.");
    }
  };

  // Share enhanced image
  const shareImage = async () => {
    if (!enhancedImage) return;

    try {
      const fileUri = FileSystem.documentDirectory + "enhanced_image.png";

      if (enhancedImage.startsWith("data:image")) {
        const base64Data = enhancedImage.split("base64,")[1].replace(/\s/g, '');
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        await FileSystem.downloadAsync(enhancedImage, fileUri);
      }

      const finalUri = fileUri.startsWith("file://") ? fileUri : "file://" + fileUri;
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(finalUri, { mimeType: "image/png" });
    } catch (err) {
      console.error(err);
      Alert.alert("Share Failed", "Could not share the image.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
          <Sparkles size={26} color="#FFD700" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>Photo Enhancer</Text>
          <Pressable onPress={onClose} style={{ marginLeft: "auto", padding: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF3B30" }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Pick Image */}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#3B82F6",
              padding: 15,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <ImageIcon size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>Pick Image</Text>
          </TouchableOpacity>

          {/* Original Image */}
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 20 }}
              resizeMode="cover"
            />
          )}

          {/* Enhance Button */}
          <TouchableOpacity
            onPress={enhanceImage}
            disabled={loading || !image}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#10B981",
              padding: 15,
              borderRadius: 12,
              marginBottom: 20,
              opacity: loading || !image ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Sparkles size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
                  Enhance Image
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Enhanced Image */}
          {enhancedImage && (
            <>
              <Image
                source={{ uri: enhancedImage }}
                style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 15 }}
                resizeMode="cover"
              />

              {/* Download & Share Buttons */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={saveImageToGallery}
                  style={{ flex: 1, backgroundColor: "#4A90E2", padding: 12, borderRadius: 10, alignItems: "center", marginRight: 5 }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={shareImage}
                  style={{ flex: 1, backgroundColor: "#F59E0B", padding: 12, borderRadius: 10, alignItems: "center", marginLeft: 5 }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Share</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {!image && !enhancedImage && (
            <Text style={{ color: "#888", textAlign: "center", marginVertical: 20 }}>
              No image selected yet. Pick an image to start!
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}