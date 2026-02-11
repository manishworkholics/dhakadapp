import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Step3Religion({ profile, setProfile }) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ✅ FIXED HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Personal & Religious Details</Text>
        </View>

        {/* ✅ SCROLL ONLY CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* HEIGHT */}
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5ft 6in"
            value={profile.height}
            onChangeText={(t) => setProfile({ ...profile, height: t })}
          />

          {/* PHYSICAL STATUS */}
          <Text style={styles.label}>Physical Status</Text>
          <View style={styles.row}>
            {["Normal", "Physically Challenged"].map((v) => (
              <TouchableOpacity
                key={v}
                activeOpacity={0.9}
                style={[
                  styles.chip,
                  profile.physicalStatus === v && styles.chipActive,
                ]}
                onPress={() => setProfile({ ...profile, physicalStatus: v })}
              >
                <Text
                  style={[
                    styles.chipText,
                    profile.physicalStatus === v && styles.chipTextActive,
                  ]}
                >
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* MARITAL STATUS */}
          <Text style={styles.label}>Marital Status</Text>
          <View style={styles.column}>
            {[
              "Never married",
              "Previously Married (Divorced)",
              "Previously Married (Widowed)",
              "Currently Separated",
              "Legally Separated / Awaiting Divorce",
              "Single Parent (Divorced/Widowed)",
            ].map((v) => (
              <TouchableOpacity
                key={v}
                activeOpacity={0.9}
                style={[
                  styles.option,
                  profile.maritalStatus === v && styles.optionActive,
                ]}
                onPress={() => setProfile({ ...profile, maritalStatus: v })}
              >
                <Text
                  style={[
                    styles.optionText,
                    profile.maritalStatus === v && styles.optionTextActive,
                  ]}
                >
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* RELIGION */}
          <Text style={styles.label}>Religion</Text>
          <View style={styles.row}>
            {["Hinduism", "Islam", "Sikh", "Christianity"].map((r) => (
              <TouchableOpacity
                key={r}
                activeOpacity={0.9}
                style={[styles.chip, profile.religion === r && styles.chipActive]}
                onPress={() => setProfile({ ...profile, religion: r })}
              >
                <Text
                  style={[
                    styles.chipText,
                    profile.religion === r && styles.chipTextActive,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CASTE */}
          <Text style={styles.label}>Caste</Text>
          <TextInput
            style={styles.input}
            placeholder="Caste"
            value={profile.caste}
            onChangeText={(t) => setProfile({ ...profile, caste: t })}
          />

          {/* SUB CASTE */}
          <Text style={styles.label}>Sub Caste</Text>
          <TextInput
            style={styles.input}
            placeholder="Sub-Caste"
            value={profile.subCaste}
            onChangeText={(t) => setProfile({ ...profile, subCaste: t })}
          />

          {/* GOTRA */}
          <Text style={styles.label}>Gotra</Text>
          <TextInput
            style={styles.input}
            placeholder="Gotra"
            value={profile.gotra}
            onChangeText={(t) => setProfile({ ...profile, gotra: t })}
          />

          {/* ✅ bottom space for fixed buttons (Back/Continue) */}
          <View style={{ height: 110 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },

  /* ✅ FIXED HEADER */
  header: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  container: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 20,
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 12,
    color: "#111",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },

  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  column: { marginBottom: 10 },

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

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  optionActive: { backgroundColor: "#ff4e50", borderColor: "#ff4e50" },
  optionText: { fontWeight: "700", color: "#222" },
  optionTextActive: { color: "#fff" },
});
