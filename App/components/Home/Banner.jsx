import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default function Banner() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/banner.jpg")}
        style={styles.image}
      />

      <View style={styles.textOverlay}>
        <Text style={styles.textWhite}>Turn Words</Text>
        <Text style={styles.textYellow}>into ART</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Explore</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },
  textOverlay: {
    position: "absolute",
    left: 15,
    top: 15,
  },
  textWhite: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  textYellow: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.YELLOW,
  },
  button: {
    backgroundColor: Colors.YELLOW,
    position: "absolute",
    bottom: 15,
    right: 15,
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
});
