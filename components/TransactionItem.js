import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TransactionItem({
  icon,
  category,
  description,
  amount,
}) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.category}>
          {icon} {category}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      <Text style={styles.amount}>
        RM {Number(amount || 0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEF5FC",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    fontSize: 16,
    fontWeight: "700",
  },

  description: {
    marginTop: 5,
    color: "#666",
    fontSize: 14,
  },

  amount: {
    fontSize: 16,
    fontWeight: "900",
  },
});