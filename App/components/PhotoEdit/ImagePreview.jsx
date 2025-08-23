import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "../../constants/Colors";

const { width } = Dimensions.get("window");

const ImageContainer = ({ 
  image, 
  imageRef, 
  onPickImage, 
  brightnessValue, 
  contrastValue, 
  saturationValue, 
  warmthValue, 
  rotation 
}) => {
  const getImageStyle = () => {
    return {
      width: width * 0.9,
      height: width * 0.9,
      transform: [{ rotate: `${rotation}deg` }],
      resizeMode: "contain",
      borderRadius: 12,
      // CSS filter effects for preview only
      filter: `brightness(${brightnessValue}) contrast(${contrastValue}) saturate(${saturationValue}) sepia(${warmthValue/100})`,
    };
  };

  return (
    <View style={styles.imageContainer} ref={imageRef} collapsable={false}>
      {!image ? (
        <TouchableOpacity onPress={onPickImage} style={styles.selectButtonContainer}>
          <LinearGradient
            colors={["#FF6B6B", "#FF3366"]}
            style={styles.selectButton}
          >
            <Ionicons name="image-outline" size={32} color="white" />
            <Text style={styles.selectButtonText}>Choose Photo</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <Image
          source={{ uri: image }}
          style={getImageStyle()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  selectButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectButton: {
    width: width * 0.6,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#FF3366",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  selectButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "700",
    marginTop: 8,
  },
});

export default ImageContainer;