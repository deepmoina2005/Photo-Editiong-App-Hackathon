import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, FlatList } from "react-native";
import axios from "axios";
import { Image as ImageIcon, Sparkles } from "lucide-react-native";

axios.defaults.baseURL = "http://10.0.2.2:3000"; 

export default function ImageGenerate() {
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
    if (!input) return alert("Please enter a description!");
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post("/api/ai/generate-image", { prompt, publish });

      if (data.success) setResultImage(data.content);
      else alert(data.message || "Something went wrong!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Sparkles size={26} color="#00AD25" />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>AI Image Generator</Text>
      </View>

      <Text style={{ fontWeight: "600", marginBottom: 8 }}>Describe Your Image</Text>
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

      <Text style={{ fontWeight: "600", marginBottom: 8 }}>Choose Style</Text>
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
              backgroundColor: selectedStyle === item ? "#E6FFED" : "transparent",
              marginRight: 8,
            }}
          >
            <Text style={{ color: selectedStyle === item ? "#00AD25" : "#555", fontSize: 12 }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => setPublish(!publish)}
        style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}
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
            <Text style={{ color: "white", marginLeft: 8 }}>Generate Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {resultImage ? (
        <Image source={{ uri: resultImage }} style={{ width: 300, height: 300, borderRadius: 10 }} resizeMode="cover" />
      ) : (
        <Text style={{ color: "#888", textAlign: "center" }}>No image yet. Generate one!</Text>
      )}
    </View>
  );
}
