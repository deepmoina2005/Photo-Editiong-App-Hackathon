import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ onReset, onSave }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Imagine AI</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={onReset}>
          <Ionicons name="refresh-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onSave}>
          <Ionicons name="save-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 35,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default Header;