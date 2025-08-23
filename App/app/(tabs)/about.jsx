import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import AboutHeader from "../../components/About/AboutHeader";
import AboutCard from "../../components/About/AboutCard";
import AboutFeature from "../../components/About/AboutFeature";
import AboutFooter from "../../components/About/AboutFooter";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <AboutHeader />
        <AboutCard />
        <AboutFeature
          icon="palette"
          title="Creative Filters"
          desc="Apply stunning filters and effects instantly."
        />
        <AboutFeature
          icon="adjust"
          title="Photo Adjustments"
          desc="Fine-tune brightness, contrast, saturation and more."
        />
        <AboutFeature
          icon="magic"
          title="Background Removal"
          desc="Remove Background of Any image"
        />
        <AboutFeature
          icon="eraser"
          title="Object Removal"
          desc="Remove anything from a photo using AI"
        />
        <AboutFeature
          icon="robot"
          title="AI image genration"
          desc="Generate image in just one propmt"
        />
        <AboutFeature
          icon="camera"
          title="OCR Scanning"
          desc="Scan Any document and get the texts"
        />
        <AboutFeature
          icon="image"
          title="Photo Colorization"
          desc="Make old photos looks new & colourful"
        />
        <AboutFeature
          icon="share-alt"
          title="Easy Sharing"
          desc="Export and share your art instantly."
        />
      </ScrollView>
      <AboutFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },
});
