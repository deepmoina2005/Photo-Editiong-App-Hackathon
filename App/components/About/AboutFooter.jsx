import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutFooter() {
  return (
    <LinearGradient
      colors={["#1E3C72", "#2A5298"]}
      style={styles.footer}
    >
      <View style={styles.row}>
        <FontAwesome5 name="envelope" size={18} color="#FFD700" />
        <Text style={styles.text}> support@imagine.ai.com </Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="globe" size={18} color="#00FFFF" />
        <Text style={styles.text}> www.imagine.ai.com </Text>
      </View>
      <Text style={styles.copy}>© 2025 Imagine AI</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -3 },
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  text: { fontSize: 14, color: "#fff", marginLeft: 8 },
  copy: { fontSize: 12, color: "#ccc", marginTop: 6, fontStyle: "italic" },
});
