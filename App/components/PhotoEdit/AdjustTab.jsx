import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const AdjustTab = ({
  brightnessValue,
  setBrightnessValue,
  contrastValue,
  setContrastValue,
  saturationValue,
  setSaturationValue,
  warmthValue,
  setWarmthValue,
  vignetteValue,
  setVignetteValue,
  rotation,
  setRotation,
}) => {
  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="sunny-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Brightness</Text>
          <Text style={styles.valueText}>{brightnessValue.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.2}
          maximumValue={2}
          value={brightnessValue}
          onValueChange={setBrightnessValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="contrast-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Contrast</Text>
          <Text style={styles.valueText}>{contrastValue.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2}
          value={contrastValue}
          onValueChange={setContrastValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="color-filter-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Saturation</Text>
          <Text style={styles.valueText}>{saturationValue.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          value={saturationValue}
          onValueChange={setSaturationValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="thermometer-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Warmth</Text>
          <Text style={styles.valueText}>{warmthValue}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={warmthValue}
          onValueChange={setWarmthValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="aperture-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Vignette</Text>
          <Text style={styles.valueText}>{vignetteValue}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={vignetteValue}
          onValueChange={setVignetteValue}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>

      <View style={styles.sliderBox}>
        <View style={styles.sliderHeader}>
          <Ionicons name="sync-outline" size={20} color="#FF3366" />
          <Text style={styles.sliderLabel}>Rotation</Text>
          <Text style={styles.valueText}>{rotation}°</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={360}
          step={1}
          value={rotation}
          onValueChange={setRotation}
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#444"
          thumbTintColor="#FF3366"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    padding: 20,
    height: 250,
  },
  sliderBox: { 
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: { 
    color: "black",   // 🔥 changed to black
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginLeft: 8,
  },
  valueText: { 
    color: "black",   // 🔥 changed to black
    fontWeight: "600",
    fontSize: 12,
    minWidth: 30,
    textAlign: "right",
  },
  slider: { 
    width: "100%", 
    height: 30,
  },
});


export default AdjustTab;