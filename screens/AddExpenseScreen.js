import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import CustomHeader from "../components/CustomHeader";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function AddExpenseScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const user = auth.currentUser;
      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCategories(data.selectedCategories || []);
        setSelectedCategory((data.selectedCategories || [])[0] || "");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveExpense = async () => {
    if (!selectedCategory || !amount || !description) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than RM0.");
      return;
    }

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "users", user.uid, "expenses"), {
        category: selectedCategory,
        amount: Number(amount),
        description: description,
        createdAt: new Date(),
      });

      alert("Expense added successfully!");
      navigation.replace("Dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
>
  <CustomHeader
    title="ADD EXPENSE"
    onBack={() => navigation.goBack()}
  />
      <Text style={styles.label}>Category</Text>

      <View style={styles.categoryWrapper}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Amount</Text>
      <CustomInput
        placeholder="RM 0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Description</Text>
      <CustomInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <CustomButton
        title="SAVE"
        onPress={handleSaveExpense}
      />
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

  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "700",
  },

  categoryWrapper: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},

categoryButton: {
  backgroundColor: "#EEF5FC",
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginBottom: 10,
},

selectedCategory: {
  backgroundColor: "#9ED2BE",
},

categoryText: {
  fontSize: 14,
  fontWeight: "700",
},
});