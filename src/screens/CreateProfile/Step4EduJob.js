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

const educationOptions = [
  "10th / Secondary School",
  "12th / Higher Secondary",
  "Diploma",
  "Bachelor's Degree (BA, BSc, BCom, BTech, etc.)",
  "Master's Degree (MA, MSc, MCom, MTech, MBA, etc.)",
  "PhD / Doctorate",
  "CA (Chartered Accountant)",
  "CS (Company Secretary)",
  "ICWA / CMA",
  "MBBS",
  "MD / MS",
  "LLB / LLM",
  "Others",
];

const employmentTypeOptions = [
  "Government Job",
  "Private Job",
  "Business / Entrepreneur",
  "Self Employed",
  "Freelancer / Consultant",
  "Defence / Armed Forces",
  "PSU / Public Sector",
  "Startup",
  "NGO / Social Work",
  "Student",
  "Not Working",
  "Homemaker",
  "Retired",
];

const occupationOptions = [
  "Software Engineer",
  "Web Developer",
  "Mobile App Developer",
  "Data Analyst",
  "IT Support",
  "Manager",
  "HR Professional",
  "Accountant",
  "Marketing Professional",
  "Sales Executive",
  "Doctor",
  "Nurse",
  "Pharmacist",
  "Teacher",
  "Professor / Lecturer",
  "Government Officer",
  "Police Officer",
  "Lawyer",
  "Judge",
  "Architect",
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Business Owner",
  "Entrepreneur",
  "Consultant",
  "Chartered Accountant",
  "Company Secretary",
  "Bank Employee",
  "Clerk",
  "Farmer",
  "Designer",
  "Fashion Designer",
  "Journalist",
  "Content Writer",
  "Photographer",
  "Social Worker",
  "Student",
  "Homemaker",
  "Not Working",
  "Other",
];

const annualIncomeOptions = [
  "Below ₹1 Lakh",
  "₹1–3 Lakh",
  "₹3–5 Lakh",
  "₹5–8 Lakh",
  "₹8–12 Lakh",
  "₹12–20 Lakh",
  "₹20–35 Lakh",
  "₹35–50 Lakh",
  "₹50 Lakh–1 Crore",
  "Above ₹1 Crore",
  "Prefer not to say",
];

export default function Step4EduJob({ profile, setProfile }) {
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);
  const [showIncomeDropdown, setShowIncomeDropdown] = useState(false);

  const closeOtherDropdowns = (type) => {
    if (type !== "education") setShowEducationDropdown(false);
    if (type !== "employment") setShowEmploymentDropdown(false);
    if (type !== "occupation") setShowOccupationDropdown(false);
    if (type !== "income") setShowIncomeDropdown(false);
  };

  const renderDropdown = ({
    label,
    value,
    placeholder,
    options,
    visible,
    setVisible,
    field,
  }) => (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.dropdownHeader}
          onPress={() => {
            closeOtherDropdowns(field);
            setVisible(!visible);
          }}
        >
          <Text
            style={[
              styles.dropdownHeaderText,
              !value && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>

          <Icon
            name={visible ? "chevron-up" : "chevron-down"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {visible && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 260 }}>
              {options.map((item, index) => {
                const isSelected = value === item;
                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                      index === options.length - 1 && styles.lastDropdownItem,
                    ]}
                    onPress={() => {
                      setProfile({ ...profile, [field]: item });
                      setVisible(false);
                    }}
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
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );

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
            setShowEducationDropdown(false);
            setShowEmploymentDropdown(false);
            setShowOccupationDropdown(false);
            setShowIncomeDropdown(false);
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Professional Details</Text>
            <Text style={styles.subTitle}>
              Education, job and income details
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {renderDropdown({
              label: "Education",
              value: profile.education,
              placeholder: "Select education",
              options: educationOptions,
              visible: showEducationDropdown,
              setVisible: setShowEducationDropdown,
              field: "education",
            })}

            {renderDropdown({
              label: "Employment Type",
              value: profile.employmentType,
              placeholder: "Select employment type",
              options: employmentTypeOptions,
              visible: showEmploymentDropdown,
              setVisible: setShowEmploymentDropdown,
              field: "employmentType",
            })}

            {renderDropdown({
              label: "Occupation / Job Role",
              value: profile.occupation,
              placeholder: "Select occupation",
              options: occupationOptions,
              visible: showOccupationDropdown,
              setVisible: setShowOccupationDropdown,
              field: "occupation",
            })}

            {renderDropdown({
              label: "Annual Income",
              value: profile.annualIncome,
              placeholder: "Select annual income",
              options: annualIncomeOptions,
              visible: showIncomeDropdown,
              setVisible: setShowIncomeDropdown,
              field: "annualIncome",
            })}

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
    marginBottom: 14,
  },

  label: {
    fontWeight: "800",
    marginBottom: 8,
    color: "#111",
    marginTop: 6,
  },

  dropdownContainer: {
    zIndex: 99,
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
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4,
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
});