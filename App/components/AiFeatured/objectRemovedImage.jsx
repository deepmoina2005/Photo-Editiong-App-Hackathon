import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import axios from "axios";
import { Scissors, Sparkles } from "lucide-react-native";

axios.defaults.baseURL = "https://photo-editiong-app-hackathon.vercel.app";

export default function RemoveObjectModal({ visible, onClose }) {
  const [image, setImage] = useState(null);
  const [objectName, setObjectName] = useState("");
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

  const removeObject = async () => {
    if (!image || !objectName.trim()) {
      return Alert.alert("Error", "Please select an image and enter an object name.");
    }

    if (objectName.trim().split(" ").length > 1) {
      return Alert.alert("Error", "Please enter only one object name.");
    }

    try {
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("image", { uri: image, name: `photo.${fileType}`, type: `image/${fileType}` });
      formData.append("object", objectName);

      const { data } = await axios.post("/api/ai/remove-image-object", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) setProcessedImage(data.content);
      else Alert.alert("Error", data.message || "Failed to remove object");
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
      // convert base64 to file URI
      const fileUri = FileSystem.documentDirectory + "object_removed.png";
      await FileSystem.writeAsStringAsync(
        fileUri,
        processedImage.replace(/^data:image\/\w+;base64,/, ""),
        { encoding: FileSystem.EncodingType.Base64 }
      );

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to share image");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <Sparkles size={26} color="#00AD25" />
            <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>Object Removal</Text>
          </View>

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
            <Scissors size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>Pick Image</Text>
          </TouchableOpacity>

          {/* Image Preview */}
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: "#E5E7EB" }}
              resizeMode="cover"
            />
          )}

          {/* Object Name Input */}
          <Text style={{ marginBottom: 8, fontWeight: "600" }}>Object Name (one word)</Text>
          <TextInput
            value={objectName}
            onChangeText={setObjectName}
            placeholder="e.g., watch"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
          />

          {/* Remove Object Button */}
          <TouchableOpacity
            onPress={removeObject}
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
                <Scissors size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
                  Remove Object
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
                <Scissors size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
                  Share Image
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#EF4444",
              padding: 15,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}