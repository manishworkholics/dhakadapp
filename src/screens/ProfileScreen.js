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
import { useProfile } from "../context/ProfileContext";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


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
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

/* 🔹 PROFILE OPTION CARD */
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

  const { profile, loading } = useProfile();

  const uploadPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
      });

      if (!result?.assets?.[0]?.uri) return;

      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      // upload image
      const uploadRes = await axios.post(
        "http://143.110.244.163:5000/api/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newUrl = uploadRes.data.url;

      // make first photo primary
      const updatedPhotos = [
        newUrl,
        ...(profile.photos || []).filter((p) => p !== newUrl),
      ];

      // update profile
      await axios.put(
        "http://143.110.244.163:5000/api/profile/update",
        { photos: updatedPhotos },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // update context locally
      profile.photos = updatedPhotos;

    } catch (err) {
      console.log("Upload error", err.response?.data || err.message);
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.center, { padding: 20 }]}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
          Profile not completed
        </Text>

        <Text
          style={{
            color: "#666",
            textAlign: "center",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          Please complete your profile to get better matches and visibility.
        </Text>

        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => navigation.navigate("CreateProfile")}
        >
          <Text style={styles.completeBtnText}>Complete Your Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }


  const InfoBlock = ({ label, value }) => {
    if (!value) return null;

    return (
      <View style={styles.infoBlock}>
        <Text style={styles.blockLabel}>{label}</Text>
        <Text style={styles.blockValue}>{value}</Text>
      </View>
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 70 }}>
      <Header title="My Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 PROFILE HEADER */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: profile.photos?.[0] }}
            style={styles.profileImg}
          />
          <Text style={styles.name}>{profile.name}</Text>

          <Text style={styles.subText}>
            {profile.gender} • {profile.religion} • {profile.occupation}
          </Text>

          <Text style={styles.profileId}>
            Profile ID: {profile._id}
          </Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate("CreateProfile", {
                mode: "edit",
                profile: profile,
              })
            }
          >
            <Text style={styles.editText}>
              {profile.isCompleted ? "Edit Profile" : "Complete Profile"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* 🔹 IMAGE GALLERY */}
        <Section title="Image Gallery">
          <View style={styles.galleryGrid}>

            {profile.photos?.length > 0 ? (
              profile.photos.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.galleryImg}
                />
              ))
            ) : (
              <Text style={{ color: "#888" }}>No photos uploaded</Text>
            )}

            <TouchableOpacity style={styles.addPhoto} onPress={uploadPhoto}>
              <Text style={{ fontSize: 28, color: "#999" }}>+</Text>
            </TouchableOpacity>

          </View>
        </Section>


        {/* 🔹 PERSONAL INFO */}
        <Section title="Personal Information">
          <InfoRow label="Gender" value={profile.gender} />
          <InfoRow label="Date of Birth" value={profile.dob?.split("T")?.[0]} />
          <InfoRow label="Marital Status" value={profile.maritalStatus} />
          <InfoRow label="Physical Status" value={profile.physicalStatus} />
          <InfoRow label="Height" value={profile.height} />
        </Section>


        {/* 🔹 RELIGION */}
        <Section title="Religion & Culture">
          <InfoRow label="Religion" value={profile.religion} />
          <InfoRow label="Caste" value={profile.caste} />
          <InfoRow label="Sub Caste" value={profile.subCaste} />
          <InfoRow label="Gotra" value={profile.gotra} />
          <InfoRow label="Mother Tongue" value={profile.motherTongue} />
        </Section>


        {/* 🔹 PROFESSIONAL */}
        <Section title="Professional Information">
          <InfoRow label="Education" value={profile.educationDetails} />
          <InfoRow label="Employment Type" value={profile.employmentType} />
          <InfoRow label="Occupation" value={profile.occupation} />
          <InfoRow label="Annual Income" value={profile.annualIncome} />
        </Section>


        {/* 🔹 LOCATION */}
        <Section title="Location">
          <InfoRow label="City" value={profile.location} />
        </Section>


        <Section title="Family & Lifestyle">
          <InfoRow label="Family Status" value={profile.familyStatus} />
          <InfoRow label="Diet" value={profile.diet} />
          <InfoRow label="Hobbies" value={profile.hobbies} />
          <InfoBlock label="About Me" value={profile.aboutYourself} />

        </Section>


        {/* 🔹 PROFILE OPTIONS */}
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
            onPress={() => navigation.navigate("Premium")}
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

/* 🎨 STYLES (UNCHANGED) */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

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
  sectionHeader: { marginBottom: 10 },
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

  galleryRow: { flexDirection: "row", flexWrap: "wrap" },
  galleryImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
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

  navCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  navTitle: { fontSize: 15, fontWeight: "600" },
  navSub: { fontSize: 12, color: "#777", marginTop: 2 },
  navArrow: { fontSize: 20, color: "#999" },


  infoBlock: {
    paddingVertical: 8,
  },

  blockLabel: {
    color: "#666",
    fontSize: 13,
    marginBottom: 4,
  },

  blockValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    lineHeight: 20,
  },
  completeBtn: {
    backgroundColor: "#ff4e50",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },

  completeBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  galleryImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  addPhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

});
