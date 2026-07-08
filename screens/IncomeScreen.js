import React, { useState, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function IncomeScreen({ navigation, route }) {
  const isEdit = route?.params?.mode === "edit";  
  const [income, setIncome] = useState("");
  
  useEffect(() => {
  if (isEdit) {
    loadIncome();
  }
}, [isEdit]);

const loadIncome = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("No user logged in.");
      return;
    }

    const docSnap = await getDoc(doc(db, "users", user.uid));

    if (docSnap.exists()) {
      const data = docSnap.data();
      setIncome(String(data.income || ""));
    }
  } catch (error) {
    alert(error.message);
  }
};

  const handleNext = async () => {

  if (Number(income) <= 0) {
  alert("Income must be greater than RM0.");
  return;
}

  if (!income) {
    alert("Please enter your monthly income.");
    return;
  }

  try {

    const user = auth.currentUser;

    await updateDoc(doc(db, "users", user.uid), {
      income: Number(income),
    });

    alert("Income saved successfully!");

    if (isEdit) {
      navigation.replace("Profile");
      } else {
        navigation.replace("Category");
      }

  } catch (error) {

    alert(error.message);

  }

};

  return (
    <View style={styles.container}>

      <Text style={styles.icon}>💰</Text>

      <Text style={styles.title}>
        MONTHLY{"\n"}INCOME
      </Text>

      <Text style={styles.description}>
        Enter your monthly income to help us calculate your budget.
      </Text>

      <CustomInput
        placeholder="RM 0.00"
        keyboardType="numeric"
        value={income}
        onChangeText={setIncome}
      />

      <CustomButton
        title={isEdit ? "SAVE" : "NEXT"}
        onPress={handleNext}
      />

      <TouchableOpacity
        onPress={() => {
          if (isEdit) {
            navigation.replace("Profile");
          } else {
            navigation.replace("Category");
          }
        }}
      >
        <Text style={styles.skip}>
          {isEdit ? "Cancel" : "Skip →"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAE5DB",
    paddingHorizontal: 30,
    justifyContent: "center",
  },

  icon: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 20,
  },

  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },

  skip: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
});