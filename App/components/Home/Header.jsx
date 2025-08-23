import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";

export default function Header() {
  const profileImage = require("../../assets/images/imagine_ai_logo.png");

  return (
    <LinearGradient
      colors={["#ffffff", "#f0f8ff"]}
      style={styles.headerContainer}
    >
      <Text style={styles.title}>✨ Imagine Ai</Text>
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    color: "#1E90FF",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 0,
    borderColor: Colors.PRIMARY,
    shadowColor: "#1E90FF",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
});
