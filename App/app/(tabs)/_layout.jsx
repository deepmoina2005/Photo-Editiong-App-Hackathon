import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarShowLabel: true,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home", // <-- use tabBarLabel instead of title
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={22} color={color} />,
        }}
      />

      {/* Photo Edit Button */}
      <Tabs.Screen
        name="photoedit"
        options={{
          tabBarLabel: "", // safe
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: Colors.PRIMARY,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <AntDesign name="plus" size={28} color="white" />
            </View>
          ),
        }}
      />

      {/* Collection */}
      <Tabs.Screen
        name="collection"
        options={{
          tabBarLabel: "Collection",
          tabBarIcon: ({ color }) => <FontAwesome5 name="folder-open" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
