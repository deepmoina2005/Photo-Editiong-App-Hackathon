import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const {user} = useUser()
  return (
    <View>
      {!user ? <Redirect href={'login'}/>:
      <Redirect href={'/(tabs)/home'}/>}
      
    </View>
  );
}