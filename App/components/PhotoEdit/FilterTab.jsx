import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FiltersTab = () => {
  return (
    <ScrollView horizontal style={styles.filtersContainer} showsHorizontalScrollIndicator={false}>
      {[
        { name: "Original", icon: "remove-outline" },
        { name: "Clarendon", icon: "contrast-outline" },
        { name: "Juno", icon: "flower-outline" },
        { name: "Lark", icon: "sunny-outline" },
        { name: "Moon", icon: "moon-outline" },
        { name: "Gingham", icon: "grid-outline" },
        { name: "Aden", icon: "color-palette-outline" },
        { name: "Valencia", icon: "heart-outline" },
      ].map((filter, index) => (
        <TouchableOpacity key={index} style={styles.filterItem}>
          <View style={styles.filterIconContainer}>
            <Ionicons name={filter.icon} size={24} color="#FF3366" />
          </View>
          <Text style={styles.filterText}>{filter.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    padding: 15,
  },
  filterItem: {
    alignItems: "center",
    marginRight: 20,
  },
  filterIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  filterText: {
    color: "white",
    fontSize: 12,
  },
});

export default FiltersTab;