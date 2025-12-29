import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function Step3Religion({ profile, setProfile }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Religion & Caste</Text>

      <TextInput
        style={styles.input}
        placeholder="Religion"
        value={profile.religion}
        onChangeText={(t) => setProfile({ ...profile, religion: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Caste"
        value={profile.cast}
        onChangeText={(t) => setProfile({ ...profile, cast: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Sub-Caste"
        value={profile.subCast}
        onChangeText={(t) => setProfile({ ...profile, subCast: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Gotra"
        value={profile.gotra}
        onChangeText={(t) => setProfile({ ...profile, gotra: t })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22,justifyContent:"center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 14 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginBottom: 12 },
});
