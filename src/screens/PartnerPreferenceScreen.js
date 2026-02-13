// PartnerPreference.js (React Native) — FULL UPDATED CODE (Web fields included)
// ✅ Added: occupation[], annualIncome[]
// ✅ Same API + same logic
// ✅ Dropdown icons included
// ✅ Safe toggleMulti (no crash if field undefined)

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

/* ================= LABEL ================= */
const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

/* ================= CHIP ================= */
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected && styles.chipActive]}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, selected && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function PartnerPreferenceScreen({ navigation }) {
  const [form, setForm] = useState({
    ageFrom: "",
    ageTo: "",
    heightFrom: "",
    heightTo: "",
    religion: "",
    caste: "",
    motherTongue: "",
    maritalStatus: [],
    educationDetails: [],
    employmentType: [],
    preferredState: [],
    preferredCity: [],

    // ✅ Web fields
    occupation: [],
    annualIncome: [],
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showState, setShowState] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [stateBtnY, setStateBtnY] = useState(0);
  const [cityBtnY, setCityBtnY] = useState(0);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { height } = Dimensions.get("window");

  /* ================= OPTIONS (Same as Web) ================= */
  const occupationOptions = [
    "Software Engineer",
    "Manager",
    "Doctor",
    "Teacher",
    "Business Owner",
    "Government Officer",
    "Farmer",
    "Student",
    "Not Working",
    "Others",
  ];

  const annualIncomeOptions = [
    "Below ₹1 Lakh",
    "₹1 – 3 Lakh",
    "₹3 – 5 Lakh",
    "₹5 – 8 Lakh",
    "₹8 – 12 Lakh",
    "₹12 – 20 Lakh",
    "₹20 – 35 Lakh",
    "₹35 – 50 Lakh",
    "₹50 Lakh – 1 Crore",
    "Above ₹1 Crore",
  ];

  /* ================= API ================= */
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API_URL}/location/states`);
      setStates(res.data || []);
    } catch (e) {
      console.log("STATES API ERROR", e?.message);
    }
  };

  const fetchCities = async (state) => {
    try {
      const res = await axios.get(`${API_URL}/location/cities/${state}`);
      setCities(res.data?.cities || []);
    } catch (e) {
      console.log("CITIES API ERROR", e?.message);
    }
  };

  const fetchPreference = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/partner-preference/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.preference) {
        setForm((prev) => ({
          ...prev,
          ...res.data.preference,
          maritalStatus: res.data.preference.maritalStatus || [],
          educationDetails: res.data.preference.educationDetails || [],
          employmentType: res.data.preference.employmentType || [],
          preferredState: res.data.preference.preferredState || [],
          preferredCity: res.data.preference.preferredCity || [],
          occupation: res.data.preference.occupation || [],
          annualIncome: res.data.preference.annualIncome || [],
        }));

        if (res.data.preference.preferredState?.[0]) {
          fetchCities(res.data.preference.preferredState[0]);
        }
      }
    } catch (e) {
      console.log("PREFERENCE API ERROR", e?.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchPreference();
  }, []);

  const toggleMulti = (field, value) => {
    setForm((p) => {
      const arr = Array.isArray(p[field]) ? p[field] : [];
      return {
        ...p,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const save = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      await axios.post(`${API_URL}/partner-preference/save`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.goBack();
    } catch (e) {
      console.log("SAVE API ERROR", e?.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingBottom: 70 }}>
      <Header title="Partner Preference" />

      {/* 🔥 MAIN SCROLL LOCK */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showState && !showCity}
        keyboardShouldPersistTaps="handled"
      >
        {/* AGE */}
        <Label text="Age Range (Years)" />
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="From"
            keyboardType="numeric"
            value={String(form.ageFrom ?? "")}
            onChangeText={(v) => setForm({ ...form, ageFrom: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="To"
            keyboardType="numeric"
            value={String(form.ageTo ?? "")}
            onChangeText={(v) => setForm({ ...form, ageTo: v })}
          />
        </View>

        {/* HEIGHT */}
        <Label text="Height Range (Feet)" />
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="From"
            value={String(form.heightFrom ?? "")}
            onChangeText={(v) => setForm({ ...form, heightFrom: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="To"
            value={String(form.heightTo ?? "")}
            onChangeText={(v) => setForm({ ...form, heightTo: v })}
          />
        </View>

        {/* TEXT */}
        <Label text="Religion" />
        <TextInput
          style={styles.inputFull}
          placeholder="Religion"
          value={form.religion ?? ""}
          onChangeText={(v) => setForm({ ...form, religion: v })}
        />

        <Label text="Caste" />
        <TextInput
          style={styles.inputFull}
          placeholder="Caste"
          value={form.caste ?? ""}
          onChangeText={(v) => setForm({ ...form, caste: v })}
        />

        <Label text="Mother Tongue" />
        <TextInput
          style={styles.inputFull}
          placeholder="Mother Tongue"
          value={form.motherTongue ?? ""}
          onChangeText={(v) => setForm({ ...form, motherTongue: v })}
        />

        {/* CHIPS */}
        <Label text="Marital Status" />
        <View style={styles.wrap}>
          {["Never married", "Widower", "Divorced"].map((m) => (
            <Chip
              key={m}
              label={m}
              selected={(form.maritalStatus || []).includes(m)}
              onPress={() => toggleMulti("maritalStatus", m)}
            />
          ))}
        </View>

        <Label text="Education " />
        <View style={styles.wrap}>
          {["10th", "12th", "Diploma", "Bachelor's Degree",
            "Master's Degree", "PhD / Doctorate", "CA", "CS",
            "MBBS", "LLB / LLM", "Others"].map((e) => (
              <Chip
                key={e}
                label={e}
                selected={(form.educationDetails || []).includes(e)}
                onPress={() => toggleMulti("educationDetails", e)}
              />
            ))}
        </View>

        <Label text="Employment Type" />
        <View style={styles.wrap}>
          {["Government Job", "Private Job", "Business / Entrepreneur", "Self Employed",
            "Freelancer / Consultant", "Defence / Armed Forces", "PSU / Public Sector",
            "Startup", "NGO / Social Work", "Student", "Not Working", "Homemaker", "Retired"].map((e) => (
              <Chip
                key={e}
                label={e}
                selected={(form.employmentType || []).includes(e)}
                onPress={() => toggleMulti("employmentType", e)}
              />
            ))}
        </View>

        {/* ✅ NEW: OCCUPATION */}
        <Label text="Occupation" />
        <View style={styles.wrap}>
          {occupationOptions.map((o) => (
            <Chip
              key={o}
              label={o}
              selected={(form.occupation || []).includes(o)}
              onPress={() => toggleMulti("occupation", o)}
            />
          ))}
        </View>

        {/* ✅ NEW: ANNUAL INCOME */}
        <Label text="Annual Income" />
        <View style={styles.wrap}>
          {annualIncomeOptions.map((a) => (
            <Chip
              key={a}
              label={a}
              selected={(form.annualIncome || []).includes(a)}
              onPress={() => toggleMulti("annualIncome", a)}
            />
          ))}
        </View>

        {/* STATE */}
        <Label text="Preferred State" />
        <TouchableOpacity
          style={styles.dropdown}
          onLayout={(e) => setStateBtnY(e.nativeEvent.layout.y)}
          onPress={() => {
            setShowState((p) => !p);
            setShowCity(false);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {form.preferredState?.[0] || "Select State"}
          </Text>

          <Ionicons
            name={showState ? "chevron-up" : "chevron-down"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {showState && (
          <View style={[styles.dropdownBox, { bottom: height - stateBtnY + 600 }]}>
            <ScrollView
              nestedScrollEnabled
              style={{ maxHeight: 220 }}
              keyboardShouldPersistTaps="handled"
            >
              {states.map((s) => (
                <TouchableOpacity
                  key={s.state}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({
                      ...form,
                      preferredState: [s.state],
                      preferredCity: [],
                    });
                    fetchCities(s.state);
                    setShowState(false);
                  }}
                >
                  <Text>{s.state}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* CITY */}
        <Label text="Preferred City" />
        <TouchableOpacity
          style={styles.dropdown}
          onLayout={(e) => setCityBtnY(e.nativeEvent.layout.y)}
          onPress={() => setShowCity((p) => !p)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {form.preferredCity?.[0] || "Select City"}
          </Text>

          <Ionicons
            name={showCity ? "chevron-up" : "chevron-down"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {showCity && (
          <View style={[styles.dropdownBox, { bottom: height - cityBtnY + 600 }]}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 220 }}>
              {cities.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({ ...form, preferredCity: [c] });
                    setShowCity(false);
                  }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Preferences"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  label: { fontWeight: "700", marginTop: 14, marginBottom: 6 },

  row: { flexDirection: "row", gap: 10 },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  inputFull: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },

  chipActive: { backgroundColor: "#ff4e50", borderColor: "#ff4e50" },

  chipText: { color: "#222", fontSize: 13, fontWeight: "600" },

  chipTextActive: { color: "#fff" },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  dropdownText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
  },

  dropdownBox: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 999,
    elevation: 12,
    marginTop: 6,
    overflow: "hidden",
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  saveBtn: {
    backgroundColor: "#ff4e50",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
  },

  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
