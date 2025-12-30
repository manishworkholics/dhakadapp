import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";

/* 🔹 SECTION WRAPPER */
const Section = ({ title, onEdit, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

/* 🔹 ROW */
const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function PartnerPreferenceScreen({ navigation }) {
  // 🔹 Dummy data (later API se aayega)
  const preference = {
    ageFrom: 23,
    ageTo: 30,
    heightFrom: "5'2\"",
    heightTo: "5'10\"",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Dhakad",
    motherTongue: "Hindi",
    education: "Graduate / Post Graduate",
    employment: "Private / Govt",
    income: "₹3L - ₹10L",
    city: "Indore / Bhopal",
    state: "Madhya Pradesh",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header
        title="Partner Preferences"
        onMenuPress={() => navigation.openDrawer()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 BASIC PREFERENCES */}
        <Section
          title="Basic Preferences"
          onEdit={() => navigation.navigate("EditPartnerBasic")}
        >
          <Row
            label="Age"
            value={`${preference.ageFrom} - ${preference.ageTo} yrs`}
          />
          <Row
            label="Height"
            value={`${preference.heightFrom} - ${preference.heightTo}`}
          />
          <Row
            label="Marital Status"
            value={preference.maritalStatus}
          />
        </Section>

        {/* 🔹 RELIGION */}
        <Section
          title="Religion & Community"
          onEdit={() => navigation.navigate("EditPartnerReligion")}
        >
          <Row label="Religion" value={preference.religion} />
          <Row label="Caste" value={preference.caste} />
          <Row
            label="Mother Tongue"
            value={preference.motherTongue}
          />
        </Section>

        {/* 🔹 EDUCATION & CAREER */}
        <Section
          title="Education & Career"
          onEdit={() => navigation.navigate("EditPartnerCareer")}
        >
          <Row label="Education" value={preference.education} />
          <Row label="Employment" value={preference.employment} />
          <Row label="Annual Income" value={preference.income} />
        </Section>

        {/* 🔹 LOCATION */}
        <Section
          title="Location Preferences"
          onEdit={() => navigation.navigate("EditPartnerLocation")}
        >
          <Row label="Preferred City" value={preference.city} />
          <Row label="Preferred State" value={preference.state} />
        </Section>

        {/* 🔹 SAVE CTA */}
        <View style={styles.saveWrap}>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  edit: {
    color: "#ff4e50",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  label: {
    color: "#666",
  },

  value: {
    fontWeight: "600",
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
  },

  saveWrap: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  saveBtn: {
    backgroundColor: "#ff4e50",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
