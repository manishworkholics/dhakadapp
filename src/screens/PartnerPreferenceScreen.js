import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

/* ================= LABEL ================= */
const Label = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

/* ================= CHIP ================= */
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected && styles.chipActive]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function EditPartnerPreferenceScreen({ navigation }) {
    
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
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* ================= FETCH STATES ================= */
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API_URL}/location/states`);
      setStates(res.data || []);
    } catch {}
  };

  /* ================= FETCH CITIES ================= */
  const fetchCities = async (state) => {
    try {
      const res = await axios.get(`${API_URL}/location/cities/${state}`);
      setCities((prev) =>
        Array.from(new Set([...(prev || []), ...(res.data?.cities || [])]))
      );
    } catch {}
  };

  /* ================= FETCH PREFERENCE ================= */
  const fetchPreference = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/partner-preference/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.preference) {
        setForm(res.data.preference);

        for (const s of res.data.preference.preferredState || []) {
          await fetchCities(s);
        }
      }
    } catch {
      console.log("No preference found");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchPreference();
  }, []);

  /* ================= HELPERS ================= */
  const toggleMulti = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const addState = async (state) => {
    if (!state || form.preferredState.includes(state)) return;
    setForm((prev) => ({
      ...prev,
      preferredState: [...prev.preferredState, state],
    }));
    await fetchCities(state);
  };

  const addCity = (city) => {
    if (!city || form.preferredCity.includes(city)) return;
    setForm((prev) => ({
      ...prev,
      preferredCity: [...prev.preferredCity, city],
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      await axios.post(`${API_URL}/partner-preference/save`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.goBack();
    } catch {
      alert("Failed to save preferences");
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
    <View style={{ flex: 1 ,paddingBottom: 70 }}>
      <Header  title="Edit Partner Preference" back />

      <ScrollView contentContainerStyle={{ padding: 14 }}>
        {/* BASIC */}
        <Label text="Age Range (Years)" />
        <View style={styles.row}>
          <TextInput
            placeholder="From"
            keyboardType="numeric"
            style={styles.input}
            value={form.ageFrom?.toString()}
            onChangeText={(v) => setForm({ ...form, ageFrom: v })}
          />
          <TextInput
            placeholder="To"
            keyboardType="numeric"
            style={styles.input}
            value={form.ageTo?.toString()}
            onChangeText={(v) => setForm({ ...form, ageTo: v })}
          />
        </View>

        <Label text="Height Range (Feet)" />
        <View style={styles.row}>
          <TextInput
            placeholder="From (eg 5.2)"
            style={styles.input}
            value={form.heightFrom}
            onChangeText={(v) => setForm({ ...form, heightFrom: v })}
          />
          <TextInput
            placeholder="To (eg 5.8)"
            style={styles.input}
            value={form.heightTo}
            onChangeText={(v) => setForm({ ...form, heightTo: v })}
          />
        </View>

        {/* RELIGION */}
        <Label text="Religion" />
        <TextInput
          placeholder="Enter religion"
          style={styles.inputFull}
          value={form.religion}
          onChangeText={(v) => setForm({ ...form, religion: v })}
        />

        <Label text="Caste" />
        <TextInput
          placeholder="Enter caste"
          style={styles.inputFull}
          value={form.caste}
          onChangeText={(v) => setForm({ ...form, caste: v })}
        />

        <Label text="Mother Tongue" />
        <TextInput
          placeholder="Enter mother tongue"
          style={styles.inputFull}
          value={form.motherTongue}
          onChangeText={(v) => setForm({ ...form, motherTongue: v })}
        />

        {/* MULTI SELECT */}
        <Label text="Marital Status" />
        <View style={styles.wrap}>
          {["Never married", "Widower", "Divorced"].map((m) => (
            <Chip
              key={m}
              label={m}
              selected={form.maritalStatus.includes(m)}
              onPress={() => toggleMulti("maritalStatus", m)}
            />
          ))}
        </View>

        <Label text="Education Qualification" />
        <View style={styles.wrap}>
          {["Graduate", "Post Graduate", "PhD"].map((e) => (
            <Chip
              key={e}
              label={e}
              selected={form.educationDetails.includes(e)}
              onPress={() => toggleMulti("educationDetails", e)}
            />
          ))}
        </View>

        <Label text="Employment Type" />
        <View style={styles.wrap}>
          {["Private", "Govt", "Business"].map((e) => (
            <Chip
              key={e}
              label={e}
              selected={form.employmentType.includes(e)}
              onPress={() => toggleMulti("employmentType", e)}
            />
          ))}
        </View>

        {/* LOCATION */}
        <Label text="Preferred State" />
        <View style={styles.wrap}>
          {states.map((s) => (
            <Chip
              key={s.state}
              label={s.state}
              selected={form.preferredState.includes(s.state)}
              onPress={() => addState(s.state)}
            />
          ))}
        </View>

        <Label text="Preferred City" />
        <View style={styles.wrap}>
          {cities.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={form.preferredCity.includes(c)}
              onPress={() => addCity(c)}
            />
          ))}
        </View>

        {/* SAVE */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Preferences"}
          </Text>
        </TouchableOpacity>
      </ScrollView>


       <Footer />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 14,
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },

  inputFull: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  chipActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  chipText: {
    color: "#333",
    fontWeight: "600",
  },

  chipTextActive: {
    color: "#fff",
  },

  saveBtn: {
    backgroundColor: "#ff4e50",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
