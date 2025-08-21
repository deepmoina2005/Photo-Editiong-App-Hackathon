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

  // Share enhanced image
  const shareImage = async () => {
    if (!enhancedImage) return;

    try {
      const fileUri = FileSystem.documentDirectory + "enhanced_image.jpg";
      await FileSystem.writeAsStringAsync(
        fileUri,
        enhancedImage.replace(/^data:image\/\w+;base64,/, ""),
        { encoding: FileSystem.EncodingType.Base64 }
      );
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to share image");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
          <Sparkles size={26} color="#FFD700" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
            Photo Enhancer
          </Text>
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
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
              Pick Image
            </Text>
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

              {/* Share Button */}
              <TouchableOpacity
                onPress={shareImage}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F59E0B",
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 20,
                }}
              >
                <ImageIcon size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
                  Share Image
                </Text>
              </TouchableOpacity>
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
