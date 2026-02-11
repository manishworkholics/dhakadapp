import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AppModal from "../components/AppModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProfile } from "../context/ProfileContext";

const API_URL = "http://143.110.244.163:5000/api";
const { width } = Dimensions.get("window");

export default function ProfileDetailScreen({ route, navigation }) {
  const [compatibility, setCompatibility] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

  const { id } = route.params;

  const { hasActivePlan, hasFeature, profiles } = useProfile();

  const [interestSent, setInterestSent] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);

  const [chatInterestSent, setChatInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const checkShortlist = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setIsShortlisted(res.data.shortlist.some((i) => i.profile._id === profileId));
      }
    } catch { }
  };

  const checkInterestStatus = async (profileUserId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/interest/request/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const found = res.data.requests.find((req) => req.receiver?._id === profileUserId);

        if (found) {
          setInterestSent(true);
          setInterestStatus(found.status);
        } else {
          setInterestSent(false);
          setInterestStatus(null);
        }
      }
    } catch (err) {
      console.log("CHECK INTEREST STATUS ERROR:", err.message);
    }
  };

  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  const loadProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/matches/matches/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = res.data.profile;
      setProfile(p);

      // ✅ IMPORTANT
      setCompatibility(res.data.compatibility || null);
      setHasPremiumAccess(!!res.data.hasPremiumAccess);   // ✅ add this

      if (p?.userId) await checkInterestStatus(p.userId);
      if (p?._id) await checkShortlist(p._id);
    } catch (err) {
      console.log("PROFILE ERROR:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile(false);
  }, [id]);

  const onRefresh = useCallback(() => {
    loadProfile(true);
  }, [id]);

  const sendInterest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/interest/request/send`,
        { receiverId: profile.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setInterestSent(true);
        setInterestStatus("pending");
        showModal("Interest sent successfully ❤️", "success");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data?.error || "Failed to send interest";
      showModal(msg, "error");
    }
  };

  const sendChatInterest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/chat/now`,
        { receiverId: profile.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setChatInterestSent(true);
        setTimeout(() => {
          navigation.navigate("Chat");
        }, 800);
      } else {
        showModal(res.data.message || "Failed to send chat request", "error");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data?.error || "Failed to send interest";
      console.error("CHAT ERROR:", msg);
      showModal(msg, "error");
    }
  };

  const toggleShortlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios({
        url: `${API_URL}/shortlist/${profile._id}`,
        method: isShortlisted ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setIsShortlisted(!isShortlisted);
        showModal(isShortlisted ? "Removed from shortlist" : "Added to shortlist", "success");
      }
    } catch (err) {
      const data = err?.response?.data;
      if (data?.code === "PREMIUM_REQUIRED") {
        showModal("Upgrade to premium to use shortlist feature", "warning");
        return;
      }
      showModal(data?.message || "Something went wrong", "error");
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "Recently active";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "1d ago";
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

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

  const hobbiesArr = (profile.hobbies || "")
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);

  const ContactRow = ({ icon, label, value, locked }) => (
    <View style={contactStyles.row}>
      <View style={contactStyles.iconBox}>
        <Icon name={icon} size={18} color="#555" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={contactStyles.label}>{label}</Text>

        {locked ? (
          <Text style={contactStyles.lockText}>
            🔒 Upgrade to premium to view contact details
          </Text>
        ) : (
          <Text style={contactStyles.value}>{value}</Text>
        )}
      </View>
    </View>
  );


  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title={profile.name} onMenuPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 220 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff4e50"]} />
        }
      >
        {/* IMAGE SLIDER */}
        <View style={styles.sliderWrap}>
          <FlatList
            data={profile.photos || []}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ImageBackground source={{ uri: item }} style={styles.heroBg} blurRadius={18}>
                <View style={styles.heroDark} />
                <Image source={{ uri: item }} style={styles.heroImage} resizeMode="contain" />
              </ImageBackground>
            )}
          />

          <View style={styles.heroOverlay}>
            <Text style={styles.heroName}>{profile.name}</Text>

            <Text style={styles.heroSub}>
              {calculateAge(profile.dob)} yrs, {profile.height || "N/A"} • {profile.occupation || "N/A"}
            </Text>

            <Text style={styles.heroSub}>
              {profile.motherTongue || "N/A"}, {profile.caste || "N/A"} • {profile.location || "N/A"}
            </Text>

            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <Text>🟢 {timeAgo(profile.createdAt)}</Text>
              </View>
              <View style={styles.badge}>
                <Text>👫 You & Her</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ABOUT */}
        <Card title="About">
          <Text style={styles.text}>{profile.aboutYourself || "Not mentioned"}</Text>
        </Card>

        {/* HOBBIES */}
        <Card title="Hobbies & Interests">
          {hobbiesArr.length ? (
            <View style={styles.chipsWrap}>
              {hobbiesArr.map((h, i) => (
                <View key={`${h}-${i}`} style={styles.chip}>
                  <Text>{h}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.text}>Not mentioned</Text>
          )}
        </Card>

        {/* BASIC DETAILS (FULL FIELDS ADDED) */}
        <Card title="Basic Details">
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text>Gender: {profile.gender || "N/A"}</Text>
            </View>
            <View style={styles.pill}>
              <Text>ID: DH{profile?._id?.slice(0, 5)}</Text>
            </View>
          </View>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text>Age: {calculateAge(profile.dob)} yrs</Text>
            </View>
            <View style={styles.pill}>
              <Text>Height: {profile.height || "N/A"}</Text>
            </View>
          </View>

          <InfoRow label="Birth Date" value={new Date(profile.dob).toDateString()} />
          <InfoRow label="Mother Tongue" value={profile.motherTongue || "N/A"} />
          <InfoRow label="Location" value={profile.location || "N/A"} />
          <InfoRow label="Physical Status" value={profile.physicalStatus || "N/A"} />
          <InfoRow label="Marital Status" value={profile.maritalStatus || "N/A"} />
          <InfoRow label="Religion" value={profile.religion || "N/A"} />
          <InfoRow label="Caste" value={profile.caste || "N/A"} />
          <InfoRow label="Sub Caste" value={profile.subCaste || "N/A"} />
          <InfoRow label="Gotra" value={profile.gotra || "N/A"} />
          <InfoRow label="Diet" value={profile.diet || "N/A"} />
          <InfoRow label="Family Status" value={profile.familyStatus || "N/A"} />


          {!hasActivePlan ? <PremiumBtn onPress={() => navigation.navigate("Premium")} /> : null}
        </Card>

        {/* CONTACT DETAILS */}
        <Card title="Contact Details">
          {hasFeature("Privacy Controls") ? (
            <>
              <InfoRow label="Contact No." value={profile.phone || "Not available"} />
              <InfoRow label="Email ID" value={profile.email || "Not available"} />
            </>
          ) : (
            <>
              <InfoRow label="Contact No." value={profile.phone || "+91********** 🔒"} />
              <InfoRow label="Email ID" value={profile.email || "@gmail.com******** 🔒"} />
              <PremiumBtn onPress={() => navigation.navigate("Premium")} />
            </>
          )}
        </Card>

        {/* CAREER & EDUCATION (FULL) */}
        <View style={styles.ceCard}>
          <Text style={styles.ceTitle}>Career & Education</Text>

          <CEItem icon="🎓" label="Education" value={profile.educationDetails || "Not available"} />
          <CEItem icon="🏢" label="Employment Type" value={profile.employmentType || "Not available"} />
          <CEItem icon="🏫" label="Occupation" value={profile.occupation || "Not available"} />
          <CEItem icon="💰" label="Annual Income" value={profile.annualIncome || "Not available"} />

          <View style={styles.ceDivider} />

          {hasFeature("Best Matches") ? (
            <View style={styles.yhCard} />
          ) : (
            <View style={styles.yhLocked}>
              <Text style={styles.yhLockedText}>Upgrade to see compatibility with {profile.name}</Text>
              <PremiumBtn onPress={() => navigation.navigate("Premium")} />
            </View>
          )}
        </View>

        {/* YOU & HER */}
        <View style={styles.yhCard}>
          <View style={styles.yhHeader}>
            <View style={styles.yhAvatars}>
              {profiles?.images?.[0] || profiles?.photos?.[0] ? (
                <Image source={{ uri: profiles.images?.[0] || profiles.photos?.[0] }} style={styles.avatar} />
              ) : (
                <Icon name="person" size={25} color="#FFA821" />
              )}

              <View style={styles.yhLink}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>⇄</Text>
              </View>

              <Image source={{ uri: profile.photos?.[0] }} style={styles.yhAvatar} />
            </View>
          </View>

          <View style={styles.yhBody}>
            <Text style={styles.yhTitle}>You & Her</Text>

            {hasPremiumAccess && compatibility ? (
              <>
                <Text style={styles.yhSub}>
                  You match{" "}
                  <Text style={{ fontWeight: "700" }}>
                    {compatibility?.matchedCount || 0}/{compatibility?.totalChecks || 0}
                  </Text>{" "}
                  of her Preferences
                </Text>

                {(compatibility?.preferenceMatches || []).map((item, i) => (
                  <YHRow
                    key={i}
                    label={item.field}
                    value={item.value}
                    matched={item.matched}
                  />
                ))}

                <Text style={styles.commonTitle}>Common Between the both of you</Text>

                {(compatibility?.commonPoints || []).map((c, i) => (
                  <CommonItem key={i} text={c} />
                ))}

                <TouchableOpacity
                  style={styles.connectBtn}
                  onPress={sendChatInterest}
                >
                  <Text style={styles.connectText}>✔ Connect Now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.yhSub}>
                  Upgrade to see compatibility with {profile?.name}
                </Text>

                <PremiumBtn onPress={() => navigation.navigate("Premium")} />
              </>
            )}
          </View>

        </View>
      </ScrollView>

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <ActionBtn
          title={hasActivePlan ? "Chat Now" : "Upgrade to Chat"}
          onPress={hasActivePlan ? sendChatInterest : () => navigation.navigate("Premium")}
          disabled={!hasActivePlan}
        />

        <ActionBtn
          title={
            interestSent
              ? interestStatus === "accepted"
                ? "✅ Accepted"
                : interestStatus === "rejected"
                  ? "❌ Rejected"
                  : "⏳ Pending"
              : "❤️ Send Interest"
          }
          color={interestSent ? "#999" : "#D4AF37"}
          onPress={sendInterest}
          disabled={interestSent}
        />

        <ActionBtn
          title={isShortlisted ? "Remove Shortlist" : "Add Shortlist"}
          color={isShortlisted ? "#ff4e50" : "#ddd"}
          textColor={isShortlisted ? "#fff" : "#000"}
          onPress={toggleShortlist}
        />
      </View>

      <Footer />

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

/* SMALL COMPONENTS */
const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
  </View>
);

const PremiumBtn = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.premiumBtn}>
    <Text style={styles.premiumText}>Go Premium Now</Text>
  </TouchableOpacity>
);

const CEItem = ({ icon, label, value }) => (
  <View style={styles.ceRow}>
    <View style={styles.ceIconWrap}>
      <Text style={styles.ceIcon}>{icon}</Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.ceLabel}>{label}</Text>
      <View style={styles.ceValueRow}>
        <Text style={styles.ceValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  </View>
);

const YHRow = ({ label, value, matched }) => (
  <View style={styles.yhRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.yhLabel}>{label}</Text>
      <Text style={styles.yhValue}>{value}</Text>
    </View>

    <View style={[styles.yhCheck, { borderColor: matched ? "#4caf50" : "#ccc" }]}>
      <Text style={{ color: matched ? "#4caf50" : "#ccc" }}>✓</Text>
    </View>
  </View>
);

const CommonItem = ({ text }) => (
  <View style={styles.commonRow}>
    <View style={styles.commonIcon}>
      <Text style={{ color: "#fff" }}>✓</Text>
    </View>
    <Text style={styles.commonText}>{text}</Text>
  </View>
);

const ActionBtn = ({ title, onPress, color = "#ff4e50", textColor = "#fff", disabled }) => (
  <TouchableOpacity
    style={[styles.actionBtn, { backgroundColor: color }, disabled && { opacity: 0.6 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={{ color: textColor, fontWeight: "700" }}>{title}</Text>
  </TouchableOpacity>
);

/* STYLES */
const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  sliderWrap: { marginTop: 8 },
  heroImage: { width: width, height: 420, resizeMode: "cover" },
  heroBg: {
    width: width,
    height: 420,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  heroDark: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  heroOverlay: { position: "absolute", bottom: 20, left: 16 },
  heroName: { color: "#fff", fontSize: 22, fontWeight: "700" },
  heroSub: { color: "#eee", marginTop: 4 },
  heroBadges: { flexDirection: "row", marginTop: 6 },
  badge: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
  },

  // ✅ GAP FIX: marginTop removed + marginBottom small
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 5,
    borderRadius: 20,
    padding: 1,
    marginRight:15,
    marginTop:5
  },
  cardTitle: { fontWeight: "700", marginBottom: 8 },
  text: { color: "#555", lineHeight: 22 },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },

  pillRow: { flexDirection: "row", marginBottom: 8, flexWrap: "wrap" },
  pill: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  infoLabel: { color: "#777" },
  infoValue: { fontWeight: "600", maxWidth: "60%", textAlign: "right" },

  premiumBtn: {
    backgroundColor: "#ff4e50",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 12,
  },
  premiumText: { color: "#fff", fontWeight: "700" },

  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 65,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  ceCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
  },
  ceTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: "#222" },
  ceRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  ceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ceIcon: { fontSize: 18 },
  ceLabel: { fontSize: 13, color: "#9a9a9a", marginBottom: 2 },
  ceValueRow: { flexDirection: "row", alignItems: "center" },
  ceValue: { fontSize: 14, color: "#222", fontWeight: "500" },
  ceDivider: { height: 1, backgroundColor: "#eee", marginVertical: 14 },

  yhCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  yhHeader: {
    height: 110,
    backgroundColor: "#fde6cf",
    justifyContent: "center",
    alignItems: "center",
  },
  yhAvatars: { flexDirection: "row", alignItems: "center" },
  yhAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#fff" },
  yhLink: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f4b400",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  yhBody: { padding: 16 },
  yhTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  yhSub: { fontSize: 14, color: "#555", marginBottom: 12 },
  yhRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  yhLabel: { fontSize: 13, color: "#999" },
  yhValue: { fontSize: 14, color: "#222", marginTop: 2 },
  yhCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#ff4e50",
    justifyContent: "center",
    alignItems: "center",
  },

  commonTitle: { marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: "700" },
  commonRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  commonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d4af37",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  commonText: { flex: 1, fontSize: 14, color: "#333" },

  connectBtn: {
    marginTop: 20,
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  connectText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  yhLocked: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  yhLockedText: { fontSize: 14, color: "#555", marginBottom: 10, textAlign: "center" },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderWidth: 2,
    borderColor: "#BFBFBF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
