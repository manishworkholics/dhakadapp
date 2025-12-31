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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
const API_URL = "http://143.110.244.163:5000/api";

export default function ProfileDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        const currentUser = user ? JSON.parse(user) : null;

        const res = await axios.get(`${API_URL}/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data.profile);
        setLoading(false);

        // ✅ Mark profile as viewed (not own profile)
        if (currentUser && res.data.profile._id !== currentUser._id) {
          await axios.post(
            `${API_URL}/viewed/view/${res.data.profile._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Profile marked as viewed");
        }
      } catch (error) {
        console.log(
          "PROFILE DETAIL ERROR 👉",
          error?.response?.data || error.message
        );
        setLoading(false);
      }
    };

    getProfile();
  }, [id]);

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
    <View style={{ flex: 1 }}>
      <Header title={profile.name} back />

      <ScrollView>
        {/* 🔹 PHOTO */}
        <Image
          source={{ uri: profile.photos?.[0] }}
          style={styles.mainImage}
        />

        {/* 🔹 BASIC INFO */}
        <View style={styles.card}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>
            {calculateAge(profile.dob)} yrs • {profile.height} •{" "}
            {profile.location}
          </Text>
        </View>

        {/* 🔹 ABOUT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.text}>
            {profile.aboutYourself || "Not mentioned"}
          </Text>
        </View>

        {/* 🔹 PERSONAL DETAILS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <Text style={styles.text}>Religion: {profile.religion}</Text>
          <Text style={styles.text}>Caste: {profile.caste}</Text>
          <Text style={styles.text}>
            Education: {profile.educationDetails}
          </Text>
          <Text style={styles.text}>
            Occupation: {profile.occupation}
          </Text>
        </View>

        {/* 🔹 ACTIONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.connectBtn}>
            <Text style={styles.btnText}>Connect</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <Footer />
    </View>
  );
}


const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  /* Main Image */
  mainImage: {
    width: "100%",
    height: 420,
    backgroundColor: "#eee",
  },

  /* Card Wrapper */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
  },

  /* Name */
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  sub: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  /* Section Titles */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 4,
  },

  /* Action Buttons */
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginTop: 18,
  },

  connectBtn: {
    flex: 1,
    backgroundColor: "#ff4e50",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginRight: 8,
    elevation: 3,
  },

  chatBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginLeft: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  chatText: {
    color: "#ff4e50",
    fontWeight: "700",
    fontSize: 15,
  },
});
