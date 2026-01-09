import React, { useEffect, useState } from "react";
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
  ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProfile } from "../context/ProfileContext";
const API_URL = "http://143.110.244.163:5000/api";
const { width } = Dimensions.get("window");

export default function ProfileDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const {
    hasActivePlan,
    hasFeature,
    userPlan,
  } = useProfile();
  const [interestSent, setInterestSent] = useState(false);
  const [chatInterestSent, setChatInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${API_URL}/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.profile);
      } catch (err) {
        console.log("PROFILE ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);


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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header title={profile.name} onMenuPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        {/* ================= IMAGE SLIDER ================= */}
        <View style={styles.sliderWrap}>
          <FlatList
            data={profile.photos || []}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ImageBackground
                source={{ uri: item }}
                style={styles.heroBg}
                blurRadius={18}
              >
                <View style={styles.heroDark} />

                <Image
                  source={{ uri: item }}
                  style={styles.heroImage}
                  resizeMode="contain"
                />
              </ImageBackground>
            )}

          />

          <View style={styles.heroOverlay}>
            <Text style={styles.heroName}>{profile.name}</Text>

            <Text style={styles.heroSub}>
              {calculateAge(profile.dob)} yrs, {profile.height} •{" "}
              {profile.occupation}
            </Text>
            <Text style={styles.heroSub}>
              {profile.motherTongue}, {profile.caste} • {profile.location}
            </Text>

            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <Text>🟢 1d ago</Text>
              </View>
              <View style={styles.badge}>
                <Text>👫 You & Her</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= ABOUT ================= */}
        <Card title="About">
          <Text style={styles.text}>
            {profile.aboutYourself || "Not mentioned"}
          </Text>
        </Card>

        {/* ================= HOBBIES ================= */}
        <Card title="Hobbies & Interests">
          <View style={styles.chipsWrap}>
            {(profile.hobbies || "")
              .split(/\n|,/)
              .map((h, i) => (
                <View key={i} style={styles.chip}>
                  <Text>{h.trim()}</Text>
                </View>
              ))}
          </View>
        </Card>

        {/* ================= BASIC DETAILS ================= */}
        <Card title="Basic Details">
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text>Created by Self</Text>
            </View>
            <View style={styles.pill}>
              <Text>ID: SHXXXX</Text>
            </View>
          </View>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text>{calculateAge(profile.dob)} yrs</Text>
            </View>
            <View style={styles.pill}>
              <Text>Height: {profile.height}</Text>
            </View>
          </View>

          <InfoRow
            label="Birth Date"
            value={
              hasActivePlan
                ? new Date(profile.dob).toDateString()
                : "**/**/**** 🔒"
            }
          />

          <InfoRow label="Marital Status" value={profile.maritalStatus} />
          <InfoRow label="Lives in" value={profile.location} />
          <InfoRow
            label="Religion & Mother Tongue"
            value={`${profile.religion}, ${profile.motherTongue}`}
          />
          <InfoRow label="Community" value={profile.caste} />
          <InfoRow label="Diet Preferences" value={profile.diet} />

          <PremiumBtn />
        </Card>

        {/* ================= CONTACT DETAILS ================= */}
        <Card title="Contact Details">
          {hasFeature("Privacy Controls") ? (
            <>
              <InfoRow label="Contact No." value={profile.phone || "Not available"} />
              <InfoRow label="Email ID" value={profile.email || "Not available"} />
            </>
          ) : (
            <>
              <InfoRow label="Contact No." value="+91********** 🔒" />
              <InfoRow label="Email ID" value="********@gmail.com 🔒" />
              <PremiumBtn />
            </>
          )}
        </Card>


        {/* ================= FAMILY CTA ================= */}
        <View style={styles.familyCard}>
          <Text style={styles.familyTitle}>Add your details</Text>
          <Text>to see {profile.name} family details</Text>
          <TouchableOpacity style={styles.familyBtn}>
            <Text>Add Now</Text>
          </TouchableOpacity>
        </View>

        {/* ================= CAREER ================= */}
        <View style={styles.ceCard}>
          <Text style={styles.ceTitle}>Career & Education</Text>

          <CEItem
            icon="🏢"
            label="Company Name"
            value={
              hasFeature("Verified Profile")
                ? profile.employmentType || "Not available"
                : "****************"
            }
            locked={!hasFeature("Verified Profile")}
          />




          <CEItem
            icon="💰"
            label="Annual Income"
            value={profile.annualIncome}
          />

          <CEItem
            icon="🎓"
            label="Highest Qualification"
            value={profile.educationDetails}
          />

          <CEItem
            icon="📚"
            label="Education Field"
            value={profile.educationField || "Science"}
          />



          <CEItem
            icon="🏫"
            label="College Name"
            value={
              hasFeature("Verified Profile")
                ? profile.occupation || "Not available"
                : "****************"
            }
            locked={!hasFeature("Verified Profile")}
          />

          {/* Divider */}
          <View style={styles.ceDivider} />

          {/* <Text style={styles.unlockText}>
            To unlock Contact No. & Email ID
          </Text>

          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>Go Premium Now</Text>
          </TouchableOpacity> */}

          {hasFeature("Best Matches") ? (
            <View style={styles.yhCard}>
              {/* existing You & Her UI */}
            </View>
          ) : (
            <View style={styles.yhLocked}>
              <Text style={styles.yhLockedText}>
                Upgrade to see compatibility with {profile.name}
              </Text>
              <PremiumBtn />
            </View>
          )}


         

        </View>





        {/* ================= YOU & HER ================= */}
        <View style={styles.yhCard}>
          {/* Top curved header */}
          <View style={styles.yhHeader}>
            <View style={styles.yhAvatars}>
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                style={styles.yhAvatar}
              />
              <View style={styles.yhLink}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>⇄</Text>
              </View>
              <Image
                source={{ uri: profile.photos?.[0] }}
                style={styles.yhAvatar}
              />
            </View>
          </View>

          {/* Body */}
          <View style={styles.yhBody}>
            <Text style={styles.yhTitle}>You & Her</Text>
            <Text style={styles.yhSub}>
              You match <Text style={{ fontWeight: "700" }}>7/7</Text> of her Preferences
            </Text>

            {/* Preference rows */}
            <YHRow label="Age" value="23 to 28" />
            <YHRow label="Height" value={`4'5" (134cm) to 5'5" (165cm)`} />
            <YHRow label="Marital Status" value="Never Married" />
            <YHRow
              label="Religion / Community"
              value="Hindu: Brahmin - Other, Hindu: Brahmin..."
              more
            />
            <YHRow label="Mother Tongue" value="Hindi, English" />
            <YHRow
              label="Country Living in"
              value="Australia, Canada, India, USA"
            />
            <YHRow label="Annual Income" value="Above INR 4 Lakh, AUD 40k" />

            {/* Common section */}
            <Text style={styles.commonTitle}>
              Common Between the both of you
            </Text>

            <CommonItem text="She too has a Bachelor’s degree" />
            <CommonItem text="She too is from the hindi community" />
            <CommonItem text="Check your Astro compatibility with Her" arrow />

            {/* Button */}
            <TouchableOpacity style={styles.connectBtn}>
              <Text style={styles.connectText}>✔ Connect Now</Text>
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>




      {/* ================= ACTION BAR ================= */}
      <View style={styles.actionBar}>
        <ActionBtn
          title={hasActivePlan ? "Chat Now" : "Upgrade to Chat"}
          onPress={
            hasActivePlan
              ? sendChatInterest
              : () => navigation.navigate("Plans")
          }
          disabled={!hasActivePlan}
        />


        <ActionBtn
          title={interestSent ? "Interest Sent ✓" : "Send Interest"}
          color="#D4AF37"
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
    </SafeAreaView>
  );
}

/* ================= SMALL COMPONENTS ================= */
const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PremiumBtn = () => (
  <TouchableOpacity style={styles.premiumBtn}>
    <Text style={styles.premiumText}>Go Premium Now</Text>
  </TouchableOpacity>
);

const CEItem = ({ icon, label, value, locked }) => (
  <View style={styles.ceRow}>
    <View style={styles.ceIconWrap}>
      <Text style={styles.ceIcon}>{icon}</Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.ceLabel}>{label}</Text>
      <View style={styles.ceValueRow}>
        <Text style={styles.ceValue}>{value}</Text>
        {locked && <Text style={styles.lockIcon}> 🔒</Text>}
      </View>
    </View>
  </View>
);

const YHRow = ({ label, value, more }) => (
  <View style={styles.yhRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.yhLabel}>{label}</Text>
      <Text style={styles.yhValue}>
        {value} {more && <Text style={{ color: "#ff4e50" }}>More</Text>}
      </Text>
    </View>

    <View style={styles.yhCheck}>
      <Text style={{ color: "#ff4e50", fontWeight: "700" }}>✓</Text>
    </View>
  </View>
);

const CommonItem = ({ texting, text, arrow }) => (
  <View style={styles.commonRow}>
    <View style={styles.commonIcon}>
      <Text style={{ color: "#fff" }}>✓</Text>
    </View>
    <Text style={styles.commonText}>{text}</Text>
    {arrow && <Text style={{ color: "#999" }}>›</Text>}
  </View>
);


const ActionBtn = ({
  title,
  onPress,
  color = "#ff4e50",
  textColor = "#fff",
  disabled,
}) => (
  <TouchableOpacity
    style={[
      styles.actionBtn,
      { backgroundColor: color },
      disabled && { opacity: 0.6 },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={{ color: textColor, fontWeight: "700" }}>{title}</Text>
  </TouchableOpacity>
);


/* ================= STYLES ================= */
const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  sliderWrap: { marginTop: 8 },
  heroImage: {
    width: width,
    height: 420,
    resizeMode: "cover",
  },
  heroBg: {
    width: width,
    height: 420,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  heroDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  heroOverlay: {
    position: "absolute",
    bottom: 20,
    left: 16,
  },
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

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
  },
  cardTitle: { fontWeight: "700", marginBottom: 10 },

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

  pillRow: { flexDirection: "row", marginBottom: 8 },
  pill: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  infoLabel: { color: "#777" },
  infoValue: { fontWeight: "600" },

  premiumBtn: {
    backgroundColor: "#ff4e50",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 12,
  },
  premiumText: { color: "#fff", fontWeight: "700" },

  familyCard: {
    backgroundColor: "#d4af37",
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  familyTitle: { fontWeight: "700", marginBottom: 6 },
  familyBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },

  connectMainBtn: {
    backgroundColor: "#ff4e50",
    marginTop: 16,
    padding: 14,
    borderRadius: 28,
    alignItems: "center",
  },

  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 65, // footer height
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
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
  },

  ceTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },

  ceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  ceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  ceIcon: {
    fontSize: 18,
  },

  ceLabel: {
    fontSize: 13,
    color: "#9a9a9a",
    marginBottom: 2,
  },

  ceValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ceValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },

  lockIcon: {
    fontSize: 14,
    color: "#999",
  },

  ceDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },

  unlockText: {
    textAlign: "center",
    color: "#777",
    fontSize: 13,
    marginBottom: 10,
  },

  premiumBtn: {
    alignSelf: "center",
    backgroundColor: "#ff4e50",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
  },

  premiumBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },



  yhCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  yhHeader: {
    height: 110,
    backgroundColor: "#fde6cf",
    justifyContent: "center",
    alignItems: "center",
  },

  yhAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },

  yhAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },

  yhLink: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f4b400",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },

  yhBody: {
    padding: 16,
  },

  yhTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  yhSub: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },

  yhRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  yhLabel: {
    fontSize: 13,
    color: "#999",
  },

  yhValue: {
    fontSize: 14,
    color: "#222",
    marginTop: 2,
  },

  yhCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#ff4e50",
    justifyContent: "center",
    alignItems: "center",
  },

  commonTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
  },

  commonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  commonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d4af37",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  commonText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  connectBtn: {
    marginTop: 20,
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },

  connectText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
yhLocked: {
  backgroundColor: "#fff",
  margin: 16,
  padding: 20,
  borderRadius: 20,
  alignItems: "center",
},
yhLockedText: {
  fontSize: 14,
  color: "#555",
  marginBottom: 10,
  textAlign: "center",
},

});
