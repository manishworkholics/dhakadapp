import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

export default function Step5AboutPhotos({ profile, setProfile, submit }) {
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
    });

    if (result?.assets && result.assets[0]?.uri) {
      setProfile({
        ...profile,
        photos: [...profile.photos, result.assets[0].uri],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Yourself & Photos</Text>

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Write about yourself..."
        multiline
        value={profile.aboutYourself}
        onChangeText={(t) => setProfile({ ...profile, aboutYourself: t })}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {profile.photos.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{ width: 90, height: 90, borderRadius: 8, margin: 6 }}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
        <Text style={{ color: "#fff" }}>Select From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          Submit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22,justifyContent:"center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
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
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 10,
  },
});