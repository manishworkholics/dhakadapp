import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function Step4EduJob({ profile, setProfile }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professional Details</Text>

      {/* EDUCATION */}
      <TextInput
        style={styles.input}
        placeholder="Education (e.g. B.Tech, MBA)"
        value={profile.education}
        onChangeText={(t) =>
          setProfile({ ...profile, education: t })
        }
      />

      {/* EMPLOYMENT TYPE */}
      <Text style={styles.label}>Employment Type</Text>
      <View style={styles.row}>
        {["Govt", "Private", "Business", "Self Employed"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.chip,
              profile.employmentType === type && styles.chipActive,
            ]}
            onPress={() =>
              setProfile({ ...profile, employmentType: type })
            }
          >
            <Text
              style={[
                styles.chipText,
                profile.employmentType === type && { color: "#fff" },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* OCCUPATION */}
      <TextInput
        style={styles.input}
        placeholder="Occupation / Job Role"
        value={profile.occupation}
        onChangeText={(t) =>
          setProfile({ ...profile, occupation: t })
        }
      />

      {/* ANNUAL INCOME */}
      <Text style={styles.label}>Annual Income</Text>
      <View style={styles.row}>
        {[
          "Below 2 Lakh",
          "2–5 Lakh",
          "5–10 Lakh",
          "10–20 Lakh",
          "20+ Lakh",
        ].map((income) => (
          <TouchableOpacity
            key={income}
            style={[
              styles.chip,
              profile.annualIncome === income && styles.chipActive,
            ]}
            onPress={() =>
              setProfile({ ...profile, annualIncome: income })
            }
          >
            <Text
              style={[
                styles.chipText,
                profile.annualIncome === income && { color: "#fff" },
              ]}
            >
              {income}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
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
    marginBottom: 14,
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
});
