import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const API_URL = "http://143.110.244.163:5000/api";
const SWIPE_THRESHOLD = 120;

export default function MatchesScreen() {
  const navigation = useNavigation();
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [checkingShortlist, setCheckingShortlist] = useState(false);

  const [interestSent, setInterestSent] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);
  const [checkingInterest, setCheckingInterest] = useState(false);


  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ✅ SAFE Animated Value */
  const position = useRef(null);
  if (!position.current) {
    position.current = new Animated.ValueXY();
  }

  /* ================= FETCH MATCHES ================= */
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${API_URL}/matches/new-matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfiles(res.data.matches || []);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
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
        setInterestSent(true);
        setInterestStatus("pending");
        Alert.alert("Success", "Interest sent successfully ❤️");
      }
    } catch (error) {
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send interest";

      Alert.alert("Error", apiMsg);
    }
  };



  const checkShortlistStatus = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const exists = res.data.shortlist.some(
          (item) => item.profile?._id === profileId
        );
        setIsShortlisted(exists);
      }
    } catch (error) {
      console.log("Shortlist status error:", error.message);
    }
  };






  const toggleShortlist = async () => {
    try {
      setCheckingShortlist(true);
      const token = await AsyncStorage.getItem("token");

      const res = await axios({
        url: `${API_URL}/shortlist/${profile._id}`,
        method: isShortlisted ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setIsShortlisted(!isShortlisted);
        Alert.alert(
          "Success",
          isShortlisted ? "Removed from shortlist" : "Added to shortlist"
        );
      }
    } catch (error) {
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";

      Alert.alert("Error", apiMsg);
    } finally {
      setCheckingShortlist(false);
    }
  };


  const checkInterestStatus = async (targetUserId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/interest/request/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const found = res.data.requests.find(
          (req) => req.receiver?._id === targetUserId
        );

        if (found) {
          setInterestSent(true);
          setInterestStatus(found.status); // pending / accepted / rejected
        } else {
          setInterestSent(false);
          setInterestStatus(null);
        }
      }
    } catch (error) {
      console.log("Interest status error:", error.message);
    }
  };


  useEffect(() => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile?.userId) {
      checkInterestStatus(currentProfile.userId);
    }
    if (profiles[currentIndex]?._id) {
      checkShortlistStatus(profiles[currentIndex]._id);
    }
  }, [currentIndex, profiles]);



  /* ================= SWIPE HANDLER ================= */
  const forceSwipe = (direction) => {
    Animated.timing(position.current, {
      toValue: { x: direction * width, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const profile = profiles[currentIndex];
    position.current.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);

    if (direction === 1 && profile?.userId) {
      sendInterest(profile.userId);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.current.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe(1);
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe(-1);
      } else {
        Animated.spring(position.current, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const rotate = position.current.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  const animatedStyle = {
    transform: [{ translateX: position.current.x }, { rotate }],
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  const profile = profiles[currentIndex];
  if (!profile) {
    return (
      <View style={styles.loader}>
        <Text>No more profiles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Matches" />

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, animatedStyle]}
      >
        {/* IMAGE */}
        <View style={styles.imageWrap}  >
          {/* BLUR BACKGROUND */}
          <Image
            source={{ uri: profile.photos?.[0] }}
            style={styles.blurBg}
            blurRadius={25}
          />

          {/* MAIN IMAGE */}
          <Image
            source={{ uri: profile.photos?.[0] }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>


        {/* TOP BAR */}
        <View style={styles.topBar}>
          <Text style={styles.viewedText}>Viewed you 4/7</Text>

          <View style={styles.topRight}>
            <TouchableOpacity
              style={[
                styles.shortlistPill,
                { backgroundColor: isShortlisted ? "#4caf50" : "rgba(0,0,0,0.6)" },
              ]}
              onPress={toggleShortlist}
              disabled={checkingShortlist}
            >
              <Text style={styles.shortlistText}>
                {isShortlisted ? "Shortlisted" : "Shortlist"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.menu}>⋮</Text>
          </View>
        </View>

        {/* SLIDE COUNT */}
        <View style={styles.slideCount}>
          <Text style={styles.slideText}>1 / 2</Text>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.detailsCard}>
          <View style={styles.verifiedRow}>
            <Text style={styles.verified}>✔ Verified</Text>
            <Text style={styles.viewedDate}>
              She viewed you on 29 Nov 25
            </Text>
          </View>

          <Text style={styles.name}>
            {profile.name}
          </Text>

          <Text style={styles.meta}>

            {calculateAge(profile.dob)} yrs
          </Text>

          <Text style={styles.meta}>
            {profile.height} • {profile.caste} •{" "}
            {profile.educationDetails} • {profile.occupation} •{" "}
            {profile.annualIncome} • {profile.location}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.skipBtn} onPress={() =>
            navigation.navigate("ProfileDetail", { id: profile._id })
          }>
            <Text style={styles.skipText}> Show Detail</Text>
          </TouchableOpacity>


        </View>

        <TouchableOpacity
          style={[
            styles.interestBtn,
            interestSent && { backgroundColor: "#aaa" },
          ]}
          disabled={interestSent}
          onPress={() => sendInterest(profile.userId)}
        >
          <Text style={styles.interestText}>
            {interestSent
              ? interestStatus === "accepted"
                ? "✅ Accepted"
                : interestStatus === "rejected"
                  ? "❌ Rejected"
                  : "⏳ Pending"
              : "❤️ Send Interest"}
          </Text>
        </TouchableOpacity>



      </Animated.View>


      <Footer />
    </View>
  );
}

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 65;
const CARD_MARGIN = 40;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 80, // footer height + safe gap
  },

  imageWrap: {
    width: "100%",
    height: 420,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  blurBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },



  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },



  card: {
    width: width - 30,
    height:
      Dimensions.get("window").height -
      HEADER_HEIGHT -
      FOOTER_HEIGHT -
      CARD_MARGIN,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginTop: 20,
    elevation: 6,
    overflow: "hidden",
  },



  image: {
    width: "100%",
    height: 420,
  },

  /* TOP BAR */
  topBar: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },

  viewedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  shortlistPill: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  shortlistText: {
    color: "#fff",
    fontSize: 13,
  },

  menu: {
    color: "#fff",
    fontSize: 20,
  },

  slideCount: {
    position: "absolute",
    bottom: 280,
    alignSelf: "center",
  },

  slideText: {
    color: "#fff",
    fontSize: 14,
  },

  detailsCard: {
    backgroundColor: "#fff",
    padding: 16,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  verified: {
    color: "#2e7d32",
    fontWeight: "700",
    marginRight: 10,
  },

  viewedDate: {
    color: "#777",
    fontSize: 13,
  },

  detailsName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  meta: {
    color: "#555",
    fontSize: 14,
    marginBottom: 2,
  },

  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  skipBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginHorizontal: 4,
  },

  skipText: {
    color: "#555",
    fontWeight: "600",
  },

  interestBtn: {
    margin: 16,
    backgroundColor: "#e86a00",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
  },

  interestText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
