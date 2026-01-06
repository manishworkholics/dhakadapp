import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Step1Basic({ profile, setProfile }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setProfile({ ...profile, dob: formattedDate });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Details</Text>

      {/* NAME (READ ONLY) */}
      <TextInput
        style={[styles.input, styles.disabled]}
        value={profile.name}
        editable={false}
      />

      {/* GENDER SELECT */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {["male", "female"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderBtn,
              profile.gender === g && styles.genderActive,
            ]}
            onPress={() => setProfile({ ...profile, gender: g })}
          >
            <Text
              style={[
                styles.genderText,
                profile.gender === g && { color: "#fff" },
              ]}
            >
              {g === "male" ? "Male" : "Female"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DOB PICKER */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={profile.dob}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={profile.dob ? new Date(profile.dob) : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          maximumDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 18))
          } // 18+ only
          onChange={onDateChange}
        />
      )}

      {/* EMAIL (READ ONLY) */}
      <TextInput
        style={[styles.input, styles.disabled]}
        value={profile.email}
        editable={false}
        placeholder="Email"
      />

      {/* MOTHER TONGUE */}
      <Text style={styles.label}>Mother Tongue</Text>
      <View style={styles.row}>
        {["Hindi", "English", "Gujarati"].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.chip,
              profile.motherTongue === lang && styles.chipActive,
            ]}
            onPress={() =>
              setProfile({ ...profile, motherTongue: lang })
            }
          >
            <Text
              style={[
                styles.chipText,
                profile.motherTongue === lang && { color: "#fff" },
              ]}
            >
              {lang}
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

  disabled: {
    backgroundColor: "#f2f2f2",
    color: "#666",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  genderActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  genderText: {
    fontWeight: "600",
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
