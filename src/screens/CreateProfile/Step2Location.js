import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
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
  }, []);

  /* 🔹 FETCH CITIES */
  const fetchCities = async (stateName) => {
    const res = await axios.get(
      `${API_URL}/location/cities/${stateName}`
    );
    setCities(res.data?.cities || []);
  };

  /* 🔹 UPDATE FINAL LOCATION */
  const updateLocation = (city, state) => {
    const finalLocation = `${city}, ${state}`;
    setProfile({ ...profile, location: finalLocation });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Details</Text>

      {/* STATE */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          setShowStateList(!showStateList);
          setShowCityList(false);
        }}
      >
        <Text style={{ color: selectedState ? "#000" : "#999" }}>
          {selectedState || "Select State"}
        </Text>
      </TouchableOpacity>

      {showStateList && (
        <View style={styles.dropdown}>
          <ScrollView>
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
                <Text>{item.state}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* CITY */}
      <TouchableOpacity
        style={[
          styles.input,
          !selectedState && { backgroundColor: "#f2f2f2" },
        ]}
        onPress={() => {
          if (!selectedState) return;
          setShowCityList(!showCityList);
          setShowStateList(false);
        }}
        disabled={!selectedState}
      >
        <Text style={{ color: selectedCity ? "#000" : "#999" }}>
          {selectedCity || "Select City"}
        </Text>
      </TouchableOpacity>

      {showCityList && (
        <View style={styles.dropdown}>
          <ScrollView>
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
                <Text>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* MANUAL LOCATION (OVERRIDES DROPDOWN) */}
      <TextInput
        style={styles.input}
        placeholder="Or type your city manually"
        value={profile.location}
        onChangeText={(t) => {
          setSelectedCity("");
          setProfile({ ...profile, location: t });
        }}
      />
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

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    maxHeight: 200,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  option: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
});
