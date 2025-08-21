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
import axios from "axios";
import { Sparkles, Image as ImageIcon } from "lucide-react-native";

axios.defaults.baseURL = "https://photo-editiong-app-hackathon.vercel.app";

export default function RemoveBackgroundMobile({ visible, onClose }) {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setProcessedImage(null);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const removeBackground = async () => {
    if (!image) return Alert.alert("No image", "Please select an image first.");

    try {
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("image", { uri: image, name: `photo.${fileType}`, type: `image/${fileType}` });

      const { data } = await axios.post("/api/ai/remove-image-background", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) setProcessedImage(data.content);
      else Alert.alert("Error", data.message || "Failed to remove background");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network or server error");
    } finally {
      setLoading(false);
    }
  };

  const shareImage = async () => {
    if (!processedImage) return;
    try {
      const fileUri = FileSystem.documentDirectory + "bg_removed_image.png";
      await FileSystem.writeAsStringAsync(fileUri, processedImage.replace(/^data:image\/\w+;base64,/, ""), {
        encoding: FileSystem.EncodingType.Base64,
      });
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
          <Sparkles size={26} color="#00AD25" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>Background Removal</Text>
          <Pressable onPress={onClose} style={{ marginLeft: "auto", padding: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF3B30" }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Pick Image Button */}
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
              style={{
                width: "100%",
                height: 220,
                borderRadius: 12,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
              resizeMode="cover"
            />
          )}

          {/* Remove Background Button */}
          <TouchableOpacity
            onPress={removeBackground}
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
                <ImageIcon size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
                  Remove Background
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Processed Image Preview */}
          {processedImage && (
            <>
              <Image
                source={{ uri: processedImage }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 12,
                  marginBottom: 15,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
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

          {!processedImage && !image && (
            <Text style={{ color: "#888", textAlign: "center", marginVertical: 20 }}>
              No image selected yet. Pick an image to start!
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
