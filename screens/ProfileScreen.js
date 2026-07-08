import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import CustomHeader from "../components/CustomHeader";
import CustomButton from "../components/CustomButton";
import { CATEGORY_LIST } from "../data/categories";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = auth.currentUser;

    const docSnap = await getDoc(doc(db, "users", user.uid));

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  };

  const handleLogout = async () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to log out?"
  );

  if (!confirmLogout) return;

  await signOut(auth);
  navigation.replace("Login");
};

  const handleDeleteCategory = async (categoryName) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to remove "${categoryName}"?`
  );

  if (!confirmDelete) return;

  try {
    const user = auth.currentUser;

    const updatedCategories =
      userData.selectedCategories.filter(
        (item) => item !== categoryName
      );

    const updatedBudgets = { ...userData.budgets };
    delete updatedBudgets[categoryName];

    await updateDoc(doc(db, "users", user.uid), {
      selectedCategories: updatedCategories,
      budgets: updatedBudgets,
    });

    alert("Category removed successfully!");

    setUserData({
      ...userData,
      selectedCategories: updatedCategories,
      budgets: updatedBudgets,
    });
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader
        title="PROFILE"
        onBack={() => navigation.goBack()}
      />
      

      <Text style={styles.label}>Name</Text>
      <Text style={styles.value}>{userData.name}</Text>

      <Text style={styles.label}>Username</Text>
      <Text style={styles.value}>{userData.username}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{userData.email}</Text>

      <Text style={styles.label}>Monthly Income</Text>
      <Text style={styles.value}>RM {userData.income}</Text>

      <Text style={styles.label}>Expense Categories</Text>

      {userData.selectedCategories?.map((category) => {
        const info = CATEGORY_LIST.find(
          (item) => item.title === category
        );

        return (
          <View key={category} style={styles.categoryRow}>
          <Text style={styles.categoryText}>
            {info?.icon} {category}
          </Text>

          <TouchableOpacity onPress={() => handleDeleteCategory(category)}>
            <Text style={styles.deleteText}>Remove</Text>          
          </TouchableOpacity>
        </View>
        );
      })}

      <CustomButton
        title="EDIT INCOME"
        onPress={() => navigation.navigate("Income", { mode: "edit" })}
      />

      <CustomButton
        title="EDIT BUDGET"
        onPress={() => navigation.navigate("Budget")}
      />

      <CustomButton
        title="LOG OUT"
        onPress={handleLogout}
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
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
  },

  value: {
    backgroundColor: "#EEF5FC",
    padding: 15,
    borderRadius: 20,
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },

  category: {
    backgroundColor: "#EEF5FC",
    padding: 14,
    borderRadius: 18,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  categoryRow: {
  backgroundColor: "#EEF5FC",
  padding: 14,
  borderRadius: 18,
  marginTop: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

categoryText: {
  fontSize: 16,
  fontWeight: "600",
},

deleteText: {
  color: "red",
  fontWeight: "700",
},
});