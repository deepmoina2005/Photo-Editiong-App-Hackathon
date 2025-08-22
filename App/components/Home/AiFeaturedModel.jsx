import { View, Text, FlatList, TouchableOpacity, Modal, Pressable } from "react-native";
import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Wand2,
  Sparkles,
  Scissors,
} from "lucide-react-native";

import ImageGenerateModal from "../AiFeatured/generateImage";
import RemoveBackgroundMobile from "../AiFeatured/bgRemovedImage";
import RemoveObjectModal from "../AiFeatured/objectRemovedImage";
import EnhancedImage from "../AiFeatured/enhancedImage";
import OCRModal from "../AiFeatured/ocrImage";

export default function AiFeaturedModel() {
  const [aiModelList, setAiModelList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [bgModalVisible, setBgModalVisible] = useState(false);
  const [objectModalVisible, setObjectModalVisible] = useState(false);
  const [enhanceModalVisible, setEnhanceModalVisible] = useState(false);
  const [ocrModalVisible, setOCRModalVisible] = useState(false);
  const [genericModalVisible, setGenericModalVisible] = useState(false);

  useEffect(() => {
    const mockData = [
      {
        id: "1",
        name: "Image Generate",
        description: "Generate images using AI.",
        screen: "ImageGenerate",
        icon: <ImageIcon size={26} color="#4A90E2" />,
      },
      {
        id: "2",
        name: "BG Remover",
        description: "Remove backgrounds from photos instantly.",
        screen: "RemoveBackgroundMobile",
        icon: <Wand2 size={26} color="#50C878" />,
      },
      {
        id: "3",
        name: "Object Remover",
        description: "Erase unwanted objects from images.",
        screen: "RemoveObjectModal",
        icon: <Scissors size={26} color="#FF7F50" />,
      },
      {
        id: "4",
        name: "Photo Enhancer",
        description: "Improve photo quality with AI.",
        screen: "PhotoEnhancer",
        icon: <Sparkles size={26} color="#FFD700" />,
      },
      {
        id: "7",
        name: "OCR Scanner",
        description: "Extract text from images using AI OCR.",
        screen: "OCRModal",
        icon: <Sparkles size={26} color="#00AD25" />,
      },
    ];
    setAiModelList(mockData);
  }, []);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    switch (item.screen) {
      case "ImageGenerate":
        setGenerateModalVisible(true);
        break;
      case "RemoveBackgroundMobile":
        setBgModalVisible(true);
        break;
      case "RemoveObjectModal":
        setObjectModalVisible(true);
        break;
      case "PhotoEnhancer":
        setEnhanceModalVisible(true);
        break;
      case "OCRModal":
        setOCRModalVisible(true);
        break;
      default:
        setGenericModalVisible(true);
    }
  };

  return (
    <View style={{ marginTop: 20, flex: 1, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 15 }}>
        FEATURED
      </Text>

      <FlatList
        data={aiModelList}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: 65,
                height: 65,
                borderRadius: 20,
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
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

      {/* Generic Modal */}
      <Modal
        visible={genericModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGenericModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
          {selectedItem?.icon}
          <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 20 }}>
            {selectedItem?.name}
          </Text>
          <Text style={{ fontSize: 16, color: "#666", marginTop: 12, lineHeight: 22 }}>
            {selectedItem?.description}
          </Text>
          <Pressable
            onPress={() => setGenericModalVisible(false)}
            style={{ marginTop: 30, backgroundColor: "#4A90E2", paddingVertical: 15, borderRadius: 12, alignItems: "center" }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Full-screen Modals */}
      <ImageGenerateModal visible={generateModalVisible} onClose={() => setGenerateModalVisible(false)} />
      <RemoveBackgroundMobile visible={bgModalVisible} onClose={() => setBgModalVisible(false)} />
      <RemoveObjectModal visible={objectModalVisible} onClose={() => setObjectModalVisible(false)} />
      <EnhancedImage visible={enhanceModalVisible} onClose={() => setEnhanceModalVisible(false)} />
      <OCRModal visible={ocrModalVisible} onClose={() => setOCRModalVisible(false)} /> {/* Added OCR */}
    </View>
  );
}
