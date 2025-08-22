import { View, Text, Image } from "react-native";
import Colors from "../../constants/Colors";

export default function Header() {
  // Default profile image (local)
  const profileImage = require("../../assets/images/react-logo.png");

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 3
      }}
    >
      <Text
        style={{
          fontSize: 30,
          color: Colors.PRIMARY,
          fontWeight: "bold",
        }}
      >
        Imagin AI
      </Text>

      <View style={{ flexDirection: "row" }}>
        {/* Profile Image */}
        <Image
          source={profileImage}
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
          }}
        />
      </View>
    </View>
  );
}
