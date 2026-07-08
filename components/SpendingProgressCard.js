import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function SpendingProgressCard({
  icon,
  category,
  expense,
  budget,
}) {

  const progress =
    budget > 0 ? (expense / budget) * 100 : 0;

  const barColor =
    progress >= 100
      ? "#E74C3C"
      : progress >= 80
      ? "#F39C12"
      : "#27AE60";

  return (
    <View style={styles.card}>

      <View style={styles.header}>

        <Text style={styles.title}>
          {icon} {category}
        </Text>

        <Text style={styles.amount}>
          RM {expense} / RM {budget}
        </Text>

      </View>

      <View style={styles.progressBackground}>

        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress,100)}%`,
              backgroundColor: barColor,
            },
          ]}
        />

      </View>

      <Text style={styles.percent}>
        {progress.toFixed(0)}% Used
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#EEF5FC",
    borderRadius:18,
    padding:18,
    marginBottom:18,
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:12,
  },

  title:{
    fontSize:16,
    fontWeight:"700",
  },

  amount:{
    fontSize:15,
    fontWeight:"600",
  },

  progressBackground:{
    height:10,
    backgroundColor:"#D9E6F2",
    borderRadius:10,
    overflow:"hidden",
  },

  progressFill:{
    height:"100%",
    borderRadius:10,
  },

  percent:{
    marginTop:8,
    color:"#666",
    fontWeight:"600",
  },

});