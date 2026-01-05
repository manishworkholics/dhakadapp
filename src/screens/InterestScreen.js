import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
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

  /* 🔹 FETCH REQUESTS */
  const fetchRequests = async () => {
    try {
      setLoading(true);
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
          new: receivedRes.data.requests.filter(r => r.status === "pending"),
          accepted: receivedRes.data.requests.filter(r => r.status === "accepted"),
          denied: receivedRes.data.requests.filter(r => r.status === "rejected"),
        });
      }

      if (sentRes.data.success) {
        setSentRequests(sentRes.data.requests);
      }
    } catch (err) {
      console.log("FETCH ERROR", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [mainTab, subTab]);

  /* 🔹 ACCEPT / REJECT */
  const updateRequestStatus = async (id, type) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url =
        type === "accept"
          ? `${API_URL}/accept/${id}`
          : `${API_URL}/reject/${id}`;

      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRequests();
    } catch (err) {
      console.log("UPDATE ERROR", err?.response?.data || err.message);
    }
  };

  /* 🔹 CANCEL SENT */
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

  const currentData =
    mainTab === "received"
      ? receivedRequests[subTab]
      : sentRequests;

  /* 🔹 CARD */
  const renderItem = ({ item }) => {
    const profile = item.profile;
    const age = calculateAge(profile?.dob);

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: profile?.photos?.[0] || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.name}>
              {profile?.name}
              <Text style={styles.age}> {age} yrs</Text>
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileDetail", {
                  id: profile?._id,
                })
              }
            >
              <Text style={styles.viewProfile}>View</Text>
            </TouchableOpacity>
          </View>

          {/* INFO */}
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.infoText}>{profile?.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🛕</Text>
            <Text style={styles.infoText}>{profile?.religion}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>💼</Text>
            <Text style={styles.infoText}>{profile?.occupation}</Text>
          </View>

          {/* STATUS */}
          {item.status !== "pending" && (
            <View
              style={[
                styles.statusBadge,
                item.status === "accepted"
                  ? styles.accepted
                  : styles.denied,
              ]}
            >
              <Text style={styles.statusText}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )}

          {/* ACTIONS */}
          <View style={styles.actionArea}>
            {mainTab === "received" && subTab === "new" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => updateRequestStatus(item._id, "accept")}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateRequestStatus(item._id, "reject")}
                >
                  <Text style={styles.rejectText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}

            {mainTab === "received" && subTab === "denied" && (
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => updateRequestStatus(item._id, "accept")}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
            )}

            {mainTab === "sent" && (
              <TouchableOpacity
                style={styles.rejectBtn}
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
    <View style={{ flex: 1, backgroundColor: "#f5f5f5",paddingBottom:70 }}>
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
      ) : currentData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: "#888" }}>No requests found</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
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
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.subTab, active && styles.subTabActive]}>{title}</Text>
  </TouchableOpacity>
);

/* 🔹 STYLES */
const styles = StyleSheet.create({
  mainTabs: { flexDirection: "row", backgroundColor: "#fff" },
  tabBtn: { flex: 1, padding: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderColor: "#ff4e50" },
  tabText: { color: "#777", fontWeight: "600" },
  tabTextActive: { color: "#ff4e50" },

  subTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  subTab: { color: "#777", fontWeight: "600" },
  subTabActive: { color: "#ff4e50", borderBottomWidth: 2 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    marginBottom: 12,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  age: { fontSize: 13, color: "#777" },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  icon: { fontSize: 13, marginRight: 6 },
  infoText: { fontSize: 13, color: "#666" },

  viewProfile: { color: "#ff4e50", fontWeight: "600" },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  accepted: { backgroundColor: "#e6f7ee" },
  denied: { backgroundColor: "#fdecea" },
  statusText: { fontSize: 11, fontWeight: "600", color: "#555" },

  actionArea: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    paddingTop: 10,
    alignItems: "center",
  },
  actions: { flexDirection: "row" },

  acceptBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 25,
    marginRight: 10,
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 25,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  rejectText: { color: "#ff4e50", fontWeight: "600", fontSize: 13 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
});
