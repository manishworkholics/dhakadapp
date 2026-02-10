import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Step5AboutPhotos({ profile, setProfile, submit }) {

  /* ================= UPLOAD IMAGE ================= */

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

  /* ================= PICK IMAGE ================= */

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
    });

    if (!result?.assets?.[0]?.uri) return;

    try {
      const uploadedUrl = await uploadImage(result.assets[0].uri);

      setProfile((prev) => {
        const remainingPhotos = prev.photos.filter(
          (p) => p !== uploadedUrl
        );

        return {
          ...prev,
          photos: [uploadedUrl, ...remainingPhotos],
        };
      });

    } catch (err) {
      console.log("Upload error:", err.message);
      Alert.alert("Upload Failed", "Unable to upload image");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Additional Details</Text>

        {/* ================= FAMILY STATUS ================= */}
        <Text style={styles.label}>Family Status</Text>
        <View style={styles.row}>
          {["Middle class", "Upper middle class", "Rich / Affluent (Elite)"].map((v) => (
            <TouchableOpacity
              key={v}
              style={[
                styles.chip,
                profile.familyStatus === v && styles.chipActive,
              ]}
              onPress={() =>
                setProfile({ ...profile, familyStatus: v })
              }
            >
              <Text
                style={[
                  styles.chipText,
                  profile.familyStatus === v && { color: "#fff" },
                ]}
              >
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ================= DIET ================= */}
        <Text style={styles.label}>Diet</Text>
        <View style={styles.row}>
          {["Veg", "Nonveg", "Vegan", "Occasionally Non-Veg"].map((v) => (
            <TouchableOpacity
              key={v}
              style={[
                styles.chip,
                profile.diet === v && styles.chipActive,
              ]}
              onPress={() =>
                setProfile({ ...profile, diet: v })
              }
            >
              <Text
                style={[
                  styles.chipText,
                  profile.diet === v && { color: "#fff" },
                ]}
              >
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ================= ABOUT ================= */}
        <TextInput
          style={[styles.input, { height: 110 }]}
          placeholder="A few words about yourself"
          multiline
          value={profile.aboutYourself}
          onChangeText={(t) =>
            setProfile({ ...profile, aboutYourself: t })
          }
        />

        {/* ================= HOBBIES ================= */}
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Hobbies (e.g. music, travel, fitness)"
          multiline
          value={profile.hobbies}
          onChangeText={(t) =>
            setProfile({ ...profile, hobbies: t })
          }
        />

        {/* ================= PHOTO PREVIEW ================= */}
        <Text style={styles.label}>Profile Photo</Text>
        <View style={styles.photoRow}>
          {profile.photos.length > 0 && (
            <Image
              source={{ uri: profile.photos[0] }}
              style={styles.photo}
            />
          )}
        </View>

        {/* ================= PHOTO BUTTON ================= */}
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {profile.photos.length
              ? "Change Profile Photo"
              : "Select Profile Photo"}
          </Text>
        </TouchableOpacity>

        {/* ================= SUBMIT ================= */}
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Submit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  container: {
    flex: 1,
    padding: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  chipActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  chipText: {
    fontWeight: "600",
  },

  photoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  photoBtn: {
    backgroundColor: "#555",
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  submitBtn: {
    backgroundColor: "#FF4D4D",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    
  },

  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
