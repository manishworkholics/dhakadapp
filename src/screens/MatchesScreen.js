import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://143.110.244.163:5000/api";

export default function MatchesScreen() {
  const navigation = useNavigation();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [interestSent, setInterestSent] = useState({});
  const [chatInterestSent, setChatInterestSent] = useState({});
  const [shortlisted, setShortlisted] = useState({});

  /* ================= FETCH MATCHES ================= */
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/featured?limit=10`);
      if (res.data?.profiles) setProfiles(res.data.profiles);
    } catch (err) {
      console.log("MATCHES ERROR", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  /* ================= AGE ================= */
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  /* ================= SEND INTEREST ================= */
  const sendInterest = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/interest/request/send`,
        { receiverId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setInterestSent((p) => ({ ...p, [userId]: true }));
      }
    } catch (err) {
      console.log("INTEREST ERROR", err.message);
    }
  };

  /* ================= CHAT INTEREST ================= */
  const sendChatInterest = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/chat/now`,
        { receiverId: profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setChatInterestSent((p) => ({ ...p, [profileId]: true }));
      }
    } catch (err) {
      console.log("CHAT ERROR", err.message);
    }
  };

  /* ================= SHORTLIST ================= */
  const toggleShortlist = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (shortlisted[profileId]) {
        await axios.delete(`${API_URL}/shortlist/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShortlisted((p) => ({ ...p, [profileId]: false }));
      } else {
        await axios.post(
          `${API_URL}/shortlist/${profileId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShortlisted((p) => ({ ...p, [profileId]: true }));
      }
    } catch (err) {
      console.log("SHORTLIST ERROR", err.message);
    }
  };

  /* ================= LIST HEADER ================= */
  const ListHeader = () => (
    <>
      <View style={styles.upgradeCard}>
        <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
        <Text style={styles.upgradeSub}>
          Connect & chat with matches instantly
        </Text>
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => navigation.navigate("Plan")}
        >
          <Text style={styles.upgradeText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("ProfileDetail", { id: item._id })
      }
    >
      <View style={styles.profileCard}>
        {/* IMAGE */}
        <Image
          source={{ uri: item.photos?.[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* SHORTLIST */}
        <TouchableOpacity
          style={[
            styles.shortlist,
            shortlisted[item._id] && styles.shortlistActive,
          ]}
          onPress={() => toggleShortlist(item._id)}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {shortlisted[item._id] ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>

        {/* INFO */}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>
            {calculateAge(item.dob)} yrs • {item.height} • {item.location}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.chatBtn,
                chatInterestSent[item._id] && styles.disabled,
              ]}
              onPress={() => sendChatInterest(item._id)}
              disabled={chatInterestSent[item._id]}
            >
              <Text style={styles.chatText}>
                {chatInterestSent[item._id]
                  ? "Interest Sent ✓"
                  : "Chat"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.connectBtn,
                interestSent[item.userId] && styles.disabled,
              ]}
              onPress={() => sendInterest(item.userId)}
              disabled={interestSent[item.userId]}
            >
              <Text style={styles.connectText}>
                {interestSent[item.userId]
                  ? "Interest Sent ✓"
                  : "Connect"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Matches" />

      <FlatList
        data={profiles}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* CARD */
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 12,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 320,
  },

  shortlist: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  shortlistActive: {
    backgroundColor: "#ff4e50",
  },

  info: {
    padding: 16,
  },

  name: { fontSize: 18, fontWeight: "700" },

  details: { color: "#777", marginVertical: 6 },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  connectBtn: {
    flex: 1,
    backgroundColor: "#ff4e50",
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
    marginLeft: 6,
  },

  connectText: { color: "#fff", fontWeight: "700" },

  chatBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
    marginRight: 6,
  },

  chatText: { color: "#ff4e50", fontWeight: "700" },

  disabled: { opacity: 0.6 },

  /* UPGRADE */
  upgradeCard: {
    backgroundColor: "#111",
    margin: 12,
    borderRadius: 18,
    padding: 18,
  },

  upgradeTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  upgradeSub: { color: "#ccc", marginVertical: 6 },

  upgradeBtn: {
    backgroundColor: "#ff9800",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
  },

  upgradeText: { color: "#fff", fontWeight: "700" },
});
