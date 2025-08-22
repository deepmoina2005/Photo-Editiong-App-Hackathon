import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TabsNavigation = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === "adjust" && styles.activeTab]} 
        onPress={() => onTabChange("adjust")}
      >
        <Ionicons 
          name="options-outline" 
          size={20} 
          color={activeTab === "adjust" ? "#FF3366" : "#888"} 
        />
        <Text style={[styles.tabText, activeTab === "adjust" && styles.activeTabText]}>
          Adjust
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF3366",
  },
  tabText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
});

export default TabsNavigation;