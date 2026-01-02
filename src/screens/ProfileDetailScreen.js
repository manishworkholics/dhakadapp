import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "../components/Header";

const API_URL = "http://143.110.244.163:5000/api";

export default function ProfileDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [interestSent, setInterestSent] = useState(false);
  const [chatInterestSent, setChatInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        const currentUser = user ? JSON.parse(user) : null;

        const res = await axios.get(`${API_URL}/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data.profile);

        if (currentUser && res.data.profile._id !== currentUser._id) {
          await axios.post(
            `${API_URL}/viewed/view/${res.data.profile._id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        checkShortlist(res.data.profile._id);
      } catch (err) {
        console.log("PROFILE ERROR", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  /* ================= SHORTLIST ================= */
  const checkShortlist = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setIsShortlisted(
          res.data.shortlist.some((i) => i.profile._id === profileId)
        );
      }
    } catch { }
  };

  const toggleShortlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (isShortlisted) {
        await axios.delete(`${API_URL}/shortlist/${profile._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsShortlisted(false);
      } else {
        await axios.post(
          `${API_URL}/shortlist/${profile._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsShortlisted(true);
      }
    } catch (err) {
      console.log("SHORTLIST ERROR", err.message);
    }
  };

  /* ================= INTEREST ================= */
  const sendInterest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/interest/request/send`,
        { receiverId: profile.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setInterestSent(true);
    } catch (err) {
      console.log("INTEREST ERROR", err.message);
    }
  };

  const sendChatInterest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/chat/now`,
        { receiverId: profile._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setChatInterestSent(true);
    } catch (err) {
      console.log("CHAT ERROR", err.message);
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loader}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      <Header title={profile.name} onMenuPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE */}
        <Image
          source={{ uri: profile.photos?.[0] }}
          style={styles.heroImage}
        />

        {/* BASIC CARD */}
        <View style={styles.card}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>
            {calculateAge(profile.dob)} yrs • {profile.height} •{" "}
            {profile.location}
          </Text>
        </View>

        {/* ABOUT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.text}>
            {profile.aboutYourself || "Not mentioned"}
          </Text>
        </View>

        {/* DETAILS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <Info label="Religion" value={profile.religion} />
          <Info label="Caste" value={profile.caste} />
          <Info label="Education" value={profile.educationDetails} />
          <Info label="Occupation" value={profile.occupation} />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* PREMIUM ACTION BAR */}
      <View style={styles.actionBar}>
        <ActionButton
          title={chatInterestSent ? "Interest Sent ✓" : "Chat Now"}
          onPress={sendChatInterest}
          disabled={chatInterestSent}
          style={{ backgroundColor: "#ff4e50" }}
        />

        <ActionButton
          title={interestSent ? "Interest Sent ✓" : "Send Interest"}
          onPress={sendInterest}
          disabled={interestSent}
          style={{ backgroundColor: "#D4AF37" }}
        />

        <ActionButton
          title={isShortlisted ? "Remove Shortlist" : "Add Shortlist"}
          onPress={toggleShortlist}
          style={{
            backgroundColor: isShortlisted ? "#ff4e50" : "#e3e3e3",
          }}
          textColor={isShortlisted ? "#fff" : "#000"}
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= SMALL COMPONENTS ================= */
const Info = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "-"}</Text>
  </View>
);

const ActionButton = ({
  title,
  onPress,
  disabled,
  style,
  textColor = "#fff",
}) => (
  <TouchableOpacity
    style={[styles.actionBtn, style, disabled && { opacity: 0.6 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.actionText, { color: textColor }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  heroImage: {
    width: "100%",
    height: 420,
    backgroundColor: "#eee",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    elevation: 4,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  sub: {
    marginTop: 6,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  infoLabel: {
    color: "#777",
  },

  infoValue: {
    fontWeight: "600",
  },

  /* ACTION BAR */
  actionBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    elevation: 12,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  actionText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
