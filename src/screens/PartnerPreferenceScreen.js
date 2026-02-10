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
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showState, setShowState] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [stateBtnY, setStateBtnY] = useState(0);
  const [cityBtnY, setCityBtnY] = useState(0);


  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { width, height } = Dimensions.get("window");


  /* ================= API ================= */
  const fetchStates = async () => {
    const res = await axios.get(`${API_URL}/location/states`);
    setStates(res.data || []);
  };

  const fetchCities = async (state) => {
    const res = await axios.get(`${API_URL}/location/cities/${state}`);
    setCities(res.data?.cities || []);
  };

  const fetchPreference = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get(`${API_URL}/partner-preference/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.preference) {
      setForm(res.data.preference);
      if (res.data.preference.preferredState?.[0]) {
        fetchCities(res.data.preference.preferredState[0]);
      }
    }
    setPageLoading(false);
  };

  useEffect(() => {
    fetchStates();
    fetchPreference();
  }, []);

  const toggleMulti = (field, value) => {
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(value)
        ? p[field].filter((v) => v !== value)
        : [...p[field], value],
    }));
  };

  const save = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    await axios.post(`${API_URL}/partner-preference/save`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoading(false);
    navigation.goBack();
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
        scrollEnabled={!showState && !showCity}
      >
        {/* AGE */}
        <Label text="Age Range (Years)" />
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="From"
            keyboardType="numeric"
            value={form.ageFrom}
            onChangeText={(v) => setForm({ ...form, ageFrom: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="To"
            keyboardType="numeric"
            value={form.ageTo}
            onChangeText={(v) => setForm({ ...form, ageTo: v })}
          />
        </View>

        {/* HEIGHT */}
        <Label text="Height Range (Feet)" />
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="From"
            value={form.heightFrom}
            onChangeText={(v) => setForm({ ...form, heightFrom: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="To"
            value={form.heightTo}
            onChangeText={(v) => setForm({ ...form, heightTo: v })}
          />
        </View>

        {/* TEXT */}
        <Label text="Religion" />
        <TextInput
          style={styles.inputFull}
          value={form.religion}
          onChangeText={(v) => setForm({ ...form, religion: v })}
        />

        <Label text="Caste" />
        <TextInput
          style={styles.inputFull}
          value={form.caste}
          onChangeText={(v) => setForm({ ...form, caste: v })}
        />

        <Label text="Mother Tongue" />
        <TextInput
          style={styles.inputFull}
          value={form.motherTongue}
          onChangeText={(v) => setForm({ ...form, motherTongue: v })}
        />

        {/* CHIPS */}
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

        {/* STATE */}
        <Label text="Preferred State" />
        <TouchableOpacity
          style={styles.dropdown}
          onLayout={(e) => setStateBtnY(e.nativeEvent.layout.y)}
          onPress={() => {
            setShowState(!showState);
            setShowCity(false);
          }}
        >
          <Text>{form.preferredState[0] || "Select State"}</Text>
        </TouchableOpacity>


        {showState && (
          <View
            style={[
              styles.dropdownBox,
              { bottom: height - stateBtnY + 10 }
            ]}
          >
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
          onPress={() => setShowCity(!showCity)}
        >
          <Text>{form.preferredCity[0] || "Select City"}</Text>
        </TouchableOpacity>


        {showCity && (
          <View
            style={[
              styles.dropdownBox,
              { bottom: height - cityBtnY + 10 }
            ]}
          >
            <ScrollView
              nestedScrollEnabled
              style={{ maxHeight: 220 }}
            >
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


        <TouchableOpacity style={styles.saveBtn} onPress={save}>
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
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  label: { fontWeight: "700", marginTop: 14, marginBottom: 6 },

  row: { flexDirection: "row", gap: 10 },

  input: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 12 },

  inputFull: { backgroundColor: "#fff", borderRadius: 10, padding: 12 },

  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  chipActive: { backgroundColor: "#ff4e50", borderColor: "#ff4e50" },

  chipTextActive: { color: "#fff" },

  dropdown: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
