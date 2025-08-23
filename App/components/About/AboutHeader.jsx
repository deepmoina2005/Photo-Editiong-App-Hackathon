import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutHeader() {
  const imagineAi = require("../../assets/images/imagine_ai_logo.png");
    
  return (
    <LinearGradient
      colors={["#1E3C72", "#2A5298"]}
      style={styles.header}
    >
      <Image
        source={imagineAi}
        style={styles.avatar}
      />
      <Text style={styles.title}>IMAGINE AI</Text>
      <Text style={styles.subtitle}>About us in a nutshell — scroll down to discover !</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#E0E0E0",
    marginTop: 6,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
