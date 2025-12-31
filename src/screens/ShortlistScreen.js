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
import Footer from '../components/Footer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

export default function ShortlistScreen({ navigation }) {
  const [shortlistedProfiles, setShortlistedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FETCH SHORTLIST */
  const fetchShortlistedProfiles = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("SHORTLIST RESPONSE 👉", res.data);

      if (res.data.success) {
        setShortlistedProfiles(res.data.shortlist || []);
      }
    } catch (err) {
      console.log(
        "SHORTLIST ERROR 👉",
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 REMOVE FROM SHORTLIST */
  const handleRemoveShortlist = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.delete(
        `${API_URL}/shortlist/${profileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setShortlistedProfiles((prev) =>
          prev.filter(
            (item) => item.profile?._id !== profileId
          )
        );
      }
    } catch (err) {
      console.log(
        "REMOVE SHORTLIST ERROR 👉",
        err?.response?.data || err.message
      );
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
        <Image
          source={{ uri: profile?.photos?.[0] }}
          style={styles.image}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.details}>
            {profile?.location || "N/A"} • Age{" "}
            {calculateAge(profile?.dob)}
          </Text>
          <Text style={styles.occupation}>
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
              onPress={() =>
                handleRemoveShortlist(profile?._id)
              }
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
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      
    </View>
  );
}

/* 🔹 STYLES */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  details: {
    color: "#777",
    marginTop: 2,
  },
  occupation: {
    color: "#555",
    marginTop: 2,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  viewBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  viewText: {
    color: "#ff4e50",
    fontWeight: "600",
    fontSize: 13,
  },
  removeBtn: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  removeText: {
    color: "#555",
    fontWeight: "600",
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
