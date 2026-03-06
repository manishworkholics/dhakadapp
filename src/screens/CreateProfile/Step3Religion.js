import React, { useEffect, useState } from "react";
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
import Icon from "react-native-vector-icons/Ionicons";

const subCasteOptions = [
  "Dhakad",
  "Dhakar",
  "Dhaker",
  "Nagar",
  "Malav",
  "Kirar",
  "Kirat",
];

export default function Step3Religion({ profile, setProfile }) {
  const [showSubCasteDropdown, setShowSubCasteDropdown] = useState(false);

  useEffect(() => {
    const updates = {};

    if (!profile?.religion) {
      updates.religion = "Hinduism";
    }

    if (!profile?.caste) {
      updates.caste = "Dhakad";
    }

    if (!profile?.subCaste) {
      updates.subCaste = "Dhakad";
    }

    if (Object.keys(updates).length > 0) {
      setProfile({ ...profile, ...updates });
    }
  }, []);

  const handleSelectSubCaste = (value) => {
    setProfile({ ...profile, subCaste: value });
    setShowSubCasteDropdown(false);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Personal & Religious Details</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEIGHT */}
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5ft 6in"
            value={profile.height}
            placeholderTextColor="#777"
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

          {/* CASTE */}
          <Text style={styles.label}>Caste</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={profile.caste || "Dhakad"}
            editable={false}
            placeholderTextColor="#777"
          />

          {/* SUB CASTE CUSTOM DROPDOWN */}
          <Text style={styles.label}>Sub Caste</Text>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.dropdownHeader}
              onPress={() => setShowSubCasteDropdown(!showSubCasteDropdown)}
            >
              <Text style={styles.dropdownHeaderText}>
                {profile.subCaste || "Select Sub Caste"}
              </Text>
              <Icon
                name={showSubCasteDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>

            {showSubCasteDropdown && (
              <View style={styles.dropdownList}>
                {subCasteOptions.map((item) => {
                  const isSelected = profile.subCaste === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.85}
                      style={[
                        styles.dropdownItem,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      onPress={() => handleSelectSubCaste(item)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>

                      {isSelected && (
                        <Icon name="checkmark" size={18} color="#ff4e50" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* GOTRA */}
          <Text style={styles.label}>Gotra</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Gotra"
            value={profile.gotra}
            placeholderTextColor="#777"
            onChangeText={(t) => setProfile({ ...profile, gotra: t })}
          />

          <View style={{ height: 110 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

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
    color: "#111",
  },

  disabledInput: {
    backgroundColor: "#f1f1f1",
    color: "#555",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  column: {
    marginBottom: 10,
  },

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

  chipActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  chipText: {
    fontWeight: "700",
    color: "#222",
  },

  chipTextActive: {
    color: "#fff",
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  optionActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  optionText: {
    fontWeight: "700",
    color: "#222",
  },

  optionTextActive: {
    color: "#fff",
  },

  dropdownContainer: {
    marginTop: 2,
    marginBottom: 4,
  },

  dropdownHeader: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownHeaderText: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },

  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    backgroundColor: "#fff",
    overflow: "hidden",
    top: -10,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownItemSelected: {
    backgroundColor: "#fff5f5",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },

  dropdownItemTextSelected: {
    color: "#ff4e50",
    fontWeight: "700",
  },
});