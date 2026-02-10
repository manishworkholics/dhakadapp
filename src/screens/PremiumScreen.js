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
            <View key={plan._id} style={styles.planCard}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planMeta}>{plan.durationMonths} Months</Text>
              <Text style={styles.planPrice}>₹{total}</Text>

              {plan.features?.map((f, i) => (
                <Text key={i} style={styles.featureText}>
                  ✔ {f}
                </Text>
              ))}

              <TouchableOpacity
                style={styles.buyBtn}
                disabled={paying}
                onPress={() => handleBuy(plan)}
              >
                <Text style={styles.buyText}>
                  {paying ? "Processing..." : "Choose Plan"}
                </Text>
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

  sectionTitle1:{
     fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    marginLeft:18
    

  }
});