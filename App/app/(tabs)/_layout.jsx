/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useContext, useEffect, useCallback } from "react";
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function TabLayout() {
  const { user } = useUser();
  const userContext = useContext(UserDetailContext);

  const VerifyUser = useCallback(async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      // ✅ Since backend is removed, use mock user data
      const mockUser = {
        id: "offline-123",
        userName: user?.fullName || "Guest User",
        UserEmail: email,
      };

      userContext?.setUserDetail?.(mockUser);
      console.log("Mock user set:", mockUser);

    } catch (e) {
      console.log("Error setting mock user:", e);
    }
  }, [user, userContext]);

  useEffect(() => {
    if (user && userContext) {
      VerifyUser();
    }
  }, [user, VerifyUser]);

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
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={22} color={color} />
          ),
        }}
      />

      {/* Projects */}
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="images" size={22} color={color} />
          ),
        }}
      />

      {/* Big Center Edit Button */}
      <Tabs.Screen
        name="photoedit"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: Colors.PRIMARY,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20, // lifts above bar
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
          title: "Collection",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="folder-open" size={22} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
 