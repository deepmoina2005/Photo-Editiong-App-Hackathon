import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default function Header() {
  const profileImage = require("../../assets/images/react-logo.png");

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Imagin AI</Text>
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  title: {
    fontSize: 30,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 99,
  },
});
