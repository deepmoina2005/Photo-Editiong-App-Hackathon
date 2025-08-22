import { useState } from "react";
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
import axios from "axios";
import { Sparkles, Image as ImageIcon, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

const API_KEY = "wx08frrxe86v2lo7k";
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

  const copyURL = async () => {
    if (!colorizedImage) return;
    await Clipboard.setStringAsync(colorizedImage);
    Alert.alert("Copied", "Colorized image URL copied to clipboard");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
          <Sparkles size={26} color="#FF4500" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>Photo Colorizer</Text>
          <Pressable onPress={onClose} style={{ marginLeft: "auto", padding: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF3B30" }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
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

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 20 }}
              resizeMode="cover"
            />
          )}

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

          {colorizedImage && (
            <>
              <Image
                source={{ uri: colorizedImage }}
                style={{ width: "100%", height: 220, borderRadius: 12, marginBottom: 15 }}
                resizeMode="cover"
              />

              <TouchableOpacity
                onPress={copyURL}
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
                <Copy size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
                  Copy Image URL
                </Text>
              </TouchableOpacity>
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
