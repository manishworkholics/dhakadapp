// src/screens/PlanScreen.js
import React, { useEffect, useState } from "react";
import RazorpayCheckout from "react-native-razorpay";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
const API_URL = "http://143.110.244.163:5000/api";

export default function PlanScreen() {
    const navigation = useNavigation();
  const [myPlan, setMyPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch current plan */
  const fetchMyPlan = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/plan/my-plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setMyPlan(res.data.userPlan);
    } catch {
      setMyPlan(null);
    }
  };

  /* 🔹 Fetch all plans */
  const fetchAllPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/plan`);
      if (res.data.success) setPlans(res.data.plans);
    } catch (e) {
      console.log("PLAN FETCH ERROR", e.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("token");
      await Promise.all([fetchMyPlan(token), fetchAllPlans()]);
      setLoading(false);
    };
    init();
  }, []);

  /* 🔹 BUY HANDLER (Razorpay later) */
  const handleBuyss = (planId) => {
    // 🔴 Here you will integrate Razorpay native later
    console.log("BUY PLAN 👉", planId);
  };

  const handleBuy = async (plan) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // 1️⃣ Create Order from Backend
      const orderRes = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          planId: plan._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId, amount, currency } = orderRes.data;

      // 2️⃣ Razorpay Options
      const options = {
        description: `${plan.name} Plan`,
        image: "https://yourdomain.com/logo.png",
        currency,
        key: "rzp_live_RyxgRHl1EcCorc", // TEST KEY
        amount: amount, // in paise
        name: "Dhakad Matrimony",
        order_id: orderId,
        prefill: {
          email: "user@email.com",
          contact: "9999999999",
        },
        theme: { color: "#ff4e50" },
      };

      // 3️⃣ Open Razorpay
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // 4️⃣ Verify Payment
          const verifyRes = await axios.post(
            `${API_URL}/payment/verify`,
            {
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (verifyRes.data.success) {
            alert("Payment Successful 🎉");
            fetchMyPlan(token); // refresh active plan
          }
        })
        .catch(() => {
          alert("Payment cancelled");
        });
    } catch (err) {
      console.log("PAYMENT ERROR 👉", err?.response?.data || err.message);
      alert("Payment failed");
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
      <Header  title="Premium Membership" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 TOP BANNER */}
        <View style={styles.banner}>
          <Icon name="diamond" size={42} color="#fff" />
          <Text style={styles.bannerTitle}>Upgrade to Premium</Text>
          <Text style={styles.bannerSub}>
            Find your perfect life partner faster
          </Text>
        </View>

        {/* 🔹 CURRENT PLAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Current Plan</Text>

          {myPlan ? (
            <View style={styles.currentPlan}>
              <Text style={styles.planName}>{myPlan.plan?.name}</Text>
              <Text style={styles.planMeta}>
                Validity: {myPlan.plan?.durationMonths} Months
              </Text>
              <Text style={styles.planPrice}>
                ₹
                {myPlan.plan?.price +
                  (myPlan.plan?.price * myPlan.plan?.gstPercent) / 100}
              </Text>
            </View>
          ) : (
            <Text style={styles.noPlan}>No active plan</Text>
          )}
        </View>

        {/* 🔹 BENEFITS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>

          {[
            "Unlimited Chat with Matches",
            "View Contact Details",
            "Profile Boost for More Visibility",
            "Priority Customer Support",
          ].map((b, i) => (
            <View key={i} style={styles.benefitItem}>
              <Icon
                name="checkmark-circle"
                size={22}
                color="#ff4e50"
              />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* 🔹 ALL PLANS */}
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

        {plans.map((plan) => {
          const gst = (plan.price * plan.gstPercent) / 100;
          const total = plan.price + gst;

          return (
            <View key={plan._id} style={styles.planCard}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planMeta}>
                {plan.durationMonths} Months
              </Text>
              <Text style={styles.planPrice}>₹{total}</Text>

              <TouchableOpacity
                style={styles.buyBtn}
                // onPress={() => handleBuy(plan._id)}
                onPress={() => handleBuy(plan)}

              >
                <Text style={styles.buyText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

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
  bannerSub: {
    fontSize: 14,
    color: "#ffe3e3",
    marginTop: 6,
  },

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
    marginHorizontal: 14,
    marginTop: 14,
    color: "#333",
  },

  currentPlan: {
    alignItems: "center",
    paddingVertical: 10,
  },

  noPlan: {
    textAlign: "center",
    color: "#888",
    marginTop: 10,
  },

  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  planMeta: {
    color: "#777",
    marginTop: 4,
  },

  planPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff4e50",
    marginTop: 8,
  },

  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  benefitText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
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

  buyBtn: {
    backgroundColor: "#ff4e50",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  buyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
