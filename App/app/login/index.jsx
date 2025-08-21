import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const onPress = () => {
    // 🚀 Since Clerk is removed, just navigate to Home
    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Top Banner Image */}
      <Image
        source={require("../../assets/images/login.jpg")}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      {/* Login Container */}
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Welcome to Imagin AI</Text>
        <Text style={styles.subtitle}>
          Create AI Image Editing in just one click
        </Text>

        {/* Continue Button */}
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing you agree to our Terms and Conditions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerImage: {
    width: "100%",
    height: 600,
  },
  loginContainer: {
    padding: 25,
    marginTop: -20,
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 18,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  termsText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.GRAY,
    fontSize: 13,
  },
});
