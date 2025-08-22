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
import axios from "axios";
import { Sparkles, Image as ImageIcon } from "lucide-react-native";

const API_KEY = "wx95jubo9aszdd6nf";
const BASE_URL = "https://techhk.aoscdn.com/";

export default function ColorizeModal({ visible, onClose }) {
  const [image, setImage] = useState(null);
  const [colorizedImage, setColorizedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
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
      setColorizedImage(null);
    }
  };

  const colorizeImage = async () => {
    if (!image) return Alert.alert("No image", "Please select an image first.");

    try {
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("sync", "0"); // async mode
      formData.append("return_type", 1); // 1 = return URL
      formData.append("image_file", {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      // Step 1: create colorization task
      const { data } = await axios.post(`${BASE_URL}api/tasks/visual/colorization`, formData, {
        headers: { "Content-Type": "multipart/form-data", "X-API-KEY": API_KEY },
      });

      const taskId = data?.data?.task_id;
      if (!taskId) throw new Error("Failed to create colorization task");

      // Step 2: poll result
      const result = await pollColorizationResult(taskId);
      if (!result?.image) throw new Error("Colorized image not returned");

      setColorizedImage(result.image);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to colorize image.");
    } finally {
      setLoading(false);
    }
  };

  const pollColorizationResult = async (taskId, retries = 0) => {
    const MAX_RETRIES = 30;
    const { data } = await axios.get(`${BASE_URL}api/tasks/visual/colorization/${taskId}`, {
      headers: { "X-API-KEY": API_KEY },
    });

    if (data?.data?.state !== 1) {
      if (retries >= MAX_RETRIES) throw new Error("Colorization processing timeout");
      await new Promise((res) => setTimeout(res, 1000));
      return pollColorizationResult(taskId, retries + 1);
    }

    return data.data;
  };

  const saveImageToGallery = async () => {
    if (!colorizedImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Cannot save image without permission.");
        return;
      }

      const fileUri = FileSystem.documentDirectory + "colorized_image.png";
      await FileSystem.downloadAsync(colorizedImage, fileUri);

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("AI Images", asset, false);

      Alert.alert("Download Complete", "Image saved to your gallery!");
    } catch (err) {
      console.error(err);
      Alert.alert("Download Failed", "Could not save the image.");
    }
  };

  const shareImage = async () => {
    if (!colorizedImage) return;

    try {
      const fileUri = FileSystem.documentDirectory + "colorized_image.png";
      await FileSystem.downloadAsync(colorizedImage, fileUri);

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(fileUri, { mimeType: "image/png" });
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
          <Sparkles size={26} color="#FF4500" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>Photo Colorizer</Text>
          <Pressable onPress={onClose} style={{ marginLeft: "auto", padding: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF3B30" }}>✕</Text>
          </Pressable>
        </View>

        {/* Body */}
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

          {/* Original Image Preview */}
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 20 }}
              resizeMode="cover"
            />
          )}

          {/* Colorize Button */}
          <TouchableOpacity
            onPress={colorizeImage}
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
                  Colorize Image
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Colorized Image Preview + Actions */}
          {colorizedImage && (
            <>
              <Image
                source={{ uri: colorizedImage }}
                style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 15 }}
                resizeMode="cover"
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={saveImageToGallery}
                  style={{
                    flex: 1,
                    backgroundColor: "#4A90E2",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={shareImage}
                  style={{
                    flex: 1,
                    backgroundColor: "#F59E0B",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Share</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {!image && !colorizedImage && (
            <Text style={{ color: "#888", textAlign: "center", marginVertical: 20 }}>
              No image selected yet. Pick an image to start!
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
