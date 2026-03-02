
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DrawerLayout from "../components/DrawerLayout";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfile } from "../context/ProfileContext";
import { Dimensions, Animated } from "react-native";
import { useRef } from "react";


const API_URL = "http://143.110.244.163:5000/api";

/* ================= Skeleton Card ================= */

const CardSkeleton = () => (
  <View style={skeleton.card}>
    <View style={skeleton.image} />
    <View style={skeleton.lineShort} />
    <View style={skeleton.lineLong} />
    <View style={skeleton.button} />
  </View>
);


export default function HomeScreen() {


  const { profile } = useProfile();
  const navigation = useNavigation();
  const [premiumProfiles, setPremiumProfiles] = useState([]);
  const [newmatches, setNewmatches] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasActivePlan } = useProfile();

  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeUserImage, setUpgradeUserImage] = useState(null);


  const handleProfilePress = (profileId, photo) => {
    if (!hasActivePlan) {
      setUpgradeUserImage(photo || null);   // ✅ clicked profile image set
      setShowUpgrade(true);
      return;
    }
    navigation.navigate("ProfileDetail", { id: profileId });
  };



  const fetchFeaturedProfiles = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/featured?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.profiles) setPremiumProfiles(res.data.profiles);
    } catch (e) {
      console.log("FEATURED API ERROR", e.message);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoadingTestimonials(true);

      const token = await AsyncStorage.getItem("token"); // ✅ just in case backend requires auth

      const res = await axios.get(`${API_URL}/review/testimonials?limit=8`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("TESTIMONIAL RES =>", res.data);

      // ✅ handle multiple possible response shapes
      const list =
        res.data?.data ||
        res.data?.testimonials ||
        res.data?.reviews ||
        res.data?.result ||
        [];

      setTestimonials(Array.isArray(list) ? list : []);
    } catch (error) {
      console.log("TESTIMONIAL API ERROR", error?.response?.data || error.message);
      setTestimonials([]);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const fetchNewMatches = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/matches/new-matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.matches) setNewmatches(res.data.matches);
    } catch (e) {
      console.log("MATCHES API ERROR", e.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/profile/profiles?page=1&limit=9`, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      if (res.data?.profiles) setProfiles(res.data.profiles);
    } catch (e) {
      console.log("PROFILES API ERROR", e.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const fetchSuccessStories = async () => {
    try {
      const res = await axios.get(`${API_URL}/success`);
      if (res.data?.stories) setSuccessStories(res.data.stories);
    } catch (e) {
      console.log("STORIES API ERROR", e.message);
    } finally {
      setLoadingStories(false);
    }
  };


  useEffect(() => {
    fetchFeaturedProfiles();
    fetchNewMatches();
    fetchProfiles();
    fetchSuccessStories();
    fetchTestimonials();
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

  const screenWidth = Dimensions.get("window").width;
  const scrollX = useRef(new Animated.Value(0)).current;
  const testimonialRef = useRef(null);

  useEffect(() => {
    if (testimonials.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % testimonials.length;

      testimonialRef.current?.scrollTo({
        x: index * (screenWidth - 60),
        animated: true,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [testimonials]);

  return (
    <DrawerLayout navigation={navigation}>
      <View style={styles.container}>
        <Header title={profile?.name} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 🔴 TOP PROFILE CARD */}
          <View style={styles.topCard}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.profileName}>{profile?.name}</Text>
                <Text style={styles.profileId}>DH{profile?._id?.slice(0, 5)}</Text>

                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>
                    Account : {hasActivePlan ? "Premium" : "Free"}
                  </Text>
                </View>

              </View>
              {!hasActivePlan && (
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => navigation.navigate("Premium")}
                >
                  <FontAwesome5 name="crown" size={14} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.upgradeText}>Upgrade Now</Text>
                </TouchableOpacity>
              )}


            </View>
          </View>

          {/* 🔴 COMPLETE PROFILE */}
          <View style={styles.completeBox}>
            <Text style={styles.completeTitle}> 
              {profile?.profileScore === 100
                ? "Your Profile is Completed"
                : "Complete Your Profile"}
            </Text>

            <View
              style={[
                styles.progressCircle,
                {
                  borderColor:
                    profile?.profileScore === 100 ? "green" : "red",
                },
              ]}
            >
              <Text style={styles.progressText}>
                {profile?.profileScore || 0}%
              </Text>
            </View>

            <View style={styles.actionRow}>
              {profile?.profileScore === 100 ? (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.actionText}>Update Profile</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.actionText}>Complete Profile</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>


          {/* ================= Premium Matches ================= */}

          <View style={styles.premiumWrapper}>
            <Text style={styles.premiumTitle}>Premium Matches</Text>
            <Text style={styles.premiumSub}>

            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {loadingFeatured
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : premiumProfiles.map((item) => (
                  <View key={item._id} style={styles.premiumCard}>
                    <ImageBackground
                      source={{ uri: item.photos?.[0] }}
                      style={styles.premiumImgBg}
                      blurRadius={18}
                    >
                      <View style={styles.darkOverlay} />
                      <Image
                        source={{ uri: item.photos?.[0] }}
                        style={styles.premiumImg}
                      />
                    </ImageBackground>

                    <View style={styles.premiumOverlay}>
                      <Text style={styles.premiumName}>
                        {item.name}{" "}
                        <Text style={styles.premiumAge}>
                          {calculateAge(item.dob)} yrs
                        </Text>
                      </Text>
                      <Text style={styles.premiumInfo}>
                        {item.height}, {item.caste}
                      </Text>
                      <Text style={styles.premiumInfo}>
                        {item.city}, {item.state}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.connectBtn}
                      onPress={() => handleProfilePress(item._id, item.photos?.[0])}
                    >
                      <Text style={styles.connectText}>✓ Connect Now</Text>
                    </TouchableOpacity>

                  </View>
                ))}
            </ScrollView>
          </View>


          {/* ================= New Matches ================= */}

          <View style={styles.newMatchWrapper}>
            <Text style={styles.newMatchTitle}>New Matches</Text>
            <Text style={styles.premiumSub}>

            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {loadingMatches
                ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                : newmatches.map((item) => (
                  <View key={item._id} style={styles.newMatchCard}>
                    <ImageBackground
                      source={{ uri: item.photos?.[0] }}
                      style={styles.newMatchImgBg}
                      blurRadius={16}
                    >
                      <View style={styles.darkOverlay} />
                      <Image
                        source={{ uri: item.photos?.[0] }}
                        style={styles.newMatchImg}
                      />
                    </ImageBackground>

                    <TouchableOpacity
                      style={styles.chatBtn}
                      onPress={() => handleProfilePress(item._id, item.photos?.[0])}
                    >
                      <Text style={styles.chatBtnText}>Chat</Text>
                    </TouchableOpacity>

                  </View>
                ))}
            </ScrollView>
          </View>


          <View style={styles.newMatchWrapper}>
            <View style={styles.newMatchHeader}>
              <Text style={styles.newMatchTitle}>Find Partner</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("FindPartner")}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.premiumSub}>

            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {loadingProfiles
                ? [...Array(4)].map((_, index) => <CardSkeleton key={index} />)
                : profiles.map((item, index) => (
                  <View key={item._id || index} style={styles.newMatchCard}>
                    <Image
                      source={{ uri: item.photos?.[0] }}
                      style={styles.newMatchImg}
                    />

                    {/* Overlay Content */}
                    <View style={styles.newMatchOverlay}>
                      <Text style={styles.newMatchName}>
                        {item.name}
                        <Text style={styles.newMatchAge}>
                          {"  "}
                          {calculateAge(item.dob)} yrs
                        </Text>
                      </Text>

                      <Text style={styles.newMatchInfo}>
                        {item.height || "5'6\""}, {item.caste || ""}
                      </Text>

                      <Text style={styles.newMatchInfo}>
                        {item.city}, {item.state}
                      </Text>
                    </View>

                    {/* Chat Button */}
                    <TouchableOpacity
                      style={styles.chatBtn}
                      onPress={() => handleProfilePress(item._id, item.photos?.[0])}
                    >
                      <Text style={styles.chatBtnText}>View-Detail</Text>
                    </TouchableOpacity>

                  </View>
                ))}
            </ScrollView>
          </View>





          {/* 🔴 SUCCESS STORIES */}

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
                <ScrollView horizontal showsHorizontalScrollIndicator={false} >
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

                        <TouchableOpacity style={styles.readMoreBtn} onPress={() => navigation.navigate("DetailSuccess", { id: story._id })}>
                          <Text style={styles.readMoreText}>Read More</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  ))}
                </ScrollView>
              </View>

            </View>
          )}


          {/* ================= PREMIUM TESTIMONIALS ================= */}

          <View style={styles.testimonialWrapper}>
            <Text style={styles.testimonialTitle}>
              What <Text style={{ color: "#FF6F00" }}>Members Say</Text>
            </Text>

            {loadingTestimonials ? (
              <View style={{ flexDirection: "row" }}>
                {[1, 2].map((i) => (
                  <View key={i} style={styles.testimonialSkeleton} />
                ))}
              </View>
            ) : testimonials.length === 0 ? (
              <Text style={{ textAlign: "center" }}>
                No testimonials available yet.
              </Text>
            ) : (
              <>
                <Animated.ScrollView
                  ref={testimonialRef}
                  horizontal
                  pagingEnabled
                  snapToInterval={screenWidth - 60}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
                >
                  {testimonials.map((item) => (
                    <View key={item._id} style={[styles.testimonialCard, { width: screenWidth - 60 }]}>

                      {/* Stars */}
                      <Text style={styles.testimonialStars}>
                        {"★".repeat(item.rating)}
                      </Text>

                      {/* Comment */}
                      <Text style={styles.testimonialComment}>
                        "{item.comment}"
                      </Text>


                      <View>
                        <Text style={styles.testimonialName}>
                          {item.user?.name}
                        </Text>
                        <Text style={styles.testimonialCity}>
                          {item.user?.city}
                        </Text>
                      </View>


                    </View>
                  ))}
                </Animated.ScrollView>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                  {testimonials.map((_, i) => {
                    const inputRange = [
                      (i - 1) * (screenWidth - 60),
                      i * (screenWidth - 60),
                      (i + 1) * (screenWidth - 60),
                    ];

                    const dotWidth = scrollX.interpolate({
                      inputRange,
                      outputRange: [8, 18, 8],
                      extrapolate: "clamp",
                    });

                    const opacity = scrollX.interpolate({
                      inputRange,
                      outputRange: [0.4, 1, 0.4],
                      extrapolate: "clamp",
                    });

                    return (
                      <Animated.View
                        key={i}
                        style={[
                          styles.dot,
                          { width: dotWidth, opacity },
                        ]}
                      />
                    );
                  })}
                </View>
              </>
            )}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        <Footer />
        <UpgradeModal
          visible={showUpgrade}
          imageUri={upgradeUserImage}   // ✅ new prop
          onClose={() => setShowUpgrade(false)}
          onUpgrade={() => {
            setShowUpgrade(false);
            navigation.navigate("Premium");
          }}
        />


      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F1F1" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },



  /* ================= NEW MATCHES ================= */
  premiumImgBg: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  premiumImg: {
    width: "90%",
    height: "85%",
  },
  newMatchImgBg: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  newMatchImg: {
    width: "90%",
    height: "85%",
  },
  successStoryImg: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },


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
    borderRadius: 8,
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
    marginTop: 10,
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
    borderRadius: 12,
    marginRight: 14,
    overflow: "hidden",
  },

  premiumImg: {
    width: "100%",
    height: 200,
    borderRadius: 2,
  },

  premiumOverlay: {
    position: "absolute",
    bottom: 30,
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
    borderRadius: 8,
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
    flexDirection: "row",     // 🔥 IMPORTANT
    alignItems: "center",
    backgroundColor: "#D4AF37",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },


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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: "#ff4e50",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  progressText: { fontSize: 22, fontWeight: "800" },
  actionRow: { flexDirection: "row", gap: 12 },
  actionBtn: {
    borderWidth: 1,
    borderColor: "#696969",
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: { color: "#000000", fontWeight: "800" },

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


  /* ================= SUCCESS STORIES ================= */

  successOuterWrap: {
    marginTop: 24,
    marginHorizontal: 14,
  },

  /* Orange curved header */
  successHeader: {
    backgroundColor: "#D4AF37",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",

  },
  successHeaderTitle: {
    color: "#FFFFFF",
    fontSize: 16,
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
    borderBottomLeftRadius: 19,
    borderBottomRightRadius: 19,
    paddingVertical: 20,
    paddingLeft: 10,
    paddingBottom: 26,   // ⭐ KEY FIX
    elevation: 1,
  },


  /* Individual story card */
  successStoryCard: {
    width: 210,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 14,
    marginBottom: 10,     // ⭐ prevents touching
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E6E6E6",
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
    borderRadius: 8,
    marginTop: 6,
  },
  readMoreText: {
    color: "#FF6F00",
    fontWeight: "600",
    fontSize: 14,
  },

  newMatchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  seeAllText: {
    color: "#e86a00",
    fontWeight: "700",
    fontSize: 14,
  },



  /* ================= TESTIMONIALS ================= */

  testimonialWrapper: {
    marginTop: 30,
    marginHorizontal: 14,
  },

  testimonialTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  testimonialCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginRight: 14,
    elevation: 2,
    marginBottom: 5
  },

  testimonialStars: {
    color: "#F3B400",
    fontSize: 18,
    marginBottom: 10,
  },

  testimonialComment: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    marginBottom: 18,
    lineHeight: 20,
  },

  testimonialUser: {
    flexDirection: "row",
    alignItems: "center",
  },

  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  testimonialName: {
    fontWeight: "700",
    fontSize: 14,
  },

  testimonialCity: {
    fontSize: 12,
    color: "#888",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6F00",
    marginHorizontal: 4,
  },

  testimonialSkeleton: {
    width: 260,
    height: 160,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    marginRight: 14,
  },

});


const UpgradeModal = ({ visible, onClose, onUpgrade, imageUri }) => {
  if (!visible) return null;

  return (
    <View style={modalStyles.overlay}>
      <View style={modalStyles.card}>
        <Image
          source={{
            uri:
              imageUri ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop",
          }}
          style={modalStyles.avatar}
        />
        {/* बाकी same */}


        <Text style={modalStyles.title}>
          Upgrade Now to get full access
        </Text>

        <View style={modalStyles.option}>
          <Text>📞 +91********</Text>
        </View>

        <View style={modalStyles.option}>
          <Text>💬 Chat via WhatsApp</Text>
        </View>

        <View style={modalStyles.option}>
          <Text>💌 Message via Direct Chat</Text>
        </View>

        <TouchableOpacity style={modalStyles.planBtn} onPress={onUpgrade}>
          <Text style={modalStyles.planText}>View Plans</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={modalStyles.close}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const modalStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  card: {
    width: "85%",
    backgroundColor: "#d4af37",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: -60,
    backgroundColor: "#fff",
  },

  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },

  option: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },

  planBtn: {
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 22,
    marginTop: 14,
  },

  planText: {
    color: "#fff",
    fontWeight: "700",
  },

  close: {
    marginTop: 10,
    color: "#fff",
    opacity: 0.8,
  },
});


/* ================= Skeleton styles ================= */

const skeleton = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 18,
    marginRight: 14,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
  },
  lineShort: {
    height: 10,
    width: "60%",
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginTop: 10,
  },
  lineLong: {
    height: 10,
    width: "80%",
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginTop: 6,
  },
  button: {
    height: 26,
    width: "90%",
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "center",
  },



/* ================= Complate profile progressCircle ================= */
  progressCircle: {
  width: 90,
  height: 90,
  borderRadius: 45,
  borderWidth: 6,
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 10,
},
});