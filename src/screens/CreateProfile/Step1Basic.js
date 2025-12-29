import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function Step1Basic({ profile, setProfile }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={profile.name}
        onChangeText={(t) => setProfile({ ...profile, name: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={profile.dob}
        onChangeText={(t) => setProfile({ ...profile, dob: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={profile.gender}
        onChangeText={(t) => setProfile({ ...profile, gender: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Height (e.g. 5'7 or 170cm)"
        value={profile.height}
        onChangeText={(t) => setProfile({ ...profile, height: t })}
      />
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
});
