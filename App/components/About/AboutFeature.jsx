import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AboutFeature({ icon, title, desc }) {
  return (
    <View style={styles.feature}>
      <FontAwesome5 name={icon} size={22} color="#1E90FF" style={{ marginRight: 10 }} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#1E3C72" },
  desc: { fontSize: 13, color: "#555", marginTop: 2 },
});
