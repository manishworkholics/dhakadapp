// src/screens/MatchesScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

const feedData = [
  { id: "u1", type: "upgrade" },

  {
    id: "p1",
    type: "profile",
    name: "Ankita Kaur",
    age: 26,
    height: "5'4\"",
    city: "Indore",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    verified: true,
  },

  { id: "info1", type: "completeProfile" },

  {
    id: "p2",
    type: "profile",
    name: "Riya Sharma",
    age: 24,
    height: "5'5\"",
    city: "Bhopal",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    verified: true,
  },

  { id: "banner1", type: "banner" },

  {
    id: "p3",
    type: "profile",
    name: "Neha Patel",
    age: 27,
    height: "5'6\"",
    city: "Ahmedabad",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
  },
];

export default function MatchesScreen() {
  const renderItem = ({ item }) => {
    if (item.type === "upgrade") {
      return (
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeSub}>
            Connect & chat with matches instantly
          </Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === "completeProfile") {
      return (
        <View style={styles.completeCard}>
          <Text style={styles.completeTitle}>Complete your profile</Text>
          <Text style={styles.completeSub}>
            Get better & more matches by completing your profile
          </Text>
          <TouchableOpacity style={styles.completeBtn}>
            <Text style={styles.completeBtnText}>Complete Now</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === "banner") {
      return (
        <View style={styles.bannerCard}>
          <Text style={styles.bannerText}>
            Find your perfect match faster 🚀
          </Text>
        </View>
      );
    }

    // 🔹 PROFILE CARD
    return (
      <View style={styles.profileCard}>
        <Image source={{ uri: item.image }} style={styles.image} />

        {item.verified && (
          <View style={styles.verified}>
            <Text style={styles.verifiedText}>✔</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>
            {item.age} yrs • {item.height} • {item.city}
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
  };

  return (
    <View style={styles.container}>
      <Header title="Matches" />

      <FlatList
        data={feedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
