import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SummaryCard({
  icon,
  title,
  value,
  progress = 0,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>

      <View style={styles.progressBackground}>
  <View
    style={[
      styles.progressFill,
      {
        width: `${Math.min(progress, 100)}%`,
        backgroundColor:
          progress >= 100
            ? "#E74C3C"
            : progress >= 80
            ? "#F39C12"
            : "#27AE60",
      },
    ]}
  />
</View>

      <Text style={styles.progressText}>
        {progress.toFixed(0)}% Used
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#EEF5FC",
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D9E6F2",
  },

  icon: {
    fontSize: 26,
  },

  title: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
    fontWeight: "600",
  },

  value: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
  progressBackground: {
  marginTop: 12,
  height: 8,
  backgroundColor: "#D9E6F2",
  borderRadius: 10,
  overflow: "hidden",
},

progressFill: {
  height: "100%",
  borderRadius: 10,
},

progressText: {
  marginTop: 6,
  fontSize: 12,
  color: "#666",
  fontWeight: "600",
},
});