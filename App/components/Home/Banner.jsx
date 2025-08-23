import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";

export default function Banner() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/banner.jpg")}
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        {/* Gradient overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "transparent"]}
          style={styles.gradient}
        />

        {/* Text overlay */}
        <View style={styles.textOverlay}>
          <Text style={styles.textWhite}>✨ Welcome to Imagine Ai</Text>
          <Text style={styles.textCyan}>Where Words Become Art ✨</Text>
        </View>

        {/* Explore button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore →</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 350,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  textOverlay: {
    position: "absolute",
    top: 90,
    left: 25,
    right: 25,
  },
  textWhite: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 5,
  },
  textCyan: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ffff",
  },
  button: {
    backgroundColor: Colors.YELLOW,
    alignSelf: "flex-end",
    margin: 20,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
    shadowColor: Colors.YELLOW,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: Colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 16,
  },
});
