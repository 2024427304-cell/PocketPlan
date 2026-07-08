import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CATEGORY_LIST } from "../data/categories";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function BudgetScreen({ navigation }) {
  const [budgets, setBudgets] = useState({});
  const [categories, setCategories] = useState([]);
  const [income, setIncome] = useState(0);
  const [newCategory, setNewCategory] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {
        const data = docSnap.data();
        setIncome(data.income || 0);
        setCategories(data.selectedCategories || []);
        setBudgets(data.budgets || {});
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const totalBudget = Object.values(budgets).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );

  const remaining = income - totalBudget;

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
      alert("Please enter category name.");
      return;
    }

    if (categories.includes(trimmedCategory)) {
      alert("Category already exists.");
      return;
    }

    setCategories([...categories, trimmedCategory]);
    setBudgets({
      ...budgets,
      [trimmedCategory]: "",
    });
    setNewCategory("");
  };

  const handleSaveBudget = async () => {
    if (remaining < 0) {
      alert("Budget exceeds your monthly income.");
      return;
    }

    for (let category of categories) {
      if (budgets[category] === undefined || budgets[category] === "") {
        alert("Please fill in all budget fields.");
        return;
      }

      if (Number(budgets[category]) < 0) {
        alert("Budget cannot be negative.");
        return;
      }
    }

    try {
      const user = auth.currentUser;
      const formattedBudgets = {};

      categories.forEach((category) => {
        formattedBudgets[category] = Number(budgets[category]);
      });

      await updateDoc(doc(db, "users", user.uid), {
        selectedCategories: categories,
        budgets: formattedBudgets,
        remainingBudget: remaining,
      });

      alert("Budget saved successfully!");
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
      <Text style={styles.title}>SET YOUR{"\n"}BUDGET</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Monthly Income</Text>
        <Text style={styles.summaryAmount}>RM {income}</Text>

        <Text style={styles.summaryText}>Remaining Budget</Text>
        <Text style={[styles.summaryAmount, remaining < 0 && styles.warningText]}>
          RM {remaining}
        </Text>

        {remaining < 0 && (
          <Text style={styles.warning}>Budget exceeds your monthly income.</Text>
        )}
      </View>

      {categories.length === 0 ? (
        <>
          <Text style={styles.emptyText}>
            No expense categories selected yet.
          </Text>

          <CustomButton
            title="SELECT CATEGORIES"
            onPress={() => navigation.navigate("Category")}
          />
        </>
      ) : (
        <>
          {categories.map((item) => (
            <View key={item} style={styles.item}>
              <Text style={styles.label}>
                {CATEGORY_LIST.find((c) => c.title === item)?.icon || "💰"} {item}
              </Text>

              <CustomInput
                placeholder="RM 0.00"
                keyboardType="numeric"
                value={budgets[item]?.toString() || ""}
                onChangeText={(text) =>
                  setBudgets({
                    ...budgets,
                    [item]: text,
                  })
                }
              />
            </View>
          ))}

          <Text style={styles.label}>Add Other Expense</Text>

          <CustomInput
            placeholder="Enter expense name"
            value={newCategory}
            onChangeText={setNewCategory}
          />

          <CustomButton title="ADD CATEGORY" onPress={handleAddCategory} />

          <CustomButton title="DONE" onPress={handleSaveBudget} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
    flexGrow: 1,
    backgroundColor: "#EAE5DB",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 30,
},

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
  },

  summaryBox: {
    backgroundColor: "#EEF5FC",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },

  summaryText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
  },

  summaryAmount: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 12,
  },

  warningText: {
    color: "red",
  },

  warning: {
    color: "red",
    fontWeight: "600",
  },

  item: {
    marginBottom: 18,
  },

  label: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginBottom: 15,
  },
});