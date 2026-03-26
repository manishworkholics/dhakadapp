import React, { useEffect, useState, useCallback } from "react";
import RazorpayCheckout from "react-native-razorpay";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFocusEffect } from "@react-navigation/native";
const stripHtml = (html) => {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
};

const API_URL = "http://143.110.244.163:5000/api";

export default function PlanScreen() {
  const [myPlan, setMyPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ================= API CALLS ================= */

  const fetchMyPlan = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/plan/my-plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setMyPlan(res.data.userPlan);
      else setMyPlan(null);
    } catch {
      setMyPlan(null);
    }
  };

  const fetchAllPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/plan`);
      if (res.data.success) setPlans(res.data.plans);
    } catch (e) {
      console.log("PLAN FETCH ERROR", e.message);
    }
  };

  const fetchPaymentHistory = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/plan/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPaymentHistory(res.data.history);
    } catch (e) {
      console.log("HISTORY ERROR", e.message);
    }
  };

  /* ================= LOAD ALL ================= */

  const loadAll = async () => {
    const token = await AsyncStorage.getItem("token");
    await Promise.all([
      fetchMyPlan(token),
      fetchAllPlans(),
      fetchPaymentHistory(token),
    ]);
    setLoading(false);
    setRefreshing(false);
  };

  /* 🔁 SCREEN FOCUS REFRESH */
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadAll();
    }, [])
  );

  /* 🔁 PULL TO REFRESH */
  const onRefresh = () => {
    setRefreshing(true);
    loadAll();
  };

  /* ================= PAYMENT ================= */

  const handleBuy = async (plan) => {
    try {
      setPaying(true);
      const token = await AsyncStorage.getItem("token");

      const orderRes = await axios.post(
        `${API_URL}/plan/create-order`,
        { planId: plan._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, key } = orderRes.data;

      const options = {
        key,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Dhakad Matrimony",
        description: `${plan.name} Plan`,
        order_id: orderId,
        theme: { color: "#ff4e50" },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          const verifyRes = await axios.post(
            `${API_URL}/plan/verify`,
            {
              razorpay_order_id: orderId,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            alert("🎉 Payment Successful & Plan Activated!");
            loadAll();
          } else {
            alert("❌ Payment verification failed");
          }
        })
        .catch(() => alert("Payment cancelled"))
        .finally(() => setPaying(false));
    } catch (err) {
      console.log("PAYMENT ERROR", err?.response?.data || err.message);
      alert("Payment failed");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Premium Membership" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff4e50"]}
            tintColor="#ff4e50"
          />
        }
      >
        {/* ===== Banner ===== */}
        <View style={styles.banner}>
          <Icon name="diamond" size={45} color="#fff" />
          <Text style={styles.bannerTitle}>Upgrade to Premium</Text>
          <Text style={styles.bannerSub}>
            Find your perfect life partner faster
          </Text>
        </View>

        {/* ===== Current Plan ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Current Plan</Text>

          {myPlan ? (
            <View style={styles.currentPlan}>
              <Text style={styles.planName}>{myPlan.plan.name}</Text>
              <Text style={styles.planMeta}>
                Valid till: {new Date(myPlan.endDate).toDateString()}
              </Text>
              <Text style={styles.planPrice}>₹{myPlan.plan.price}</Text>
            </View>
          ) : (
            <Text style={styles.noPlan}>No active plan</Text>
          )}
        </View>

        {/* ===== All Plans ===== */}
        <Text style={styles.sectionTitle1}>Choose Your Plan</Text>

        {plans.map((plan) => {
          const gst = Math.round((plan.price * plan.gstPercent) / 100);
          const total = plan.price + gst;

          return (
            <View key={plan._id} style={[
              styles.planCard,
              plan.name.toLowerCase().includes("gold") && styles.goldCard,
              plan.name.toLowerCase().includes("silver") && styles.silverCard,
            ]}>

              {/* 🔥 BADGE */}
              {plan.name.toLowerCase().includes("gold") && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>MOST POPULAR</Text>
                </View>
              )}

              {/* 🔥 HEADER */}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.duration}>{plan.durationMonths} Months</Text>

              {/* 🔥 PRICE */}
              <View style={styles.priceBox}>
                <Text style={styles.actualPrice}>₹{plan.actualPrice}</Text>
                <Text style={styles.planPrice}>₹{plan.price}</Text>
                <Text style={styles.gstText}>+ GST</Text>
              </View>

              {/* 🔥 FEATURES */}
              <View style={{ marginTop: 10 }}>
                {plan.features?.slice(0, 5).map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Icon name="checkmark-circle" size={18} color="#4CAF50" />
                    <Text style={styles.featureText}>
                      {stripHtml(f)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 🔥 BUTTON */}
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={() => handleBuy(plan)}
              >
                <Text style={styles.buyText}>Upgrade Now 🚀</Text>
              </TouchableOpacity>

            </View>
          );
        })}

        {/* ===== Payment History ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>

          {paymentHistory.length === 0 ? (
            <Text style={styles.noPlan}>No payment record found</Text>
          ) : (
            <FlatList
              data={paymentHistory}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={styles.historyRow}>
                  <Text style={styles.historyIndex}>{index + 1}.</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyPlan}>
                      {item.plan?.name || "-"}
                    </Text>
                    <Text style={styles.historyMeta}>
                      ₹{item.amount} | {item.status.toUpperCase()}
                    </Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  banner: {
    backgroundColor: "#ff4e50",
    paddingVertical: 30,
    alignItems: "center",
  },

  bannerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },

  bannerSub: { fontSize: 14, color: "#ffe3e3", marginTop: 6 },

  section: {
    backgroundColor: "#fff",
    margin: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  currentPlan: { alignItems: "center" },

  noPlan: { textAlign: "center", color: "#888", marginTop: 10 },

  planName: { fontSize: 18, fontWeight: "700", color: "#333" },

  planMeta: { color: "#777", marginTop: 4 },

  planPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff4e50",
    marginTop: 8,
  },

  planCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 12,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
    alignItems: "center",
  },

  featureText: { fontSize: 12, color: "#555", marginTop: 4 },

  buyBtn: {
    backgroundColor: "#ff4e50",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  buyText: { color: "#fff", fontWeight: "600" },

  historyRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  historyIndex: { width: 22, fontWeight: "700" },

  historyPlan: { fontWeight: "600" },

  historyMeta: { color: "#555", fontSize: 12 },

  historyDate: { color: "#999", fontSize: 11 },

  sectionTitle1: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    marginLeft: 18


  },
  actualPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 14,
  },

  duration: {
    backgroundColor: "#ffe5e5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
    color: "#ff4e50",
  },

  gstText: {
    fontSize: 12,
    color: "#777",
  },

  desc: {
    fontSize: 13,
    color: "#444",
    marginBottom: 8,
  },
  planCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 14,
    padding: 20,
    borderRadius: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  goldCard: {
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "#fffaf0",
  },

  silverCard: {
    borderWidth: 1,
    borderColor: "#ccc",
  },

  badge: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "#ff4e50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  priceBox: {
    alignItems: "center",
    marginVertical: 10,
  },

  planPrice: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff4e50",
  },

  actualPrice: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  featureText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#444",
  },

  buyBtn: {
    marginTop: 16,
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    elevation: 2,
  },

  buyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});