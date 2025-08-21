import { SafeAreaView, ScrollView } from "react-native";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import AiFeaturedModel from "../../components/Home/AiFeaturedModel";

export default function HomeTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Header */}
        <Header />

        {/* Banner */}
        <Banner />

        {/* Featured List */}
        <AiFeaturedModel />
      </ScrollView>
    </SafeAreaView>
  );
}
