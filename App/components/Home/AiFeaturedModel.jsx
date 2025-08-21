import { View, Text, FlatList, TouchableOpacity, Modal, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Image as ImageIcon, Wand2, Scissors, Sparkles, Paintbrush, Contrast } from "lucide-react-native";
import ImageGenerate from "../AiFeatured/generateImage";

export default function AiFeaturedModel() {
  const [aiModelList, setAiModelList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showGenerateScreen, setShowGenerateScreen] = useState(false); // ✅

  useEffect(() => {
    GetAiModelFeaturedList();
  }, []);

  const GetAiModelFeaturedList = async () => {
    const mockData = [
      { id: "1", name: "Image Generate", description: "Generate images using AI.", screen: "ImageGenerate", icon: <ImageIcon size={26} color="#4A90E2" /> },
      { id: "2", name: "BG Remover", description: "Remove backgrounds from photos instantly.", screen: "BgRemover", icon: <Wand2 size={26} color="#50C878" /> },
      { id: "3", name: "Object Remover", description: "Erase unwanted objects from images.", screen: "ObjectRemover", icon: <Scissors size={26} color="#FF7F50" /> },
      { id: "4", name: "Photo Enhancer", description: "Improve photo quality with AI.", screen: "PhotoEnhancer", icon: <Sparkles size={26} color="#FFD700" /> },
      { id: "5", name: "Art Style", description: "Transform photos into artistic styles.", screen: "ArtStyle", icon: <Paintbrush size={26} color="#8A2BE2" /> },
      { id: "6", name: "Color Fixer", description: "Adjust brightness & contrast instantly.", screen: "ColorFixer", icon: <Contrast size={26} color="#FF1493" /> },
    ];
    setAiModelList(mockData);
  };

  // ✅ Conditional rendering for ImageGenerate
  if (showGenerateScreen && selectedItem?.screen === "ImageGenerate") {
    return <ImageGenerate />;
  }

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 15 }}>FEATURED</Text>

      <FlatList
        data={aiModelList}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedItem(item);
              if (item.screen === "ImageGenerate") {
                setShowGenerateScreen(true); // ✅ show ImageGenerate directly
              } else {
                setModalVisible(true);
              }
            }}
            style={{ flex: 1, alignItems: "center" }}
          >
            <View
              style={{
                width: 65,
                height: 65,
                borderRadius: 20,
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {item.icon}
            </View>
            <Text style={{ marginTop: 8, fontSize: 13, fontWeight: "600", textAlign: "center" }}>
              {item?.name || "Unnamed"}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              width: 320,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            {selectedItem?.icon}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>{selectedItem?.name}</Text>
            <Text style={{ fontSize: 14, color: "#666", marginTop: 8, textAlign: "center" }}>
              {selectedItem?.description}
            </Text>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 12,
                backgroundColor: "#4A90E2",
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}