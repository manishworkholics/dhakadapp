import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Step4EduJob({ profile, setProfile }) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ✅ Fixed Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Professional Details</Text>
          <Text style={styles.subTitle}>Education, job and income details</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* EDUCATION */}
          <Text style={styles.label}>Education</Text>
          <TextInput
            style={styles.input}
            placeholder="Education (e.g. B.Tech, MBA)"
            placeholderTextColor="#999"
            value={profile.education}
            onChangeText={(t) => setProfile({ ...profile, education: t })}
          />

          {/* EMPLOYMENT TYPE */}
          <Text style={[styles.label, { marginTop: 6 }]}>Employment Type</Text>
          <View style={styles.row}>
            {["Govt", "Private", "Business", "Self Employed"].map((type) => {
              const active = profile.employmentType === type;
              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.9}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setProfile({ ...profile, employmentType: type })}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* OCCUPATION */}
          <Text style={styles.label}>Occupation / Job Role</Text>
          <TextInput
            style={styles.input}
            placeholder="Occupation (e.g. Teacher, Engineer)"
            placeholderTextColor="#999"
            value={profile.occupation}
            onChangeText={(t) => setProfile({ ...profile, occupation: t })}
          />

          {/* ANNUAL INCOME */}
          <Text style={[styles.label, { marginTop: 6 }]}>Annual Income</Text>
          <View style={styles.row}>
            {["Below 2 Lakh", "2–5 Lakh", "5–10 Lakh", "10–20 Lakh", "20+ Lakh"].map(
              (income) => {
                const active = profile.annualIncome === income;
                return (
                  <TouchableOpacity
                    key={income}
                    activeOpacity={0.9}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setProfile({ ...profile, annualIncome: income })}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {income}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {/* ✅ bottom space for fixed Continue/Back from parent screen */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
  subTitle: { marginTop: 4, color: "#777", fontWeight: "600" },

  container: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 20,
  },

  label: { fontWeight: "800", marginBottom: 8, color: "#111", marginTop: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    color: "#111",
    marginBottom: 14,
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
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },
  chipText: { fontWeight: "800", color: "#111" },
  chipTextActive: { color: "#fff" },
});
