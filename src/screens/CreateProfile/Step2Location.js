import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

export default function Step2Location({ profile, setProfile }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showStateList, setShowStateList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  /* 🔹 FETCH STATES */
  useEffect(() => {
    axios.get(`${API_URL}/location/states`).then((res) => {
      setStates(res.data || []);
    });
  }, []);

  /* 🔹 PREFILL WHEN EDITING PROFILE */
  useEffect(() => {
    if (!profile.location) return;

    const parts = profile.location.split(",").map((s) => s.trim());
    if (parts.length === 2) {
      setSelectedCity(parts[0]);
      setSelectedState(parts[1]);
      fetchCities(parts[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 🔹 FETCH CITIES */
  const fetchCities = async (stateName) => {
    const res = await axios.get(`${API_URL}/location/cities/${stateName}`);
    setCities(res.data?.cities || []);
  };

  /* 🔹 UPDATE FINAL LOCATION */
  const updateLocation = (city, state) => {
    const finalLocation = `${city}, ${state}`;
    setProfile({ ...profile, location: finalLocation });
  };

  const closeDropdowns = () => {
    setShowStateList(false);
    setShowCityList(false);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ✅ Fixed Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Location Details</Text>
          <Text style={styles.subTitle}>Select your state and city</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={closeDropdowns}
        >
          {/* STATE */}
          <Text style={styles.label}>State</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.select}
            onPress={() => {
              setShowStateList(!showStateList);
              setShowCityList(false);
            }}
          >
            <Text style={[styles.selectText, !selectedState && styles.placeholder]}>
              {selectedState || "Select State"}
            </Text>
            <Text style={styles.chev}>▾</Text>
          </TouchableOpacity>

          {showStateList && (
            <View style={styles.dropdown}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {states.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.option}
                    onPress={() => {
                      setSelectedState(item.state);
                      setSelectedCity("");
                      setCities([]);
                      fetchCities(item.state);
                      setShowStateList(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.state}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* CITY */}
          <Text style={[styles.label, { marginTop: 10 }]}>City</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.select,
              !selectedState && styles.selectDisabled,
            ]}
            onPress={() => {
              if (!selectedState) return;
              setShowCityList(!showCityList);
              setShowStateList(false);
            }}
            disabled={!selectedState}
          >
            <Text style={[styles.selectText, !selectedCity && styles.placeholder]}>
              {selectedCity || "Select City"}
            </Text>
            <Text style={styles.chev}>▾</Text>
          </TouchableOpacity>

          {showCityList && (
            <View style={styles.dropdown}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={styles.option}
                    onPress={() => {
                      setSelectedCity(city);
                      updateLocation(city, selectedState);
                      setShowCityList(false);
                    }}
                  >
                    <Text style={styles.optionText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* MANUAL LOCATION */}
          <Text style={[styles.label, { marginTop: 10 }]}>Final Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bhopal, Madhya Pradesh"
            placeholderTextColor="#999"
            value={profile.location}
            onChangeText={(t) => {
              setSelectedCity("");
              setProfile({ ...profile, location: t });
            }}
            onFocus={closeDropdowns}
          />

          {/* bottom space for fixed Continue/Back from parent */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
  subTitle: { marginTop: 4, color: "#777", fontWeight: "600" },

  container: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 20,
  },

  label: { fontWeight: "800", marginBottom: 8, color: "#111", marginTop: 6 },

  select: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectDisabled: { backgroundColor: "#f1f1f1" },

  selectText: { fontWeight: "700", color: "#111" },
  placeholder: { color: "#999", fontWeight: "700" },
  chev: { color: "#777", fontSize: 16, marginLeft: 10 },

  dropdown: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    backgroundColor: "#fff",
    marginTop: 10,
    maxHeight: 220,
    overflow: "hidden",
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: { color: "#111", fontWeight: "700" },

  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    color: "#111",
    marginTop: 2,
  },
});
