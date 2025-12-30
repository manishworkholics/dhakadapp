import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

const plans = [
  {
    id: "free",
    title: "Free",
    price: "₹0",
    duration: "Lifetime",
    features: [
      "Create profile",
      "Browse matches",
      "Send limited interests",
    ],
    current: true,
  },
  {
    id: "silver",
    title: "Silver",
    price: "₹999",
    duration: "3 Months",
    features: [
      "Send unlimited interests",
      "View contact details",
      "Chat with matches",
    ],
  },
  {
    id: "gold",
    title: "Gold",
    price: "₹1999",
    duration: "6 Months",
    features: [
      "All Silver features",
      "Priority listing",
      "Profile boost",
    ],
  },
  {
    id: "platinum",
    title: "Platinum",
    price: "₹2999",
    duration: "12 Months",
    features: [
      "All Gold features",
      "Dedicated support",
      "Top profile badge",
    ],
  },
];

export default function PlanScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header
        title="My Plan"
        onMenuPress={() => navigation.openDrawer()}
      />

      <ScrollView contentContainerStyle={{ padding: 14 }}>
        {plans.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.current && styles.currentPlan,
            ]}
          >
            {/* Header */}
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              {plan.current && (
                <Text style={styles.currentBadge}>CURRENT PLAN</Text>
              )}
            </View>

            {/* Price */}
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.duration}>{plan.duration}</Text>

            {/* Features */}
            <View style={styles.featureList}>
              {plan.features.map((item, index) => (
                <Text key={index} style={styles.feature}>
                  • {item}
                </Text>
              ))}
            </View>

            {/* Button */}
            {!plan.current && (
              <TouchableOpacity style={styles.upgradeBtn}>
                <Text style={styles.upgradeText}>Upgrade Now</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
}


const styles = StyleSheet.create({
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  currentPlan: {
    borderWidth: 2,
    borderColor: "#28a745",
  },

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  planTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  currentBadge: {
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },

  price: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
  },

  duration: {
    color: "#777",
    marginBottom: 10,
  },

  featureList: {
    marginVertical: 10,
  },

  feature: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },

  upgradeBtn: {
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 10,
  },

  upgradeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
