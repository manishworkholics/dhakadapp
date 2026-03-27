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

/* ---------------- OPTIONS ---------------- */

// SubCaste (same as web)
const subCasteOptions = [
  { label: "Dhakad", value: "Dhakad" },
  { label: "Dhakar", value: "Dhakar" },
  { label: "Dhaker", value: "Dhaker" },
  { label: "Nagar", value: "Nagar" },
  { label: "Malav", value: "Malav" },
  { label: "Kirar", value: "Kirar" },
  { label: "Kirat", value: "Kirat" },
];

// Height
const heightOptions = [];
for (let ft = 4; ft <= 7; ft++) {
  for (let inch = 0; inch < 12; inch++) {
    heightOptions.push({
      label: `${ft}ft ${inch}in`,
      value: `${ft}ft ${inch}in`,
    });
  }
}

// Physical Status (match web)
const physicalStatusOptions = [
  { label: "Normal", value: "Normal" },
  { label: "Physically Challenged", value: "Physically Challenged" },
];

// Marital Status (match web exactly)
const maritalStatusOptions = [
  { label: "Never Married", value: "Never married" },
  { label: "Previously Married (Divorced)", value: "Divorced" },
  { label: "Previously Married (Widowed)", value: "Widower" },
  { label: "Legally Separated / Awaiting Divorce", value: "Awaiting divorce" },
];

export default function Step3Religion({ profile, setProfile }) {
  const [showHeightDropdown, setShowHeightDropdown] = useState(false);
  const [showPhysicalStatusDropdown, setShowPhysicalStatusDropdown] = useState(false);
  const [showMaritalStatusDropdown, setShowMaritalStatusDropdown] = useState(false);
  const [showSubCasteDropdown, setShowSubCasteDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  /* ---------------- DEFAULT VALUES ---------------- */
  useEffect(() => {
    const updates = {};

    if (!profile?.religion) updates.religion = "Hinduism";
    if (!profile?.caste) updates.caste = "Dhakad";
    if (!profile?.subCaste) updates.subCaste = "Dhakad";

    if (Object.keys(updates).length > 0) {
      setProfile({ ...profile, ...updates });
    }
  }, []);

  /* ---------------- COMMON FUNCTIONS ---------------- */

  const handleSelect = (key, item, setDropdown) => {
    setProfile((prev) => ({
      ...prev,
      [key]: item.value,
    }));
    setDropdown(false);
  };

  const getLabel = (options, value, placeholder = "Select") => {
    return options.find((i) => i.value === value)?.label || placeholder;
  };

  const closeOtherDropdowns = (type) => {
    if (type !== "height") setShowHeightDropdown(false);
    if (type !== "physical") setShowPhysicalStatusDropdown(false);
    if (type !== "marital") setShowMaritalStatusDropdown(false);
    if (type !== "subCaste") setShowSubCasteDropdown(false);
  };

  const renderDropdown = (
    label,
    keyName,
    options,
    show,
    setShow,
    placeholder = "Select"
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => {
            closeOtherDropdowns(keyName);
            setShow(!show);
          }}
        >
          <Text style={styles.dropdownHeaderText}>
            {getLabel(options, profile[keyName], placeholder)}
          </Text>

          <Icon name={show ? "chevron-up" : "chevron-down"} size={20} />
        </TouchableOpacity>

        {show && (
          <View style={styles.dropdownList}>
            <ScrollView
              style={{ maxHeight: 200 }}
              nestedScrollEnabled={true}   // 👈 ADD
              showsVerticalScrollIndicator={true}
            >
              {options.map((item) => {
                const isSelected = profile[keyName] === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                    ]}
                    onPress={() =>
                      handleSelect(keyName, item, setShow)
                    }
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <Icon name="checkmark" size={18} color="#d4af37" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => closeOtherDropdowns("")}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Personal & Religious Details</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}   // 👈 ADD THIS
          >

            {renderDropdown(
              "Height",
              "height",
              heightOptions,
              showHeightDropdown,
              setShowHeightDropdown,
              "Select Height"
            )}

            {renderDropdown(
              "Your physical status",
              "physicalStatus",
              physicalStatusOptions,
              showPhysicalStatusDropdown,
              setShowPhysicalStatusDropdown
            )}

            {renderDropdown(
              "Your marital status",
              "maritalStatus",
              maritalStatusOptions,
              showMaritalStatusDropdown,
              setShowMaritalStatusDropdown
            )}

            <Text style={styles.label}>Cast</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={profile.caste || "Dhakad"}
              editable={false}
            />

            {renderDropdown(
              "Sub Cast",
              "subCaste",
              subCasteOptions,
              showSubCasteDropdown,
              setShowSubCasteDropdown,
              "Select Sub Caste"
            )}

            <Text style={styles.label}>Gotra</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Gotra"
              value={profile.gotra}
              onChangeText={(t) =>
                setProfile({ ...profile, gotra: t })
              }
            />

            <View style={{ height: 100 }} />
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f6f3",
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#f7f6f3",
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
    marginBottom: 8,
    marginTop: 14,
    color: "#222",
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
    color: "#111",
    fontSize: 15,
  },

  disabledInput: {
    backgroundColor: "#fafafa",
    color: "#555",
  },

  dropdownContainer: {
    marginBottom: 2,
    marginBottom: 12,
    zIndex: 1000,
    position: "relative",
  },

  dropdownHeader: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownHeaderText: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
    paddingRight: 12,
  },

  placeholderText: {
    color: "#777",
    fontWeight: "400",
  },

  dropdownList: {
    marginTop: 6,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  lastDropdownItem: {
    borderBottomWidth: 0,
  },

  dropdownItemSelected: {
    backgroundColor: "#fffaf0",
  },

  dropdownItemText: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
    paddingRight: 10,
  },

  dropdownItemTextSelected: {
    color: "#b8860b",
    fontWeight: "700",
  },
});