import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login successful!");

    navigation.replace("Dashboard");

  } catch (error) {
    alert(error.message);
  }

};

const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email has been sent.");
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>WELCOME</Text>
      <Text style={styles.title}>BACK.</Text>

      <Text style={styles.label}>EMAIL</Text>
      <CustomInput
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>PASSWORD</Text>
      <CustomInput
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleForgotPassword}>
      <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <CustomButton
        title="LOG IN"
        onPress={handleLogin}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.register}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAE5DB",
    paddingHorizontal: 35,
    justifyContent: "center",
    paddingBottom: 40,
  },

  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#000",
    lineHeight: 52,
  },

  label: {
    marginTop: 30,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },

  forgot: {
    marginTop: 15,
    textAlign: "right",
    color: "#444",
  },

  register: {
    marginTop: 25,
    textAlign: "center",
    color: "#444",
  },
});