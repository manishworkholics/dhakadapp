import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function Step3Religion({ profile, setProfile }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal & Religious Details</Text>

      {/* HEIGHT */}
      <Text style={styles.label}>Height</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 5ft 6in"
        value={profile.height}
        onChangeText={(t) =>
          setProfile({ ...profile, height: t })
        }
      />

      {/* PHYSICAL STATUS */}
      <Text style={styles.label}>Physical Status</Text>
      <View style={styles.row}>
        {["Normal", "Physically Challenged"].map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.chip,
              profile.physicalStatus === v && styles.chipActive,
            ]}
            onPress={() =>
              setProfile({ ...profile, physicalStatus: v })
            }
          >
            <Text
              style={[
                styles.chipText,
                profile.physicalStatus === v && { color: "#fff" },
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
            style={[
              styles.option,
              profile.maritalStatus === v && styles.optionActive,
            ]}
            onPress={() =>
              setProfile({ ...profile, maritalStatus: v })
            }
          >
            <Text
              style={[
                styles.optionText,
                profile.maritalStatus === v && { color: "#fff" },
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
            style={[
              styles.chip,
              profile.religion === r && styles.chipActive,
            ]}
            onPress={() =>
              setProfile({ ...profile, religion: r })
            }
          >
            <Text
              style={[
                styles.chipText,
                profile.religion === r && { color: "#fff" },
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CASTE */}
      <TextInput
        style={styles.input}
        placeholder="Caste"
        value={profile.caste}
        onChangeText={(t) =>
          setProfile({ ...profile, caste: t })
        }
      />

      {/* SUB CASTE */}
      <TextInput
        style={styles.input}
        placeholder="Sub-Caste"
        value={profile.subCaste}
        onChangeText={(t) =>
          setProfile({ ...profile, subCaste: t })
        }
      />

      {/* GOTRA */}
      <TextInput
        style={styles.input}
        placeholder="Gotra"
        value={profile.gotra}
        onChangeText={(t) =>
          setProfile({ ...profile, gotra: t })
        }
      />
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
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  column: {
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

  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },

  optionActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  optionText: {
    fontWeight: "600",
  },
});
