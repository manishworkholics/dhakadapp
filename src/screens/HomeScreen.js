import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../context/ProfileContext";
const API_URL = "http://143.110.244.163:5000/api";

export default function HomeScreen() {
  const { profile } = useProfile();
  const navigation = useNavigation();
  const [premiumProfiles, setPremiumProfiles] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const featuredRes = await axios.get(`${API_URL}/featured?limit=10`);
      if (featuredRes.data?.profiles) {
        setPremiumProfiles(featuredRes.data.profiles);
      }

      const successRes = await axios.get(`${API_URL}/success`);
      if (successRes.data?.stories) {
        setSuccessStories(successRes.data.stories);
      }
    } catch (err) {
      console.log("HOME API ERROR", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header  title={profile?.name} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔴 TOP PROFILE CARD */}
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.profileName}>{profile?.name}</Text>
              <Text style={styles.profileId}>DH1409005</Text>

              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>Account : Free</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔴 COMPLETE PROFILE */}
        <View style={styles.completeBox}>
          <Text style={styles.completeTitle}>Complete your profile</Text>

          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{profile?.profileScore}%</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionText}>Add Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionText}>Family Details</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* 🔶 PREMIUM MATCHES (EXACT DESIGN) */}
        <View style={styles.premiumWrapper}>
          <Text style={styles.premiumTitle}>Premium Matches (541)</Text>
          <Text style={styles.premiumSub}>
            Recently upgrade Premium Members
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
          >
            {premiumProfiles.map((item, index) => (
              <View key={index} style={styles.premiumCard}>
                <Image
                  source={{ uri: item.photos?.[0] }}
                  style={styles.premiumImg}
                />

                {/* Overlay */}
                <View style={styles.premiumOverlay}>
                  <Text style={styles.premiumName}>
                    {item.name}
                    <Text style={styles.premiumAge}>  {item.age} yrs</Text>
                  </Text>

                  <Text style={styles.premiumInfo}>
                    {item.height || "5'6\""}, {item.caste || "Punjabi"}
                  </Text>

                  <Text style={styles.premiumInfo}>
                    {item.city}, {item.state}
                  </Text>
                </View>

                {/* Connect Button */}
                <TouchableOpacity style={styles.connectBtn} onPress={() =>
                  navigation.navigate("ProfileDetail", { id: item._id })
                }>
                  <Text style={styles.connectText}>✓  Connect Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* See All */}
          <TouchableOpacity style={styles.seeAllBox} onPress={() => navigation.navigate("Matches")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>


        {/* 🔴 NEW MATCHES */}
        {/* 🔶 NEW MATCHES (EXACT DESIGN) */}
        <View style={styles.newMatchWrapper}>
          <Text style={styles.newMatchTitle}>New Matches (541)</Text>
          <Text style={styles.newMatchSub}>Members who joined recently</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
          >
            {premiumProfiles.map((item, index) => (
              <View key={index} style={styles.newMatchCard}>
                <Image
                  source={{ uri: item.photos?.[0] }}
                  style={styles.newMatchImg}
                />

                {/* Overlay Content */}
                <View style={styles.newMatchOverlay}>
                  <Text style={styles.newMatchName}>
                    {item.name}
                    <Text style={styles.newMatchAge}>  {item.age} yrs</Text>
                  </Text>

                  <Text style={styles.newMatchInfo}>
                    {item.height || "5'6\""}, {item.caste || "Punjabi"}
                  </Text>

                  <Text style={styles.newMatchInfo}>
                    {item.city}, {item.state}
                  </Text>
                </View>

                {/* Chat Button */}
                <TouchableOpacity style={styles.chatBtn} onPress={() =>
                  navigation.navigate("ProfileDetail", { id: item._id })
                }>
                  <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* See All */}
          <TouchableOpacity style={styles.seeAllBox} onPress={() => navigation.navigate("Matches")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>


        {/* 🔴 SUCCESS STORIES */}
        {/* 🔶 SUCCESS STORIES (EXACT DESIGN) */}
        {successStories.length > 0 && (
          <View style={styles.successOuterWrap}>

            {/* ORANGE CURVED HEADER */}
            <View style={styles.successHeader}>
              <Text style={styles.successHeaderTitle}>Success Story</Text>
              <Text style={styles.successHeaderSub}>
                Check it out our success stories who found their life partner here.
              </Text>
            </View>

            {/* WHITE CARD BACKGROUND */}
            <View style={styles.successCardWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {successStories.map((story) => (
                  <View key={story._id} style={styles.successStoryCard}>

                    <Image
                      source={{ uri: story.image }}
                      style={styles.successStoryImg}
                    />

                    <View style={styles.successStoryContent}>
                      <Text style={styles.successStoryName}>
                        {story.name} & {story.partnerName}
                      </Text>

                      <Text style={styles.successStoryDesc} numberOfLines={2}>
                        {story.description || "A beautiful journey of love and togetherness."}
                      </Text>

                      <TouchableOpacity style={styles.readMoreBtn}>
                        <Text style={styles.readMoreText}>Read More</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                ))}
              </ScrollView>
            </View>

          </View>
        )}


        <View style={{ height: 80 }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },



  /* ================= NEW MATCHES ================= */

  newMatchWrapper: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 24,
    borderRadius: 16,
    padding: 14,
    elevation: 3,
  },

  newMatchTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  newMatchSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },

  newMatchCard: {
    width: 170,
    borderRadius: 18,
    marginRight: 14,
    overflow: "hidden",
  },

  newMatchImg: {
    width: "100%",
    height: 200,
    borderRadius: 18,
  },

  newMatchOverlay: {
    position: "absolute",
    bottom: 48,
    left: 10,
    right: 10,
  },

  newMatchName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  newMatchAge: {
    fontSize: 12,
    fontWeight: "500",
  },

  newMatchInfo: {
    color: "#eee",
    fontSize: 11,
    marginTop: 2,
  },

  chatBtn: {
    borderWidth: 1,
    borderColor: "#ff6f00",
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },

  chatBtnText: {
    color: "#ff6f00",
    fontWeight: "600",
  },

  seeAllBox: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 16,
    paddingTop: 12,
    alignItems: "center",
  },

  seeAllText: {
    color: "#ff6f00",
    fontWeight: "600",
  },


  /* ================= PREMIUM MATCHES ================= */

  premiumWrapper: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 24,
    borderRadius: 16,
    padding: 14,
    elevation: 3,
  },

  premiumTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  premiumSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },

  premiumCard: {
    width: 170,
    borderRadius: 18,
    marginRight: 14,
    overflow: "hidden",
  },

  premiumImg: {
    width: "100%",
    height: 200,
    borderRadius: 18,
  },

  premiumOverlay: {
    position: "absolute",
    bottom: 56,
    left: 10,
    right: 10,
  },

  premiumName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  premiumAge: {
    fontSize: 12,
    fontWeight: "500",
  },

  premiumInfo: {
    color: "#eee",
    fontSize: 11,
    marginTop: 2,
  },

  connectBtn: {
    borderWidth: 1,
    borderColor: "#ff6f00",
    borderRadius: 22,
    paddingVertical: 6,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },

  connectText: {
    color: "#ff6f00",
    fontWeight: "600",
  },

  seeAllBox: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 16,
    paddingTop: 12,
    alignItems: "center",
  },

  seeAllText: {
    color: "#ff6f00",
    fontWeight: "600",
  },


  /* TOP CARD */
  topCard: {
    backgroundColor: "#1c1c1c",
    margin: 14,
    borderRadius: 16,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  profileId: { color: "#aaa", marginTop: 4 },
  freeBadge: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  freeText: { color: "#fff", fontSize: 12 },
  upgradeBtn: {
    backgroundColor: "#f7a11b",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
  },
  upgradeText: { color: "#fff", fontWeight: "700" },

  /* COMPLETE PROFILE */
  completeBox: {
    backgroundColor: "#fff",
    margin: 14,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  completeTitle: { fontSize: 16, fontWeight: "700" },
  progressCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: "#ff4e50",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  progressText: { fontSize: 20, fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 12 },
  actionBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: { color: "#ff4e50", fontWeight: "600" },

  /* SECTIONS */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 20,
  },
  heading: { fontSize: 18, fontWeight: "700" },
  seeAll: { color: "#ff4e50", fontWeight: "600" },

  /* MATCH CARD */
  matchCard: {
    width: 180,
    height: 260,
    borderRadius: 16,
    marginLeft: 14,
    marginTop: 12,
    overflow: "hidden",
  },
  matchImg: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  matchName: { color: "#fff", fontWeight: "700", fontSize: 15 },
  matchLoc: { color: "#eee", fontSize: 12, marginBottom: 6 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 6,
    borderRadius: 18,
    alignItems: "center",
  },
  outlineText: { color: "#ff4e50", fontWeight: "600" },

  /* SUCCESS STORIES */
  /* ================= SUCCESS STORIES ================= */

  successOuterWrap: {
    marginTop: 24,
    marginHorizontal: 14,
  },

  /* Orange curved header */
  successHeader: {
    backgroundColor: "#FFA726",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: "center",
  },
  successHeaderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  successHeaderSub: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },

  /* White background card behind stories */
  successCardWrapper: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingVertical: 16,
    paddingLeft: 10,
    elevation: 4,
  },

  /* Individual story card */
  successStoryCard: {
    width: 230,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginRight: 14,
    elevation: 3,
    overflow: "hidden",
  },

  successStoryImg: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  successStoryContent: {
    padding: 12,
    alignItems: "center",
  },

  successStoryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6F00",
    textAlign: "center",
  },

  successStoryDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginVertical: 6,
  },

  /* Read More button – EXACT */
  readMoreBtn: {
    borderWidth: 1,
    borderColor: "#FF6F00",
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  readMoreText: {
    color: "#FF6F00",
    fontWeight: "600",
    fontSize: 13,
  },

});
