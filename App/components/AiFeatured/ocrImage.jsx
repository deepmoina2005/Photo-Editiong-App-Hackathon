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
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import { Sparkles, Image as ImageIcon, Copy } from "lucide-react-native";

const API_KEY = "wx95jubo9aszdd6nf";
const BASE_URL = "https://techhk.aoscdn.com/";

export default function OCRModal({ visible, onClose }) {
  const [image, setImage] = useState(null);
  const [ocrText, setOCRText] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission required",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
      setOCRText("");
    }
  };

  const performOCR = async () => {
    if (!image) return Alert.alert("No image", "Please select an image first.");

    try {
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("image_file", {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      formData.append("format", "txt");

      const { data } = await axios.post(
        `${BASE_URL}/api/tasks/document/ocr`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": API_KEY,
          },
        }
      );

      const taskId = data?.data?.task_id;
      if (!taskId) throw new Error("Failed to create OCR task");

      const result = await pollOCRResult(taskId);

      if (result?.file) {
        const txtResponse = await axios.get(result.file);
        setOCRText(txtResponse.data);
      } else {
        setOCRText("No text extracted");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to extract text from image.");
    } finally {
      setLoading(false);
    }
  };

  const pollOCRResult = async (taskId, retries = 0) => {
    const MAX_RETRIES = 60;
    const { data } = await axios.get(
      `${BASE_URL}/api/tasks/document/ocr/${taskId}`,
      {
        headers: { "X-API-KEY": API_KEY },
      }
    );

    if (data?.data?.state !== 1) {
      if (retries >= MAX_RETRIES) throw new Error("OCR processing timeout");
      await new Promise((res) => setTimeout(res, 1000));
      return pollOCRResult(taskId, retries + 1);
    }

    return data.data;
  };

  const copyText = async () => {
    try {
      await Clipboard.setStringAsync(ocrText);
      Alert.alert("Copied", "OCR text copied to clipboard");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to copy text");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
        >
          <Sparkles size={26} color="#00AD25" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
            OCR Scanner
          </Text>
          <Pressable
            onPress={onClose}
            style={{ marginLeft: "auto", padding: 8 }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#FF3B30" }}
            >
              ✕
            </Text>
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
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 16,
                marginLeft: 8,
              }}
            >
              Pick Image
            </Text>
          </TouchableOpacity>

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

          <TouchableOpacity
            onPress={performOCR}
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
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 16,
                    marginLeft: 8,
                  }}
                >
                  Extract Text
                </Text>
              </>
            )}
          </TouchableOpacity>

          {ocrText ? (
            <View
              style={{
                maxHeight: 300, // fixed height
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                backgroundColor: "#F3F4F6",
                padding: 10,
                marginBottom: 20,
              }}
            >
              <ScrollView
                nestedScrollEnabled={true}
                style={{ marginBottom: 10 }}
              >
                <Text>{ocrText}</Text>
              </ScrollView>

              <TouchableOpacity
                onPress={copyText}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F59E0B",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Copy size={18} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "600", marginLeft: 6 }}
                >
                  Copy Text
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            !loading && (
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 20 }}
              >
                No OCR text yet
              </Text>
            )
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}