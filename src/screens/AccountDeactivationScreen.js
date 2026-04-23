import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Footer from "../components/Footer";
import AppModal from "../components/AppModal";

const API_URL = "http://143.110.244.163:5000/api";

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default function AccountDeactivationScreen() {
  const navigation = useNavigation();
  const [reason, setReason] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const fetchStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/user/deactivate-request`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStatusData(res.data.data || null);
        if (res.data.data?.reason) {
          setReason(res.data.data.reason);
        }
      } else {
        setStatusData(null);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setStatusData(null);
        return;
      }
      console.log("DEACTIVATION STATUS ERROR", err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStatus();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatus();
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      showModal("Please enter a reason for account deactivation", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/user/deactivate-request`,
        { reason: reason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        showModal(
          res.data.message || "Deactivation request submitted successfully",
          "success"
        );
        fetchStatus();
      } else {
        showModal(res.data.message || "Unable to submit deactivation request", "error");
      }
    } catch (err) {
      showModal(
        err?.response?.data?.message || "Failed to submit deactivation request",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#B22222" />
        </View>
      </SafeAreaView>
    );
  }

  const hasActiveRequest = !!statusData;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F1EE" />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.85}
          >
            <Icon name="arrow-back" size={24} color="#1E1E1E" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Account Deactivation</Text>

          <View style={styles.rightSpace} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#B22222"]}
              tintColor="#B22222"
            />
          }
          contentContainerStyle={styles.content}
        >
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Icon name="pause-circle" size={34} color="#B22222" />
            </View>
            <Text style={styles.heroTitle}>Need a break from your account?</Text>
            <Text style={styles.heroText}>
              Send a deactivation request and our team will review it. You can
              also check your latest request status here anytime.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Submit Deactivation Request</Text>
            <Text style={styles.cardText}>
              Tell us why you want to deactivate your account.
            </Text>

            <TextInput
              style={styles.reasonInput}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="I want to stop using this account for now"
              placeholderTextColor="#8B8B8B"
              value={reason}
              onChangeText={setReason}
            />

            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.cardTitle}>Current Request Status</Text>

            {hasActiveRequest ? (
              <>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {String(statusData.status || "pending").toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.statusLabel}>Reason</Text>
                <Text style={styles.statusValue}>{statusData.reason || "-"}</Text>

                <Text style={styles.statusLabel}>Requested At</Text>
                <Text style={styles.statusValue}>
                  {formatDate(statusData.requestedAt || statusData.createdAt)}
                </Text>

                <Text style={styles.statusLabel}>Last Updated</Text>
                <Text style={styles.statusValue}>
                  {formatDate(statusData.updatedAt)}
                </Text>
              </>
            ) : (
              <Text style={styles.emptyText}>
                No deactivation request found yet.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      <Footer />

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F1EE",
  },

  container: {
    flex: 1,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F1EE",
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7DED8",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  rightSpace: {
    width: 36,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  hero: {
    marginTop: 14,
    backgroundColor: "#FFF6F4",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0D7D0",
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFE5E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#6E1F12",
    marginBottom: 8,
  },

  heroText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#5C5C5C",
  },

  card: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ECE1DA",
  },

  statusCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ECE1DA",
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#221713",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 14,
  },

  reasonInput: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: "#DCCEC6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FCFBFA",
  },

  submitBtn: {
    marginTop: 16,
    backgroundColor: "#B22222",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  disabledBtn: {
    opacity: 0.7,
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0D6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 14,
  },

  statusBadgeText: {
    color: "#8A5200",
    fontWeight: "800",
    fontSize: 12,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8A817C",
    marginTop: 10,
    textTransform: "uppercase",
  },

  statusValue: {
    fontSize: 15,
    lineHeight: 22,
    color: "#222222",
    marginTop: 4,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
  },
});
