import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Image as ImageIcon, Wand2, Scissors, Sparkles } from "lucide-react-native";

export default function AiFeaturedModel() {
  const [aiModelList, setAiModelList] = useState([]);

  useEffect(() => {
    GetAiModelFeaturedList();
  }, []);

  const GetAiModelFeaturedList = async () => {
    try {
      const mockData = [
        {
          id: "1",
          name: "Image Generate",
          icon: <ImageIcon size={28} color="#4A90E2" />,
        },
        {
          id: "2",
          name: "BG Remover",
          icon: <Wand2 size={28} color="#50C878" />,
        },
        {
          id: "3",
          name: "Object Remover",
          icon: <Scissors size={28} color="#FF7F50" />,
        },
        {
          id: "4",
          name: "Photo Enhancer",
          icon: <Sparkles size={28} color="#FFD700" />,
        },
      ];

      setAiModelList(mockData);
    } catch (error) {
      console.error("Error fetching featured models:", error);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>FEATURED</Text>

      <FlatList
        data={aiModelList}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginRight: 20, alignItems: "center" }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#f0f0f0",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.icon}
            </View>
            <Text
              style={{ marginTop: 5, fontSize: 12, fontWeight: "600", textAlign: "center" }}
            >
              {item?.name || "Unnamed"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}