import { View, Text, Image } from "react-native";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";

export default function Header() {
  const { user } = useUser();

  const profileImage = user?.imageUrl || "../../assets/images/react-logo.png";

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        {/* Credits */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            borderWidth: 0.4,
            borderRadius: 99,
            paddingHorizontal: 10,
          }}
        >
          <Image
            source={require("./../../assets/images/coin.png")}
            style={{
              width: 25,
              height: 25,
            }}
          />
        </View>

        {/* Profile Image */}
        <Image
          source={{ uri: profileImage }}
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
