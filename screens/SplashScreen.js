import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {  return (
    <View style={styles.container}>
      <Text style={styles.title}>PocketPlan</Text>
      <Text style={styles.subtitle}>Budget Tracker</Text>

      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate("Login")}
>
  <Text style={styles.buttonText}>LOG IN</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate("Register")}
>
  <Text style={styles.buttonText}>REGISTER</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9e5dc",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 52,
    fontWeight: "900",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 30,
    fontStyle: "italic",
    marginBottom: 120,
  },
  button: {
    backgroundColor: "#eef7fb",
    width: "80%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#dbe7f0",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
});