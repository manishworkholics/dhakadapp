import React, { useCallback, useState } from "react";
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
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = "http://143.110.244.163:5000/api";

const stripHtml = (html = "") => {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
};

const formatPrice = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

export default function PlanScreen() {
  const [myPlan, setMyPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingPlanId, setPayingPlanId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [couponInputs, setCouponInputs] = useState({});
  const [couponLoading, setCouponLoading] = useState({});
  const [couponResults, setCouponResults] = useState({});

  const fetchMyPlan = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/plan/my-plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMyPlan(res.data.userPlan);
      } else {
        setMyPlan(null);
      }
    } catch {
      setMyPlan(null);
    }
  };

  const fetchAllPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/plan`);
      if (res.data.success) {
        setPlans(res.data.plans || []);
      }
    } catch (e) {
      console.log("PLAN FETCH ERROR", e.message);
    }
  };

  const fetchPaymentHistory = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/plan/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPaymentHistory(res.data.history || []);
      }
    } catch (e) {
      console.log("HISTORY ERROR", e.message);
    }
  };

  const loadAll = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await Promise.all([
        fetchMyPlan(token),
        fetchAllPlans(),
        fetchPaymentHistory(token),
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadAll();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAll();
  };

  const clearCouponForPlan = (planId) => {
    setCouponResults((prev) => {
      const next = { ...prev };
      delete next[planId];
      return next;
    });
  };

  const handleCouponInput = (planId, text) => {
    setCouponInputs((prev) => ({
      ...prev,
      [planId]: text.toUpperCase(),
    }));

    const appliedCoupon = couponResults[planId]?.couponCode;
    if (appliedCoupon && appliedCoupon !== text.trim().toUpperCase()) {
      clearCouponForPlan(planId);
    }
  };

  const handleApplyCoupon = async (planId) => {
    const couponCode = couponInputs[planId]?.trim().toUpperCase();

    if (!couponCode) {
      alert("Please enter a coupon code");
      return;
    }

    try {
      setCouponLoading((prev) => ({ ...prev, [planId]: true }));
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/plan/apply-coupon`,
        {
          planId,
          couponCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setCouponResults((prev) => ({
          ...prev,
          [planId]: {
            couponCode,
            originalPrice: res.data.originalPrice,
            discount: res.data.discount,
            finalPrice: res.data.finalPrice,
          },
        }));
        alert("Coupon applied successfully");
      } else {
        clearCouponForPlan(planId);
        alert(res.data.message || "Unable to apply coupon");
      }
    } catch (err) {
      clearCouponForPlan(planId);
      alert(err?.response?.data?.message || "Failed to apply coupon");
    } finally {
      setCouponLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  const handleBuy = async (plan) => {
    try {
      setPayingPlanId(plan._id);
      const token = await AsyncStorage.getItem("token");
      const appliedCoupon = couponResults[plan._id];
      const payload = { planId: plan._id };

      if (appliedCoupon?.couponCode) {
        payload.couponCode = appliedCoupon.couponCode;
      }

      const orderRes = await axios.post(
        `${API_URL}/plan/create-order`,
        payload,
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
            alert("Payment successful and plan activated!");
            clearCouponForPlan(plan._id);
            setCouponInputs((prev) => ({
              ...prev,
              [plan._id]: "",
            }));
            loadAll();
          } else {
            alert("Payment verification failed");
          }
        })
        .catch(() => alert("Payment cancelled"))
        .finally(() => setPayingPlanId(null));
    } catch (err) {
      console.log("PAYMENT ERROR", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Payment failed");
      setPayingPlanId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  const activePlan = myPlan && myPlan.plan ? myPlan.plan : null;
  const currentPrice = activePlan?.offerPrice || activePlan?.price || 0;

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
        <View style={styles.banner}>
          <Icon name="diamond" size={45} color="#fff" />
          <Text style={styles.bannerTitle}>Upgrade to Premium</Text>
          <Text style={styles.bannerSub}>
            Find your perfect life partner faster
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Current Plan</Text>

          {activePlan ? (
            <View style={styles.currentPlan}>
              <Text style={styles.planName}>{activePlan.name}</Text>
              <Text style={styles.planMeta}>
                Valid till: {new Date(myPlan.endDate).toDateString()}
              </Text>
              <Text style={styles.planPrice}>{formatPrice(currentPrice)}</Text>
            </View>
          ) : (
            <Text style={styles.noPlan}>No active plan</Text>
          )}
        </View>

        <Text style={styles.sectionTitle1}>Choose Your Plan</Text>

        {plans.map((plan) => {
          const basePrice = plan.offerPrice || plan.price;
          const appliedCoupon = couponResults[plan._id];
          const discountedPrice = appliedCoupon?.finalPrice ?? basePrice;
          const gstPercent = Number(plan.gstPercent || 0);
          const gst = Math.round((discountedPrice * gstPercent) / 100);
          const total = discountedPrice + gst;
          const isPaying = payingPlanId === plan._id;

          return (
            <View
              key={plan._id}
              style={[
                styles.planCard,
                plan.name?.toLowerCase().includes("gold") && styles.goldCard,
                plan.name?.toLowerCase().includes("silver") && styles.silverCard,
              ]}
            >
              {plan.name?.toLowerCase().includes("gold") && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>MOST POPULAR</Text>
                </View>
              )}

              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.duration}>{plan.durationMonths} Months</Text>

              <View style={styles.priceBox}>
                {plan.actualPrice && plan.actualPrice > basePrice ? (
                  <Text style={styles.actualPrice}>
                    {formatPrice(plan.actualPrice)}
                  </Text>
                ) : null}

                <Text style={styles.planPrice}>{formatPrice(discountedPrice)}</Text>
                <Text style={styles.gstText}>
                  GST: {formatPrice(gst)} | Total: {formatPrice(total)}
                </Text>
              </View>

              <View style={styles.couponRow}>
                <TextInput
                  style={styles.couponInput}
                  value={couponInputs[plan._id] || ""}
                  onChangeText={(text) => handleCouponInput(plan._id, text)}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[
                    styles.couponBtn,
                    couponLoading[plan._id] && styles.disabledBtn,
                  ]}
                  onPress={() => handleApplyCoupon(plan._id)}
                  disabled={couponLoading[plan._id]}
                >
                  <Text style={styles.couponBtnText}>
                    {couponLoading[plan._id] ? "Applying..." : "Apply"}
                  </Text>
                </TouchableOpacity>
              </View>

              {appliedCoupon ? (
                <View style={styles.couponSummary}>
                  <Text style={styles.couponCodeText}>
                    Coupon: {appliedCoupon.couponCode}
                  </Text>
                  <Text style={styles.couponSummaryText}>
                    Original: {formatPrice(appliedCoupon.originalPrice)}
                  </Text>
                  <Text style={styles.couponSummaryText}>
                    Discount: {formatPrice(appliedCoupon.discount)}
                  </Text>
                  <Text style={styles.couponFinalText}>
                    Final: {formatPrice(appliedCoupon.finalPrice)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.featureList}>
                {plan.features?.slice(0, 5).map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Icon name="checkmark-circle" size={18} color="#4CAF50" />
                    <Text style={styles.featureText}>{stripHtml(feature)}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.buyBtn, isPaying && styles.disabledBtn]}
                onPress={() => handleBuy(plan)}
                disabled={isPaying}
              >
                <Text style={styles.buyText}>
                  {isPaying ? "Processing..." : `Upgrade Now - ${formatPrice(total)}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

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
                  <View style={styles.historyContent}>
                    <Text style={styles.historyPlan}>{item.plan?.name || "-"}</Text>
                    <Text style={styles.historyMeta}>
                      {formatPrice(item.amount)} | {item.status?.toUpperCase()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
    color: "#333",
  },

  sectionTitle1: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    marginLeft: 18,
  },

  currentPlan: {
    alignItems: "center",
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

  duration: {
    alignSelf: "flex-start",
    backgroundColor: "#ffe5e5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
    color: "#ff4e50",
    marginTop: 6,
  },

  priceBox: {
    alignItems: "flex-start",
    marginVertical: 10,
  },

  actualPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 14,
  },

  planPrice: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff4e50",
    marginTop: 6,
  },

  gstText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  couponInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    color: "#222",
  },

  couponBtn: {
    marginLeft: 8,
    backgroundColor: "#222",
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  couponBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  couponSummary: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff4f4",
    borderWidth: 1,
    borderColor: "#ffd1d1",
  },

  couponCodeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },

  couponSummaryText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },

  couponFinalText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff4e50",
  },

  featureList: {
    marginTop: 12,
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
    flex: 1,
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

  disabledBtn: {
    opacity: 0.7,
  },

  historyRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  historyIndex: {
    width: 22,
    fontWeight: "700",
  },

  historyContent: {
    flex: 1,
  },

  historyPlan: {
    fontWeight: "600",
  },

  historyMeta: {
    color: "#555",
    fontSize: 12,
  },

  historyDate: {
    color: "#999",
    fontSize: 11,
  },
});
