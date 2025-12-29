import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function Step4EduJob({ profile, setProfile }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Education & Job</Text>

      <TextInput
        style={styles.input}
        placeholder="Education"
        value={profile.education}
        onChangeText={(t) => setProfile({ ...profile, education: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Employment Type (Govt / Private / Business)"
        value={profile.employmentType}
        onChangeText={(t) => setProfile({ ...profile, employmentType: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Occupation (Job Role)"
        value={profile.occupation}
        onChangeText={(t) => setProfile({ ...profile, occupation: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Annual Income (₹ Lakh)"
        value={profile.annualIncome}
        onChangeText={(t) => setProfile({ ...profile, annualIncome: t })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22 ,justifyContent:"center"},
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 14 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginBottom: 12 },
});
