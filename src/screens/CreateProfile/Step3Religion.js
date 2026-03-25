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

const physicalStatusOptions = ["Normal", "Physically Challenged"];

const maritalStatusOptions = [
  "Never married",
  "Previously Married (Divorced)",
  "Previously Married (Widowed)",
  "Currently Separated",
  "Legally Separated / Awaiting Divorce",
  "Single Parent (Divorced/Widowed)",
];

export default function Step3Religion({ profile, setProfile }) {
  const [showSubCasteDropdown, setShowSubCasteDropdown] = useState(false);
  const [showPhysicalStatusDropdown, setShowPhysicalStatusDropdown] =
    useState(false);
  const [showMaritalStatusDropdown, setShowMaritalStatusDropdown] =
    useState(false);

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

  const handleSelectPhysicalStatus = (value) => {
    setProfile({ ...profile, physicalStatus: value });
    setShowPhysicalStatusDropdown(false);
  };

  const handleSelectMaritalStatus = (value) => {
    setProfile({ ...profile, maritalStatus: value });
    setShowMaritalStatusDropdown(false);
  };

  const closeOtherDropdowns = (type) => {
    if (type !== "physical") setShowPhysicalStatusDropdown(false);
    if (type !== "marital") setShowMaritalStatusDropdown(false);
    if (type !== "subCaste") setShowSubCasteDropdown(false);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => {
            setShowPhysicalStatusDropdown(false);
            setShowMaritalStatusDropdown(false);
            setShowSubCasteDropdown(false);
          }}
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
            <Text style={styles.label}>Your physical status</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.dropdownHeader}
                onPress={() => {
                  closeOtherDropdowns("physical");
                  setShowPhysicalStatusDropdown(!showPhysicalStatusDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownHeaderText,
                    !profile.physicalStatus && styles.placeholderText,
                  ]}
                >
                  {profile.physicalStatus || "Select"}
                </Text>
                <Icon
                  name={
                    showPhysicalStatusDropdown ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>

              {showPhysicalStatusDropdown && (
                <View style={styles.dropdownList}>
                  {physicalStatusOptions.map((item, index) => {
                    const isSelected = profile.physicalStatus === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.85}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                          index === physicalStatusOptions.length - 1 &&
                            styles.lastDropdownItem,
                        ]}
                        onPress={() => handleSelectPhysicalStatus(item)}
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
                          <Icon name="checkmark" size={18} color="#d4af37" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* MARITAL STATUS */}
            <Text style={styles.label}>Your marital status</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.dropdownHeader}
                onPress={() => {
                  closeOtherDropdowns("marital");
                  setShowMaritalStatusDropdown(!showMaritalStatusDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownHeaderText,
                    !profile.maritalStatus && styles.placeholderText,
                  ]}
                >
                  {profile.maritalStatus || "Select"}
                </Text>
                <Icon
                  name={
                    showMaritalStatusDropdown ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>

              {showMaritalStatusDropdown && (
                <View style={styles.dropdownList}>
                  {maritalStatusOptions.map((item, index) => {
                    const isSelected = profile.maritalStatus === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.85}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                          index === maritalStatusOptions.length - 1 &&
                            styles.lastDropdownItem,
                        ]}
                        onPress={() => handleSelectMaritalStatus(item)}
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
                          <Icon name="checkmark" size={18} color="#d4af37" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* CASTE */}
            <Text style={styles.label}>Cast</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={profile.caste || "Dhakad"}
              editable={false}
              placeholderTextColor="#777"
            />

            {/* SUB CASTE */}
            <Text style={styles.label}>Sub Cast</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.dropdownHeader}
                onPress={() => {
                  closeOtherDropdowns("subCaste");
                  setShowSubCasteDropdown(!showSubCasteDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownHeaderText,
                    !profile.subCaste && styles.placeholderText,
                  ]}
                >
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
                  {subCasteOptions.map((item, index) => {
                    const isSelected = profile.subCaste === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.85}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                          index === subCasteOptions.length - 1 &&
                            styles.lastDropdownItem,
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
                          <Icon name="checkmark" size={18} color="#d4af37" />
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
    zIndex: 99,
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
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4,
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