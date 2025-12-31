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
import Footer from '../components/Footer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api/interest/request";

export default function InterestScreen({ navigation }) {
  const [mainTab, setMainTab] = useState("received"); // received | sent
  const [subTab, setSubTab] = useState("new"); // new | accepted | denied

  const [receivedRequests, setReceivedRequests] = useState({
    new: [],
    accepted: [],
    denied: [],
  });

  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔹 FETCH INTEREST REQUESTS */
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      let receivedURL = `${API_URL}/received`;

      if (mainTab === "received") {
        if (subTab === "new") receivedURL += `?status=pending`;
        if (subTab === "accepted") receivedURL += `?status=accepted`;
        if (subTab === "denied") receivedURL += `?status=rejected`;
      }

      const receivedRes = await axios.get(receivedURL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sentRes = await axios.get(`${API_URL}/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (receivedRes.data.success) {
        setReceivedRequests({
          new: receivedRes.data.requests.filter(
            (r) => r.status === "pending"
          ),
          accepted: receivedRes.data.requests.filter(
            (r) => r.status === "accepted"
          ),
          denied: receivedRes.data.requests.filter(
            (r) => r.status === "rejected"
          ),
        });
      }

      if (sentRes.data.success) {
        setSentRequests(sentRes.data.requests);
      }
    } catch (err) {
      console.log(
        "INTEREST FETCH ERROR 👉",
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [mainTab, subTab]);

  /* 🔹 ACCEPT / REJECT */
  const updateRequestStatus = async (requestId, actionType) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url =
        actionType === "accept"
          ? `${API_URL}/accept/${requestId}`
          : `${API_URL}/reject/${requestId}`;

      const res = await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        fetchRequests();
      }
    } catch (err) {
      console.log("UPDATE ERROR 👉", err?.response?.data || err.message);
    }
  };

  let currentData = [];
  if (mainTab === "received") {
    currentData = receivedRequests[subTab];
  } else {
    currentData = sentRequests;
  }

  /* 🔹 RENDER ITEM */
  const renderItem = ({ item }) => {
    const profile = item.profile;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: profile?.photos?.[0] }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.details}>
            {profile?.location} • {profile?.age || "-"} yrs
          </Text>

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
        </View>

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
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header title="Interests" />

      {/* MAIN TABS */}
      <View style={styles.mainTabs}>
        <TabButton
          title="Received"
          active={mainTab === "received"}
          onPress={() => setMainTab("received")}
        />
        <TabButton
          title="Sent"
          active={mainTab === "sent"}
          onPress={() => setMainTab("sent")}
        />
      </View>

      {/* SUB TABS */}
      {mainTab === "received" && (
        <View style={styles.subTabs}>
          <SubTab
            title="New"
            active={subTab === "new"}
            onPress={() => setSubTab("new")}
          />
          <SubTab
            title="Accepted"
            active={subTab === "accepted"}
            onPress={() => setSubTab("accepted")}
          />
          <SubTab
            title="Denied"
            active={subTab === "denied"}
            onPress={() => setSubTab("denied")}
          />
        </View>
      )}

      {/* LIST */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : currentData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: "#888" }}>No requests found</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
      
    </View>
  );
}

/* 🔹 REUSABLE COMPONENTS */

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabBtn, active && styles.tabActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const SubTab = ({ title, active, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.subTab, active && styles.subTabActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

/* 🔹 STYLES */

const styles = StyleSheet.create({
  mainTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tabBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: "#ff4e50",
  },
  tabText: {
    fontWeight: "600",
    color: "#777",
  },
  tabTextActive: {
    color: "#ff4e50",
  },

  subTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  subTab: {
    color: "#777",
    fontWeight: "600",
  },
  subTabActive: {
    color: "#ff4e50",
    borderBottomWidth: 2,
    borderColor: "#ff4e50",
  },

  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  details: {
    color: "#777",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 6,
  },
  acceptBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: "#dc3545",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  rejectText: {
    color: "#dc3545",
    fontWeight: "600",
  },
  viewProfile: {
    color: "#ff4e50",
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
