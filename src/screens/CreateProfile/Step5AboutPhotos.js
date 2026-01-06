import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Step5AboutPhotos({ profile, setProfile, submit }) {
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

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
    });

    if (result?.assets?.[0]?.uri) {
      const uploadedUrl = await uploadImage(result.assets[0].uri);
      setProfile({
        ...profile,
        photos: [...profile.photos, uploadedUrl],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Additional Details</Text>

      {/* FAMILY STATUS */}
      <Text style={styles.label}>Family Status</Text>
      <View style={styles.row}>
        {[
          "Middle class",
          "Upper middle class",
          "Rich / Affluent (Elite)",
        ].map((v) => (
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

      {/* DIET */}
      <Text style={styles.label}>Diet</Text>
      <View style={styles.row}>
        {[
          "Veg",
          "Nonveg",
          "Vegan",
          "Occasionally Non-Veg",
        ].map((v) => (
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

      {/* ABOUT */}
      <TextInput
        style={[styles.input, { height: 110 }]}
        placeholder="A few words about yourself"
        multiline
        value={profile.aboutYourself}
        onChangeText={(t) =>
          setProfile({ ...profile, aboutYourself: t })
        }
      />

      {/* HOBBIES */}
      <TextInput
        style={[styles.input, { height: 90 }]}
        placeholder="Hobbies (e.g. music, travel, fitness)"
        multiline
        value={profile.hobbies}
        onChangeText={(t) =>
          setProfile({ ...profile, hobbies: t })
        }
      />

      {/* PHOTOS */}
      <Text style={styles.label}>Profile Photos</Text>
      <View style={styles.photoRow}>
        {profile.photos.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={styles.photo}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Select From Gallery
        </Text>
      </TouchableOpacity>

      {/* SUBMIT */}
      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.submitText}>
          Submit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
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
    flexWrap: "wrap",
    marginBottom: 10,
  },

  photo: {
    width: 90,
    height: 90,
    borderRadius: 8,
    margin: 6,
  },

  photoBtn: {
    backgroundColor: "#555",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },

  submitBtn: {
    backgroundColor: "#FF4D4D",
    padding: 16,
    borderRadius: 40,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
