import { SafeAreaView, View, StyleSheet } from "react-native";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import AiFeaturedModel from "../../components/Home/AiFeaturedModel";

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header />
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Banner />
      </View>

      {/* AI Featured List */}
      <View style={styles.featuredContainer}>
        <AiFeaturedModel />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15, // horizontal spacing
    paddingTop: 35,        // top spacing
  },
  headerContainer: {
    marginBottom: 15,
  },
  bannerContainer: {
    marginBottom: 20,
  },
  featuredContainer: {
    flex: 1,
  },
});