import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Image as ImageIcon, Sparkles } from "lucide-react-native";

axios.defaults.baseURL = "https://photo-editiong-app-hackathon.vercel.app";

export default function ImageGenerateModal({ visible, onClose }) {
  const stylesOptions = [
    "Realistic",
    "Ghibli style",
    "Cartoon style",
    "Anime style",
    "3D style",
    "Portrait Style",
    "Fantasy style",
    "Sci-Fi",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [publish, setPublish] = useState(false);

  const generateImage = async () => {
    if (!input.trim()) return alert("Please enter a description!");
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post("/api/ai/generate-image", {
        prompt,
        publish,
      });

      if (data.success) setResultImage(data.content);
      else alert(data.message || "Something went wrong!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  // Download the image to local filesystem
  const downloadImage = async () => {
    if (!resultImage) return;
    try {
      const fileUri = FileSystem.documentDirectory + "generated_image.jpg";
      const downloadResult = await FileSystem.downloadAsync(
        resultImage,
        fileUri
      );
      Alert.alert("Download Complete", "Image saved to: " + downloadResult.uri);
    } catch (err) {
      console.error(err);
      Alert.alert("Download Failed", "Could not save the image.");
    }
  };

  // Share the image
  const shareImage = async () => {
    if (!resultImage) return;
    try {
      const fileUri = FileSystem.documentDirectory + "generated_image.jpg";
      await FileSystem.downloadAsync(resultImage, fileUri);
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error(err);
      Alert.alert("Share Failed", "Could not share the image.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
        >
          <Sparkles size={26} color="#00AD25" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
            AI Image Generator
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
          {/* Input */}
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Describe Your Image
          </Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Describe what you want to see..."
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              textAlignVertical: "top",
              marginBottom: 15,
            }}
          />

          {/* Style Selection */}
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Choose Style
          </Text>
          <FlatList
            data={stylesOptions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedStyle(item)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selectedStyle === item ? "#00AD25" : "#ccc",
                  backgroundColor:
                    selectedStyle === item ? "#E6FFED" : "transparent",
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: selectedStyle === item ? "#00AD25" : "#555",
                    fontSize: 12,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Publish Toggle */}
          <TouchableOpacity
            onPress={() => setPublish(!publish)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#00AD25",
                backgroundColor: publish ? "#00AD25" : "transparent",
                marginRight: 8,
              }}
            />
            <Text>Make this image Public</Text>
          </TouchableOpacity>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={generateImage}
            disabled={loading}
            style={{
              backgroundColor: "#00AD25",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ImageIcon size={20} color="white" />
                <Text style={{ color: "white", marginLeft: 8 }}>
                  Generate Image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Result Image */}
          {resultImage ? (
            <>
              <Image
                source={{ uri: resultImage }}
                style={{ width: "100%", height: 300, borderRadius: 10 }}
                resizeMode="cover"
              />

              {/* Download & Share Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={downloadImage}
                  style={{
                    flex: 1,
                    backgroundColor: "#4A90E2",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Download
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={shareImage}
                  style={{
                    flex: 1,
                    backgroundColor: "#50C878",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ color: "#888", textAlign: "center" }}>
              No image yet. Generate one!
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
