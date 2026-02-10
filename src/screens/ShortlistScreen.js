import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

export default function ShortlistScreen({ navigation }) {
  const [shortlistedProfiles, setShortlistedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  /* 🔹 FETCH SHORTLIST */
  const fetchShortlistedProfiles = async () => {
    try {
      if (!refreshing) setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("SHORTLIST RESPONSE 👉", res.data);

      if (res.data.success) {
        setShortlistedProfiles(res.data.shortlist || []);
      }
    } catch (err) {
      console.log("SHORTLIST ERROR 👉", err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShortlistedProfiles();
  }, []);

  /* 🔹 REMOVE FROM SHORTLIST */
  const handleRemoveShortlist = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.delete(`${API_URL}/shortlist/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setShortlistedProfiles((prev) =>
          prev.filter((item) => item.profile?._id !== profileId)
        );
      }
    } catch (err) {
      console.log("REMOVE SHORTLIST ERROR 👉", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchShortlistedProfiles();
  }, []);

  /* 🔹 AGE CALCULATION */
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  /* 🔹 RENDER ITEM */
  const renderItem = ({ item }) => {
    const profile = item.profile;

    return (
      <View style={styles.card}>
        <Image source={{ uri: profile?.photos?.[0] }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {profile?.name}
          </Text>

          <Text style={styles.details} numberOfLines={1}>
            {profile?.location || "N/A"} • {calculateAge(profile?.dob)} yrs
          </Text>

          <Text style={styles.occupation} numberOfLines={1}>
            {profile?.occupation || "N/A"}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() =>
                navigation.navigate("ProfileDetail", {
                  id: profile?._id,
                })
              }
            >
              <Text style={styles.viewText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveShortlist(profile?._id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header title="Shortlist" />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : shortlistedProfiles.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            You have not shortlisted any profiles yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={shortlistedProfiles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
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


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  image: {
    width: 78,
    height: 96,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  details: {
    color: "#777",
    marginTop: 4,
    fontSize: 13,
  },

  occupation: {
    color: "#444",
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  viewBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF4500",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  viewText: {
    color: "#FF4500",
    fontWeight: "800",
    fontSize: 13,
  },

  removeBtn: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  removeText: {
    color: "#333",
    fontWeight: "800",
    fontSize: 13,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyText: {
    color: "#888",
    textAlign: "center",
  },
});
