import { View, Text, Image } from "react-native";
import { useContext } from "react";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Header() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);

  const displayCredits = userDetail?.Credits ?? 0;
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
          <Text>{displayCredits}</Text>
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
