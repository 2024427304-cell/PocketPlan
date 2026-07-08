import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function RegisterScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    console.log("Button pressed");

    console.log({
      name,
      username,
      email,
      password,
      confirmPassword,
    });

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        username: username,
        email: email,
        income: 0,
        createdAt: new Date(),
      });

      alert("Account created successfully!");

      navigation.replace("Income");
      
    } catch (error) {
      alert(error.message);
    }
  };

  return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

      <Text style={styles.title}>
        READY TO MANAGE{"\n"}YOUR EXPENSES?
      </Text>

      <Text style={styles.label}>NAME</Text>
      <CustomInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>USERNAME</Text>
      <CustomInput
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

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

      {password.length > 0 && password.length < 6 && (
        <Text style={styles.error}>Password must be at least 6 characters.</Text>
      )}

      <Text style={styles.label}>CONFIRM PASSWORD</Text>
      <CustomInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <CustomButton
          title="REGISTER"
          onPress={handleRegister}
      />

      <TouchableOpacity
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink}>
            Log In
          </Text>
        </Text>    
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

    container: {
    flexGrow: 1,
    backgroundColor: "#EAE5DB",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 30,
    lineHeight: 42,
    color: "#000",
  },

  label:{
    marginTop:15,
    marginBottom:5,
    fontWeight:"700",
    fontSize:17,
  },

  error: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },

  loginText: {
  marginTop: 20,
  textAlign: "center",
  fontSize: 15,
  color: "#555",
},

loginLink: {
  color: "#36506F",
  fontWeight: "700",
},
});