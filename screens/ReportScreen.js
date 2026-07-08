import React, { useCallback, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

import CustomHeader from "../components/CustomHeader";
import SpendingProgressCard from "../components/SpendingProgressCard";
import { CATEGORY_LIST } from "../data/categories";

export default function ReportScreen({ navigation }) {
  const [income, setIncome] = useState(0);
  const [budgets, setBudgets] = useState({});
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [transactionCount, setTransactionCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadReportData();
    }, [])
  );

  const loadReportData = async () => {
    try {
      const user = auth.currentUser;

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (userSnap.exists()) {
        const data = userSnap.data();

        setIncome(data.income || 0);

        const budgetData = data.budgets || {};
        setBudgets(budgetData);

        const budgetTotal = Object.values(budgetData).reduce(
          (sum, value) => sum + Number(value || 0),
          0
        );
        setTotalBudget(budgetTotal);
      }

      const expenseSnap = await getDocs(
        collection(db, "users", user.uid, "expenses")
      );

      let expenseTotal = 0;
      const categoryTotals = {};

      expenseSnap.forEach((docItem) => {
        const expense = docItem.data();

        expenseTotal += Number(expense.amount || 0);

        categoryTotals[expense.category] =
          (categoryTotals[expense.category] || 0) +
          Number(expense.amount || 0);
      });

      setTotalExpenses(expenseTotal);
      setExpensesByCategory(categoryTotals);
      setTransactionCount(expenseSnap.size);    } catch (error) {
      alert(error.message);
    }
  };

  const remaining = income - totalExpenses;

  const categoryArray = Object.keys(expensesByCategory);

  const topCategory =
    categoryArray.length > 0
      ? categoryArray.reduce((top, current) =>
          expensesByCategory[current] > expensesByCategory[top]
            ? current
            : top
        )
      : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader
        title="REPORT"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.label}>Total Income</Text>
        <Text style={styles.amount}>RM {income}</Text>

        <Text style={styles.label}>Total Budget</Text>
        <Text style={styles.amount}>RM {totalBudget}</Text>

        <Text style={styles.label}>Total Expenses</Text>
        <Text style={styles.amount}>RM {totalExpenses}</Text>

        <Text style={styles.label}>Remaining</Text>
        <Text style={styles.amount}>RM {remaining}</Text>
      </View>

      <Text style={styles.label}>
      Total Transactions
      </Text>

      <Text style={styles.amount}>
      {transactionCount}
      </Text>

      <Text style={styles.sectionTitle}>Spending Insight</Text>

      {topCategory ? (
        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>Top Spending Category</Text>
          <Text style={styles.insightValue}>
            {CATEGORY_LIST.find((c) => c.title === topCategory)?.icon || "💰"}{" "}
            {topCategory}
          </Text>
          <Text style={styles.insightAmount}>
            RM {expensesByCategory[topCategory]}
          </Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>No expenses recorded yet.</Text>
      )}

      <Text style={styles.sectionTitle}>Category Summary</Text>

      {Object.keys(budgets).map((category) => {
        const categoryInfo = CATEGORY_LIST.find(
          (c) => c.title === category
        );

        return (
          <SpendingProgressCard
            key={category}
            icon={categoryInfo?.icon || "💰"}
            category={category}
            expense={expensesByCategory[category] || 0}
            budget={budgets[category] || 0}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAE5DB",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40,
  },

  summaryBox: {
    backgroundColor: "#EEF5FC",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "700",
  },

  amount: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "900",
  },

  insightBox: {
    backgroundColor: "#EEF5FC",
    borderRadius: 20,
    padding: 18,
  },

  insightTitle: {
    fontSize: 15,
    color: "#555",
    fontWeight: "700",
  },

  insightValue: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },

  insightAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  emptyText: {
    color: "#555",
    fontSize: 16,
  },
});