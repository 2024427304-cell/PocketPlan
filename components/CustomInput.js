import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function CustomInput(props) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#888"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#EEF5FC",
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginTop: 8,
  },
});