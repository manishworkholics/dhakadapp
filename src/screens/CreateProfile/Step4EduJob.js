import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native";

/* ---------------- OPTIONS (MATCH WEB EXACTLY) ---------------- */

const educationOptions = [
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "Diploma", value: "diploma" },
  { label: "Bachelor's Degree", value: "bachelors" },
  { label: "Master's Degree", value: "masters" },
  { label: "PhD / Doctorate", value: "phd" },
  { label: "CA", value: "ca" },
  { label: "CS", value: "cs" },
  { label: "MBBS", value: "mbbs" },
  { label: "LLB / LLM", value: "law" },
  { label: "Others", value: "others" },
];

const employmentTypeOptions = [
  { label: "Government Job", value: "government" },
  { label: "Private Job", value: "private" },
  { label: "Business / Entrepreneur", value: "business" },
  { label: "Self Employed", value: "self_employed" },
  { label: "Freelancer / Consultant", value: "freelancer" },
  { label: "Defence / Armed Forces", value: "defense" },
  { label: "PSU / Public Sector", value: "psu" },
  { label: "Startup", value: "startup" },
  { label: "NGO / Social Work", value: "ngo" },
  { label: "Student", value: "student" },
  { label: "Not Working", value: "not_working" },
  { label: "Homemaker", value: "homemaker" },
  { label: "Retired", value: "retired" },
];

const occupationOptions = [
  { label: "Software Engineer", value: "software_engineer" },
  { label: "Manager", value: "manager" },
  { label: "Doctor", value: "doctor" },
  { label: "Teacher", value: "teacher" },
  { label: "Business Owner", value: "business_owner" },
  { label: "Government Officer", value: "govt_officer" },
  { label: "Farmer", value: "farmer" },
  { label: "Student", value: "student" },
  { label: "Not Working", value: "not_working" },
  { label: "Others", value: "others" },
];

const annualIncomeOptions = [
  { label: "Below ₹1 Lakh", value: "below_1_lakh" },
  { label: "₹1 – 3 Lakh", value: "1_3_lakh" },
  { label: "₹3 – 5 Lakh", value: "3_5_lakh" },
  { label: "₹5 – 8 Lakh", value: "5_8_lakh" },
  { label: "₹8 – 12 Lakh", value: "8_12_lakh" },
  { label: "₹12 – 20 Lakh", value: "12_20_lakh" },
  { label: "₹20 – 35 Lakh", value: "20_35_lakh" },
  { label: "₹35 – 50 Lakh", value: "35_50_lakh" },
  { label: "₹50 Lakh – 1 Crore", value: "50_lakh_1_cr" },
  { label: "Above ₹1 Crore", value: "above_1_cr" },
  { label: "Prefer not to say", value: "not_disclosed" },
];

export default function Step4EduJob({ profile, setProfile }) {

  
  const [showEducation, setShowEducation] = useState(false);
  const [showEmployment, setShowEmployment] = useState(false);
  const [showOccupation, setShowOccupation] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
 

  /* ---------------- COMMON FUNCTIONS ---------------- */

 const handleSelect = (key, item, setDropdown) => {
  setProfile((prev) => {
    let updated = { ...prev, [key]: item.value };

    if (key === "education" && item.value !== "others") {
      updated.otherEducation = "";
    }
    if (key === "employmentType" && item.value !== "others") {
      updated.otherEmployment = "";
    }
    if (key === "occupation" && item.value !== "others") {
      updated.otherOccupation = "";
    }

    return updated;
  });

  setDropdown(false);
};

  const getLabel = (options, value, placeholder) => {
    return options.find((i) => i.value === value)?.label || placeholder;
  };

  const closeAll = () => {
    setShowEducation(false);
    setShowEmployment(false);
    setShowOccupation(false);
    setShowIncome(false);
  };

  const renderDropdown = (
    label,
    keyName,
    options,
    show,
    setShow,
    placeholder
  ) => (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => {
            closeAll();
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
              style={{ maxHeight: 250 }}
              nestedScrollEnabled={true}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={closeAll}>
          <View style={styles.header}>
            <Text style={styles.title}>Professional Details</Text>
            <Text style={styles.subTitle}>
              Education, job and income details
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >

            {renderDropdown(
              "Education",
              "education",
              educationOptions,
              showEducation,
              setShowEducation,
              "Select education"
            )}
         {profile.education === "others" && (
  <>
    <Text style={styles.label}>Other Education</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your education"
      placeholderTextColor={"#A9A9A9"}
      value={profile.otherEducation || ""}
      onChangeText={(text) =>
        setProfile((prev) => ({
          ...prev,
          otherEducation: text,
        }))
      }
    />
  </>
)}
            {renderDropdown(
              "Employment Type",
              "employmentType",
              employmentTypeOptions,
              showEmployment,
              setShowEmployment,
              "Select employment type"
            )}
        {profile.employmentType === "others" && (
  <>
    <Text style={styles.label}>Other Employment</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter employment details"
      value={profile.otherEmployment || ""}
      onChangeText={(text) =>
        setProfile((prev) => ({
          ...prev,
          otherEmployment: text,
        }))
      }
    />
  </>
)}
            {renderDropdown(
              "Occupation",
              "occupation",
              occupationOptions,
              showOccupation,
              setShowOccupation,
              "Select occupation"
            )}
           {profile.occupation === "others" && (
  <>
    <Text style={styles.label}>Other Occupation</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter occupation details"
      placeholderTextColor="#8a8a8a"
      value={profile.otherOccupation || ""}
      

      onChangeText={(text) =>
        setProfile((prev) => ({
          ...prev,
          otherOccupation: text,
        }))
      }
    />
  </>
)}
            {renderDropdown(
              "Annual Income",
              "annualIncome",
              annualIncomeOptions,
              showIncome,
              setShowIncome,
              "Select income"
            )}

            <View style={{ height: 120 }} />
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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#f7f6f3",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  subTitle: {
    marginTop: 4,
    color: "#777",
    fontWeight: "600",
  },

  container: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 20,
  },

  dropdownWrapper: {
    marginBottom: 16,
  },

  label: {
    fontWeight: "800",
    marginBottom: 8,
    color: "#111",
    marginTop: 6,
  },

  dropdownContainer: {
    zIndex: 1,
  },

  dropdownHeader: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownHeaderText: {
    flex: 1,
    color: "#111",
    fontSize: 15,
    fontWeight: "500",
    paddingRight: 10,
  },

  placeholderText: {
    color: "#999",
    fontWeight: "400",
  },

  dropdownList: {
    marginTop: 6,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
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

  input: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  backgroundColor: "#fff",
  color: "#111",
  fontSize: 15,
  marginTop: 6,
  
}
});