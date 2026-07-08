import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CategoryCard({ title, icon, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EEF5FC",
    width: "47%",
    height: 120,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D9E6F2",
  },

  selectedCard: {
    backgroundColor: "#9ED2BE",
    borderColor: "#5CA987",
  },

  icon: {
    fontSize: 32,
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
  },
});