import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function Step2Location({ profile, setProfile }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Location (City, State)"
        value={profile.location}
        onChangeText={(t) => setProfile({ ...profile, location: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Mother Tongue"
        value={profile.motherTongue}
        onChangeText={(t) => setProfile({ ...profile, motherTongue: t })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22,justifyContent:"center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 14 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginBottom: 12 },
});
