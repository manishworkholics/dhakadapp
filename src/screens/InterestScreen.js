import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "react-native-vector-icons/Ionicons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api/interest/request";

/* 🔹 AGE CALCULATOR */
const calculateAge = (dob) => {
  if (!dob) return "-";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export default function InterestScreen({ navigation }) {
  const [mainTab, setMainTab] = useState("received");
  const [subTab, setSubTab] = useState("new");

  const [receivedRequests, setReceivedRequests] = useState({
    new: [],
    accepted: [],
    denied: [],
  });

  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  /* 🔹 FETCH REQUESTS (API SAME) */
  const fetchRequests = async () => {
    try {
      if (!refreshing) setLoading(true);

      const token = await AsyncStorage.getItem("token");

      let receivedURL = `${API_URL}/received`;
      if (subTab === "new") receivedURL += "?status=pending";
      if (subTab === "accepted") receivedURL += "?status=accepted";
      if (subTab === "denied") receivedURL += "?status=rejected";

      const receivedRes = await axios.get(receivedURL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sentRes = await axios.get(`${API_URL}/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (receivedRes.data.success) {
        setReceivedRequests({
          new: receivedRes.data.requests.filter((r) => r.status === "pending"),
          accepted: receivedRes.data.requests.filter((r) => r.status === "accepted"),
          denied: receivedRes.data.requests.filter((r) => r.status === "rejected"),
        });
      }

      if (sentRes.data.success) {
        setSentRequests(sentRes.data.requests);
      }
    } catch (err) {
      console.log("FETCH ERROR", err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [mainTab, subTab]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [mainTab, subTab]);

  /* 🔹 ACCEPT / REJECT (API SAME) */
  const updateRequestStatus = async (id, type) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url =
        type === "accept" ? `${API_URL}/accept/${id}` : `${API_URL}/reject/${id}`;

      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchRequests();
    } catch (err) {
      console.log("UPDATE ERROR", err?.response?.data || err.message);
    }
  };

  /* 🔹 CANCEL SENT (API SAME) */
  const cancelSentRequest = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_URL}/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.log("CANCEL ERROR", err?.response?.data || err.message);
    }
  };

  const currentData = mainTab === "received" ? receivedRequests[subTab] : sentRequests;

  /* ✅ PRO CARD UI */
  const renderItem = ({ item }) => {
    const profile = item.profile;
    const age = calculateAge(profile?.dob);

    const statusLabel =
      item.status === "accepted" ? "ACCEPTED" : item.status === "rejected" ? "DENIED" : null;

    return (
      <View style={styles.card}>
        {/* LEFT IMAGE */}
        <Image
          source={{ uri: profile?.photos?.[0] || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />

        {/* RIGHT CONTENT */}
        <View style={styles.content}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {profile?.name} <Text style={styles.age}>{age} yrs</Text>
              </Text>

              <View style={styles.subLineRow}>
                <Icon name="location-outline" size={14} color="#FF4500" />
                <Text style={styles.subLineText} numberOfLines={1}>
                  {profile?.location || "N/A"}
                </Text>
              </View>

            </View>

            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => navigation.navigate("ProfileDetail", { id: profile?._id })}
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>

          {/* Second line */}
          <View style={styles.subLineRow}>
            <View style={styles.subItem}>
              <Icon name="home-outline" size={14} color="#FF4500" />
              <Text style={styles.subLineText} numberOfLines={1}>
                {profile?.religion || "N/A"}
              </Text>
            </View>

            <Text style={styles.dot}>•</Text>

            <View style={styles.subItem}>
              <Icon name="briefcase-outline" size={14} color="#FF4500" />
              <Text style={styles.subLineText} numberOfLines={1}>
                {profile?.occupation || "N/A"}
              </Text>
            </View>
          </View>


          {/* Status Badge */}
          {statusLabel && (
            <View
              style={[
                styles.statusBadge,
                item.status === "accepted" ? styles.statusAccepted : styles.statusDenied,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.status === "accepted" ? styles.statusTextAccepted : styles.statusTextDenied,
                ]}
              >
                {statusLabel}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionArea}>
            {mainTab === "received" && subTab === "new" && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
                  onPress={() => updateRequestStatus(item._id, "accept")}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => updateRequestStatus(item._id, "reject")}
                >
                  <Text style={styles.rejectText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}

            {mainTab === "received" && subTab === "denied" && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn, { alignSelf: "flex-start" }]}
                onPress={() => updateRequestStatus(item._id, "accept")}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            )}

            {mainTab === "sent" && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtn, { alignSelf: "flex-start" }]}
                onPress={() => cancelSentRequest(item._id)}
              >
                <Text style={styles.rejectText}>Cancel Request</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 70 }}>
      <Header title="Interests" />

      {/* MAIN TABS */}
      <View style={styles.mainTabs}>
        <TabButton title="Received" active={mainTab === "received"} onPress={() => setMainTab("received")} />
        <TabButton title="Sent" active={mainTab === "sent"} onPress={() => setMainTab("sent")} />
      </View>

      {/* SUB TABS */}
      {mainTab === "received" && (
        <View style={styles.subTabs}>
          <SubTab title="New" active={subTab === "new"} onPress={() => setSubTab("new")} />
          <SubTab title="Accepted" active={subTab === "accepted"} onPress={() => setSubTab("accepted")} />
          <SubTab title="Denied" active={subTab === "denied"} onPress={() => setSubTab("denied")} />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 12,
            flexGrow: currentData.length === 0 ? 1 : 0,
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: "#888" }}>No requests found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff4e50"]}
              title="Refreshing..."
              titleColor="#ff4e50"
            />
          }
        />
      )}

      <Footer />
    </View>
  );
}

/* 🔹 TABS */
const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity style={[styles.tabBtn, active && styles.tabActive]} onPress={onPress}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const SubTab = ({ title, active, onPress }) => (
  <TouchableOpacity style={styles.subTabBtn} onPress={onPress}>
    <Text style={[styles.subTab, active && styles.subTabActive]}>{title}</Text>
    {active ? <View style={styles.subUnderline} /> : null}
  </TouchableOpacity>
);

/* ✅ PRO STYLES */
const styles = StyleSheet.create({
  mainTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderColor: "#ff4e50" },
  tabText: { color: "#777", fontWeight: "700" },
  tabTextActive: { color: "#ff4e50" },

  subTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subTabBtn: { alignItems: "center", paddingHorizontal: 6 },
  subTab: { color: "#777", fontWeight: "700" },
  subTabActive: { color: "#ff4e50" },
  subUnderline: {
    height: 2,
    width: 26,
    backgroundColor: "#ff4e50",
    borderRadius: 2,
    marginTop: 6,
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 2,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  content: { flex: 1 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  name: { fontSize: 16, fontWeight: "800", color: "#222" },
  age: { fontSize: 13, color: "#777", fontWeight: "700" },

  subLine: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },

  viewBtn: {
    backgroundColor: "#ff4e50",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  viewText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  statusAccepted: { backgroundColor: "#e9f7ef", borderWidth: 1, borderColor: "#28a745" },
  statusDenied: { backgroundColor: "#fdecea", borderWidth: 1, borderColor: "#dc3545" },

  statusText: { fontSize: 11, fontWeight: "900" },
  statusTextAccepted: { color: "#28a745" },
  statusTextDenied: { color: "#dc3545" },

  actionArea: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
  },

  actionsRow: { flexDirection: "row", gap: 10 },

  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
  },

  acceptBtn: { backgroundColor: "#28a745" },
  acceptText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  rejectBtn: { borderWidth: 1, borderColor: "#ff4e50", backgroundColor: "#fff" },
  rejectText: { color: "#ff4e50", fontWeight: "800", fontSize: 13 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  subLineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flexWrap: "nowrap",
  },

  subItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "45%",
  },

  subLineText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  dot: {
    marginHorizontal: 10,
    color: "#bbb",
    fontWeight: "900",
  },

  subLineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  subLineText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

});
