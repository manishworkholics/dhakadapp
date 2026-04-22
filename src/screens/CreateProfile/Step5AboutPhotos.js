import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

export default function Step5AboutPhotos({ profile, setProfile, submit, onBack }) {
  const [uploading, setUploading] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(null);

  // ✅ only dropdown states added
  const [showFamilyStatusDropdown, setShowFamilyStatusDropdown] = React.useState(false);
  const [showDietDropdown, setShowDietDropdown] = React.useState(false);

  const familyStatusOptions = [
    "Middle class",
    "Upper middle class",
    "Rich / Affluent (Elite)",
  ];

  const dietOptions = [
    "Veg",
    "Nonveg",
    "Vegan",
    "Occasionally Non-Veg",
  ];

  /* ================= UPLOAD IMAGE (SAME) ================= */
  const uploadImage = async (imageUri) => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    const res = await axios.post(
      "http://143.110.244.163:5000/api/upload-image",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.url;
  };

  /* ================= PICK IMAGE (SAME) ================= */
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
    });

    if (!result?.assets?.[0]?.uri) return;

    try {
      setUploading(true);

      const uploadedUrl = await uploadImage(result.assets[0].uri);

      setProfile((prev) => {
        const remainingPhotos = prev.photos.filter((p) => p !== uploadedUrl);
        return { ...prev, photos: [uploadedUrl, ...remainingPhotos] };
      });
    } catch (err) {
      console.log("Upload error:", err.message);
      Alert.alert("Upload Failed", "Unable to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => {
            setShowFamilyStatusDropdown(false);
            setShowDietDropdown(false);
          }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Additional Details</Text>
          </View>

          {/* CONTENT */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* FAMILY STATUS */}
            <Text style={styles.label}>Family Status</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.dropdownHeader}
                onPress={() => {
                  setShowDietDropdown(false);
                  setShowFamilyStatusDropdown(!showFamilyStatusDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownHeaderText,
                    !profile.familyStatus && styles.dropdownPlaceholder,
                  ]}
                >
                  {profile.familyStatus || "Select"}
                </Text>
                <Icon
                  name={showFamilyStatusDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>

              {showFamilyStatusDropdown && (
                <View style={styles.dropdownList}>
                  {familyStatusOptions.map((v, index) => {
                    const isSelected = profile.familyStatus === v;
                    return (
                      <TouchableOpacity
                        key={v}
                        activeOpacity={0.9}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                          index === familyStatusOptions.length - 1 && styles.dropdownItemLast,
                        ]}
                        onPress={() => {
                          setProfile({ ...profile, familyStatus: v });
                          setShowFamilyStatusDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {v}
                        </Text>
                        {isSelected && (
                          <Icon name="checkmark" size={18} color="#ff4e50" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>


// 🔥 FAMILY DETAILS START

            <Text style={[styles.label, { marginTop: 18 }]}>Family Details</Text>

            <Text style={styles.label}>Mama Gotra</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mama Gotra"
              value={profile.mamaGotra}
              onChangeText={(t) => setProfile({ ...profile, mamaGotra: t })}
            />

            <Text style={styles.label}>Father Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Father Name"
              value={profile.fatherName}
              onChangeText={(t) => setProfile({ ...profile, fatherName: t })}
            />

            <Text style={styles.label}>Mother Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mother Name"
              value={profile.motherName}
              onChangeText={(t) => setProfile({ ...profile, motherName: t })}
            />

            <Text style={styles.label}>Father Contact No</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Father Contact Number"
              keyboardType="phone-pad"
              value={profile.fatherContactNo}
              onChangeText={(t) => setProfile({ ...profile, fatherContactNo: t })}
            />

            <Text style={styles.label}>Father Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Father Status"
              value={profile.fatherStatus}
              onChangeText={(t) => setProfile({ ...profile, fatherStatus: t })}
            />

            <Text style={styles.label}>Father Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Father Occupation"
              value={profile.fatherOccupation}
              onChangeText={(t) => setProfile({ ...profile, fatherOccupation: t })}
            />

            <Text style={styles.label}>Mother Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mother Status"
              value={profile.motherStatus}
              onChangeText={(t) => setProfile({ ...profile, motherStatus: t })}
            />

            <Text style={styles.label}>Mother Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mother Occupation"
              value={profile.motherOccupation}
              onChangeText={(t) => setProfile({ ...profile, motherOccupation: t })}
            />

            <Text style={styles.label}>No of Brothers</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Number of Brothers"
              keyboardType="numeric"
              value={profile.noOfBrothers?.toString()}
              onChangeText={(t) =>
                setProfile({ ...profile, noOfBrothers: t })
              }
            />

            <Text style={styles.label}>No of Sisters</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Number of Sisters"
              keyboardType="numeric"
              value={profile.noOfSisters?.toString()}
              onChangeText={(t) =>
                setProfile({ ...profile, noOfSisters: t })
              }
            />

// 🔥 FAMILY DETAILS END

            {/* DIET */}
            <Text style={styles.label}>Diet</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.dropdownHeader}
                onPress={() => {
                  setShowFamilyStatusDropdown(false);
                  setShowDietDropdown(!showDietDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownHeaderText,
                    !profile.diet && styles.dropdownPlaceholder,
                  ]}
                >
                  {profile.diet || "Select"}
                </Text>
                <Icon
                  name={showDietDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>

              {showDietDropdown && (
                <View style={styles.dropdownList}>
                  {dietOptions.map((v, index) => {
                    const isSelected = profile.diet === v;
                    return (
                      <TouchableOpacity
                        key={v}
                        activeOpacity={0.9}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                          index === dietOptions.length - 1 && styles.dropdownItemLast,
                        ]}
                        onPress={() => {
                          setProfile({ ...profile, diet: v });
                          setShowDietDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {v}
                        </Text>
                        {isSelected && (
                          <Icon name="checkmark" size={18} color="#ff4e50" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* ABOUT */}
            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, styles.textAreaLg]}
              placeholder="A few words about yourself"
              multiline
              value={profile.aboutYourself}
              placeholderTextColor="#777"
              onChangeText={(t) => setProfile({ ...profile, aboutYourself: t })}
            />

            {/* HOBBIES */}
            <Text style={styles.label}>Hobbies</Text>
            <TextInput
              style={[styles.input, styles.textAreaSm]}
              placeholder="Hobbies (e.g. music, travel, fitness)"
              multiline
              value={profile.hobbies}
              placeholderTextColor="#777"
              onChangeText={(t) => setProfile({ ...profile, hobbies: t })}
            />

            {/* PHOTO PREVIEW */}
            <Text style={styles.label}>Profile Photo</Text>
            <View style={styles.photoRow}>
              {profile.photos.length > 0 ? (
                <TouchableOpacity onPress={() => setPreviewImage(profile.photos[0])} activeOpacity={0.9}>
                  <Image source={{ uri: profile.photos[0] }} style={styles.photo} />
                </TouchableOpacity>
              ) : (
                <View style={styles.emptyPhoto}>
                  <Icon name="image-outline" size={28} color="#888" />
                  <Text style={styles.emptyPhotoText}>No photo selected</Text>
                </View>
              )}
            </View>

            {/* PHOTO BUTTON */}
            <TouchableOpacity
              style={[styles.photoBtn, uploading && { opacity: 0.7 }]}
              onPress={pickImage}
              disabled={uploading}
              activeOpacity={0.9}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.photoBtnText}>
                  {profile.photos.length ? "Change Profile Photo" : "Select Profile Photo"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>

        {/* BOTTOM ACTIONS (ALWAYS VISIBLE) */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.submitBtn} onPress={submit} activeOpacity={0.9}>
            <Text style={styles.submitText}>Submit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* FULLSCREEN PREVIEW */}
        {previewImage && (
          <TouchableOpacity
            style={styles.previewContainer}
            onPress={() => setPreviewImage(null)}
            activeOpacity={1}
          >
            <Image source={{ uri: previewImage }} style={styles.previewImage} />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: "#f5f5f5",
  },

  title: { fontSize: 22, fontWeight: "800", color: "#111" },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 202,
  },

  label: { fontWeight: "700", marginBottom: 6, color: "#111" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },

  textAreaLg: { height: 110 },
  textAreaSm: { height: 90 },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 10,
  },

  chipActive: { backgroundColor: "#ff4e50", borderColor: "#ff4e50" },
  chipText: { fontWeight: "700", color: "#222" },
  chipTextActive: { color: "#fff" },

  // ✅ only dropdown styles added
  dropdownContainer: {
    marginBottom: 12,
  },

  dropdownHeader: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownHeaderText: {
    flex: 1,
    color: "#111",
    fontSize: 15,
    fontWeight: "500",
    paddingRight: 10,
  },

  dropdownPlaceholder: {
    color: "#777",
    fontWeight: "400",
  },

  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  dropdownItemSelected: {
    backgroundColor: "#fff5f5",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
    flex: 1,
    paddingRight: 10,
  },

  dropdownItemTextSelected: {
    color: "#ff4e50",
    fontWeight: "700",
  },

  photoRow: { flexDirection: "row", marginBottom: 10 },

  photo: { width: 110, height: 110, borderRadius: 12, backgroundColor: "#eee" },

  emptyPhoto: {
    width: 160,
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyPhotoText: { color: "#888", fontWeight: "600", fontSize: 12, marginTop: 6 },

  photoBtn: {
    backgroundColor: "#555",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 2,
  },

  photoBtnText: { color: "#fff", fontWeight: "700" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e9e9e9",
    flexDirection: "row",
    alignItems: "center",
  },

  backAction: {
    flex: 1,
    flexBasis: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: "center",
    marginRight: 12,
  },

  backActionText: { color: "#ff4e50", fontWeight: "800" },

  submitBtn: {
    flex: 1.3,
    flexBasis: 0,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 100
  },

  submitText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  previewContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  previewImage: { width: "100%", height: "80%", resizeMode: "contain" },
});