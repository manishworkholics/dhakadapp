import React from "react";
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

/* 🔹 SECTION WRAPPER */
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

/* 🔹 INFO ROW */
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

/* 🔹 PROFILE OPTION CARD (WEBSITE TABS → MOBILE) */
const ProfileNavCard = ({ title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.navCard} onPress={onPress}>
    <View>
      <Text style={styles.navTitle}>{title}</Text>
      {subtitle ? <Text style={styles.navSub}>{subtitle}</Text> : null}
    </View>
    <Text style={styles.navArrow}>›</Text>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header
        title="My Profile"
        onMenuPress={() => navigation.openDrawer()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 PROFILE HEADER */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
            style={styles.profileImg}
          />
          <Text style={styles.name}>Sujal Prajapati</Text>
          <Text style={styles.subText}>
            29 yrs • Hindu • Web Developer
          </Text>
          <Text style={styles.profileId}>
            Profile ID: 6948e8ff770cf88ab8095572
          </Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("ImageGallery")}
          >
            <Text style={styles.editText}>Edit Photo</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 IMAGE GALLERY */}
        <Section title="Image Gallery">
          <View style={styles.galleryRow}>
            <Image
              style={styles.galleryImg}
              source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
            />
            <TouchableOpacity
              style={styles.addPhoto}
              onPress={() => navigation.navigate("ImageGallery")}
            >
              <Text style={{ fontSize: 28, color: "#999" }}>+</Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* 🔹 PERSONAL INFO */}
        <Section title="Personal Information">
          <InfoRow label="Gender" value="Male" />
          <InfoRow label="Marital Status" value="Never Married" />
          <InfoRow label="Physical Status" value="Normal" />
        </Section>

        {/* 🔹 RELIGION */}
        <Section title="Religion & Culture">
          <InfoRow label="Religion" value="Hinduism" />
          <InfoRow label="Gotra" value="Malav" />
          <InfoRow label="Mother Tongue" value="Hindi" />
        </Section>

        {/* 🔹 PROFESSIONAL */}
        <Section title="Professional Information">
          <InfoRow label="Occupation" value="Web Developer" />
          <InfoRow label="Employment Type" value="Private Sector" />
          <InfoRow label="Annual Income" value="₹6,00,000" />
        </Section>

        {/* 🔹 LOCATION */}
        <Section title="Location">
          <InfoRow label="City" value="Indore" />
          <InfoRow label="State" value="Madhya Pradesh" />
        </Section>

        {/* 🔹 PROFILE OPTIONS (WEBSITE PROFILE TABS → MOBILE CARDS) */}
        <Section title="Profile Options">
          <ProfileNavCard
            title="Partner Preferences"
            subtitle="Edit your partner requirements"
            onPress={() => navigation.navigate("PartnerPreference")}
          />

          <ProfileNavCard
            title="Interests"
            subtitle="View interests sent & received"
            onPress={() => navigation.navigate("Interest")}
          />

          <ProfileNavCard
            title="Shortlist"
            subtitle="Profiles you liked"
            onPress={() => navigation.navigate("Shortlist")}
          />

          <ProfileNavCard
            title="My Plan"
            subtitle="View or upgrade your plan"
            onPress={() => navigation.navigate("Plan")}
          />

          <ProfileNavCard
            title="Notifications"
            subtitle="All alerts & updates"
            onPress={() => navigation.navigate("Notification")}
          />
        </Section>

        <View style={{ height: 30 }} />
      </ScrollView>
       <Footer />
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
  },
  profileImg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "700" },
  subText: { color: "#666", marginTop: 4 },
  profileId: { color: "#999", fontSize: 12, marginTop: 4 },

  editBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff4e50",
  },
  editText: { color: "#ff4e50", fontWeight: "600" },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  label: { color: "#666" },
  value: { fontWeight: "600" },

  galleryRow: { flexDirection: "row" },
  galleryImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  addPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  /* 🔹 PROFILE OPTION CARDS */
  navCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  navTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  navSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  navArrow: {
    fontSize: 20,
    color: "#999",
  },
});
