import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#EEF5FC",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});