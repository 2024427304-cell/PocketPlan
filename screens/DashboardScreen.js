import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import SummaryCard from "../components/SummaryCard";
import TransactionItem from "../components/TransactionItem";
import CustomButton from "../components/CustomButton";
import SpendingProgressCard from "../components/SpendingProgressCard";
import { CATEGORY_LIST } from "../data/categories";

export default function DashboardScreen({ navigation }) {
  const [name, setName] = useState("");
  const [income, setIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [expensesByCategory, setExpensesByCategory] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

const loadDashboardData = async () => {
  try {
    const user = auth.currentUser;

    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (userSnap.exists()) {
      const data = userSnap.data();

      setName(data.username || data.name || "User");
      setIncome(data.income || 0);

      const budgets = data.budgets || {};
      setBudgets(budgets);

      const budgetTotal = Object.values(budgets).reduce(
        (sum, value) => sum + Number(value || 0),
        0
      );

      setTotalBudget(budgetTotal);
    }

    const expenseSnap = await getDocs(
      collection(db, "users", user.uid, "expenses")
    );

    const expenseList = [];
    let expenseTotal = 0;
    const categoryTotals = {};

    expenseSnap.forEach((docItem) => {
  const expense = docItem.data();

  expenseList.push({
    id: docItem.id,
    ...expense,
  });

  expenseTotal += Number(expense.amount || 0);

  categoryTotals[expense.category] =
    (categoryTotals[expense.category] || 0) +
    Number(expense.amount || 0);
});

    setTransactions(expenseList);
    setTotalExpenses(expenseTotal);
    setExpensesByCategory(categoryTotals);

  } catch (error) {
    alert(error.message);
  }
};

  const remaining = income - totalExpenses;

  const hour = new Date().getHours();

  let greeting = "🌙 Good Evening";

  if (hour < 12) {
    greeting = "☀️ Good Morning";
  } else if (hour < 18) {
    greeting = "🌤 Good Afternoon";
  }

  const handleDeleteExpense = (expenseId) => {
  Alert.alert(
    "Delete Expense",
    "Are you sure you want to delete this expense?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const user = auth.currentUser;

            await deleteDoc(
              doc(db, "users", user.uid, "expenses", expenseId)
            );

            alert("Expense deleted successfully!");
            loadDashboardData();

          } catch (error) {
            alert(error.message);
          }
        },
      },
    ]
  );
};
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.greeting}>{greeting},</Text>      
    <Text style={styles.name}>{name}</Text>

      <View style={styles.cardRow}>
      <SummaryCard
        icon="💸"
        title="Total Expenses"
        value={`RM ${totalExpenses}`}
        progress={totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0}      />        
        <SummaryCard icon="🎯" title="Budget" value={`RM ${totalBudget}`} />
        <SummaryCard icon="💵" title="Remaining" value={`RM ${remaining}`} />
        <SummaryCard icon="🧾" title="Transactions" value={transactions.length} />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <Text style={styles.sectionTitle}>Spending Overview</Text>

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

      <CustomButton
        title="ADD EXPENSE"
        onPress={() => navigation.navigate("AddExpense")}
      />

      <CustomButton
        title="VIEW REPORT"
        onPress={() => navigation.navigate("Report")}
      />

      <CustomButton
        title="PROFILE"
        onPress={() => navigation.navigate("Profile")}
      />

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No expenses yet.
          </Text>

          <Text style={styles.emptyText}>
            Start tracking your expenses by tapping{"\n"}
            "Add Expense".
          </Text>
        </View>
      ) : (
        transactions.slice(0, 5).map((item, index) => (
          <View key={item.id}>
            <TransactionItem
              icon="🧾"
              category={item.category}
              description={item.description}
              amount={item.amount}
            />

            <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
              <Text style={styles.deleteText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        ))
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
    paddingBottom: 40,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "700",
  },

  name: {
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 25,
  },

  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "900",
  },

  emptyText: {
    color: "#555",
    fontSize: 16,
  },

  emptyContainer: {
  backgroundColor: "#EEF5FC",
  padding: 20,
  borderRadius: 20,
  alignItems: "center",
},

emptyTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 8,
},

emptyText: {
  color: "#666",
  textAlign: "center",
  fontSize: 15,
},

deleteText: {
  color: "red",
  fontWeight: "700",
  textAlign: "right",
  marginBottom: 15,
},

deleteText: {
  color: "red",
  fontWeight: "700",
  textAlign: "right",
  marginBottom: 15,
},
});