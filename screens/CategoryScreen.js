import React, { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

import CategoryCard from "../components/CategoryCard";
import CustomButton from "../components/CustomButton";

export default function CategoryScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    { id: "1", title: "Food & Drink", icon: "🍔" },
    { id: "2", title: "Transport", icon: "🚗" },
    { id: "3", title: "Home Bills", icon: "🏠" },
    { id: "4", title: "Self-Care", icon: "💄" },
    { id: "5", title: "Shopping", icon: "🛍️" },
    { id: "6", title: "Health", icon: "❤️" },
    { id: "7", title: "Education", icon: "🎓" },
    { id: "8", title: "Entertainment", icon: "🎬" },
    { id: "9", title: "Travel", icon: "✈️" },
    { id: "10", title: "Others", icon: "📦" },
  ];

  const toggleCategory = (title) => {
    if (selectedCategories.includes(title)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== title)
      );
    } else {
      setSelectedCategories([...selectedCategories, title]);
    }
  };

  const handleNext = async () => {
  if (selectedCategories.length === 0) {
    alert("Please select at least one category.");
    return;
  }

  try {
    const user = auth.currentUser;

    await updateDoc(doc(db, "users", user.uid), {
      selectedCategories: selectedCategories,
    });

    navigation.replace("Budget");
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        EXPENSE{"\n"}CATEGORIES
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <CategoryCard
            title={item.title}
            icon={item.icon}
            selected={selectedCategories.includes(item.title)}
            onPress={() => toggleCategory(item.title)}
          />
        )}
      />

      <CustomButton
        title="NEXT"
        onPress={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAE5DB",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 30,
  },

  row: {
    justifyContent: "space-between",
  },
});