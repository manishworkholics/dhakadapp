// src/screens/MatchesScreen.js
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

const API_URL = "http://143.110.244.163:5000/api";

export default function MatchesScreen() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FETCH MATCHES */
  const fetchMatches = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/featured?limit=10`);

      console.log("MATCHES RESPONSE 👉", res.data);

      if (res.data?.profiles) {
        setProfiles(res.data.profiles);
      }
    } catch (err) {
      console.log(
        "MATCHES ERROR 👉",
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  /* 🔹 AGE CALCULATION */
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  /* 🔹 HEADER COMPONENT (STATIC CTA ONLY) */
  const ListHeader = () => (
    <>
      {/* Upgrade Card */}
      <View style={styles.upgradeCard}>
        <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
        <Text style={styles.upgradeSub}>
          Connect & chat with matches instantly
        </Text>
        <TouchableOpacity style={styles.upgradeBtn}>
          <Text style={styles.upgradeText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>

      {/* Complete Profile Card */}
      <View style={styles.completeCard}>
        <Text style={styles.completeTitle}>Complete your profile</Text>
        <Text style={styles.completeSub}>
          Get better & more matches by completing your profile
        </Text>
        <TouchableOpacity style={styles.completeBtn}>
          <Text style={styles.completeBtnText}>Complete Now</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerCard}>
        <Text style={styles.bannerText}>
          Find your perfect match faster 🚀
        </Text>
      </View>
    </>
  );

  /* 🔹 PROFILE CARD */
  const renderItem = ({ item }) => (
    <View style={styles.profileCard}>
      <Image
        source={{ uri: item.photos?.[0] }}
        style={styles.image}
      />

      <View style={styles.verified}>
        <Text style={styles.verifiedText}>✔</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {calculateAge(item.dob)} yrs • {item.height} •{" "}
          {item.location}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.connectBtn}>
            <Text style={styles.connectText}>Connect</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* 🔹 LOADER */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <Footer />
    </View>
  );
}




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  /* Profile Card */
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 12,
    overflow: "hidden",
    elevation: 3,
  },

  image: { width: "100%", height: 300 },

  verified: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#2ecc71",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  verifiedText: { color: "#fff", fontWeight: "bold" },

  info: { padding: 14 },

  name: { fontSize: 17, fontWeight: "700" },

  details: { color: "#777", marginVertical: 6 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  connectBtn: {
    backgroundColor: "#ff4e50",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 22,
  },

  connectText: { color: "#fff", fontWeight: "600" },

  chatBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 22,
  },

  chatText: { color: "#ff4e50", fontWeight: "600" },

  /* Upgrade Card */
  upgradeCard: {
    backgroundColor: "#333",
    margin: 12,
    borderRadius: 16,
    padding: 16,
  },

  upgradeTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  upgradeSub: { color: "#ccc", marginVertical: 6 },

  upgradeBtn: {
    backgroundColor: "#ff9800",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },

  upgradeText: { color: "#fff", fontWeight: "700" },

  /* Complete Profile */
  completeCard: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  completeTitle: { fontSize: 16, fontWeight: "700" },

  completeSub: { color: "#666", marginVertical: 6 },

  completeBtn: {
    backgroundColor: "#ff4e50",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },

  completeBtnText: { color: "#fff", fontWeight: "600" },

  /* Banner */
  bannerCard: {
    backgroundColor: "#ff9800",
    margin: 12,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  bannerText: { color: "#fff", fontWeight: "700" },
});
