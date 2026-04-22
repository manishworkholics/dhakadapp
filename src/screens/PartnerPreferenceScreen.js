import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://143.110.244.163:5000/api';

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

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
    ageFrom: '',
    ageTo: '',
    heightFrom: '',
    heightTo: '',
    religion: 'Hinduism',
    caste: '',
    motherTongue: '',
    maritalStatus: [],
    educationDetails: [],
    employmentType: [],
    preferredState: [],
    preferredCity: [],
    occupation: [],
    annualIncome: [],
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showState, setShowState] = useState(false);
  const [showCity, setShowCity] = useState(false);

  const [showAgeFrom, setShowAgeFrom] = useState(false);
  const [showAgeTo, setShowAgeTo] = useState(false);
  const [showHeightFrom, setShowHeightFrom] = useState(false);
  const [showHeightTo, setShowHeightTo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const { height } = Dimensions.get('window');

  const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);

  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      heightOptions.push(`${ft}ft ${inch}in`);
    }
  }

  const occupationOptions = [
    'Software Engineer', 'Manager', 'Doctor', 'Teacher', 'Business Owner',
    'Government Officer', 'Farmer', 'Student', 'Not Working', 'Others'
  ];

  const annualIncomeOptions = [
    'Below ₹1 Lakh', '₹1 – 3 Lakh', '₹3 – 5 Lakh', '₹5 – 8 Lakh',
    '₹8 – 12 Lakh', '₹12 – 20 Lakh', '₹20 – 35 Lakh',
    '₹35 – 50 Lakh', '₹50 Lakh – 1 Crore', 'Above ₹1 Crore'
  ];

  const fetchStates = async () => {
    const res = await axios.get(`${API_URL}/location/states`);
    setStates(res.data || []);
  };

  const fetchCities = async state => {
    const res = await axios.get(`${API_URL}/location/cities/${state}`);
    setCities(res.data?.cities || []);
  };

  const fetchPreference = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(`${API_URL}/partner-preference/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.preference) {
      setForm(prev => ({
        ...prev,
        ...res.data.preference,
      }));

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
    setForm(p => {
      const arr = p[field] || [];
      return {
        ...p,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      };
    });
  };

  const save = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    await axios.post(`${API_URL}/partner-preference/save`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLoading(false);
    navigation.goBack();
  };

  if (pageLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, paddingBottom: 70 }}>
      <Header title="Partner Preference" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* AGE */}
        <Label text="Age Range (Years)" />
        <View style={styles.row}>
          <TouchableOpacity style={styles.input} onPress={() => setShowAgeFrom(true)}>
            <Text>{form.ageFrom || 'From'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setShowAgeTo(true)}>
            <Text>{form.ageTo || 'To'}</Text>
          </TouchableOpacity>
        </View>

        {showAgeFrom && (
          <View style={styles.dropdownBox}>
            {ageOptions.map(a => (
              <TouchableOpacity key={a} style={styles.dropdownItem}
                onPress={() => { setForm({ ...form, ageFrom: a }); setShowAgeFrom(false); }}>
                <Text>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showAgeTo && (
          <View style={styles.dropdownBox}>
            {ageOptions.map(a => (
              <TouchableOpacity key={a} style={styles.dropdownItem}
                onPress={() => { setForm({ ...form, ageTo: a }); setShowAgeTo(false); }}>
                <Text>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* HEIGHT */}
        <Label text="Height Range" />
        <View style={styles.row}>
          <TouchableOpacity style={styles.input} onPress={() => setShowHeightFrom(true)}>
            <Text>{form.heightFrom || 'From'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setShowHeightTo(true)}>
            <Text>{form.heightTo || 'To'}</Text>
          </TouchableOpacity>
        </View>

        {showHeightFrom && (
          <View style={styles.dropdownBox}>
            {heightOptions.map(h => (
              <TouchableOpacity key={h} style={styles.dropdownItem}
                onPress={() => { setForm({ ...form, heightFrom: h }); setShowHeightFrom(false); }}>
                <Text>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showHeightTo && (
          <View style={styles.dropdownBox}>
            {heightOptions.map(h => (
              <TouchableOpacity key={h} style={styles.dropdownItem}
                onPress={() => { setForm({ ...form, heightTo: h }); setShowHeightTo(false); }}>
                <Text>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TEXT */}
        {/* <Label text="Caste" />
        <TextInput style={styles.inputFull} value={form.caste} onChangeText={v => setForm({ ...form, caste: v })} /> */}
        {/* Select Preferences - Only Dhakar, Only Malav, Only Nagar, Only Kirar, No Boundation
*/}

        <Label text="Select Preferences" />
        <View style={styles.wrap}>
          {[
            'Dhakar',
            'Malav',
            'Nagar',
            'Kirar',
            // 'No Boundation',
          ].map(c => (
            <Chip
              key={c}
              label={c}
              selected={form.caste === c}
              onPress={() => setForm({ ...form, caste: c })}
            />
          ))}
        </View>

        <Label text="Mother Tongue" />
        <TextInput style={styles.inputFull} value={form.motherTongue} onChangeText={v => setForm({ ...form, motherTongue: v })} />

        {/* MARITAL */}
        <Label text="Marital Status" />
        <View style={styles.wrap}>
          {['Never married', 'Widower', 'Divorced'].map(m => (
            <Chip key={m} label={m}
              selected={form.maritalStatus.includes(m)}
              onPress={() => toggleMulti('maritalStatus', m)}
            />
          ))}
        </View>

        {/* EDUCATION */}
        <Label text="Education" />
        <View style={styles.wrap}>
          {['10th', '12th', 'Diploma', "Bachelor's Degree", "Master's Degree",
            'PhD', 'CA', 'CS', 'MBBS', 'LLB', 'Others'].map(e => (
              <Chip key={e} label={e}
                selected={form.educationDetails.includes(e)}
                onPress={() => toggleMulti('educationDetails', e)}
              />
            ))}
        </View>

        {/* EMPLOYMENT */}
        <Label text="Employment Type" />
        <View style={styles.wrap}>
          {['Government Job', 'Private Job', 'Business', 'Self Employed', 'Freelancer',
            'Defence', 'PSU', 'Startup', 'NGO', 'Student', 'Not Working', 'Homemaker', 'Retired'].map(e => (
              <Chip key={e} label={e}
                selected={form.employmentType.includes(e)}
                onPress={() => toggleMulti('employmentType', e)}
              />
            ))}
        </View>

        {/* OCCUPATION */}
        <Label text="Occupation" />
        <View style={styles.wrap}>
          {occupationOptions.map(o => (
            <Chip key={o} label={o}
              selected={form.occupation.includes(o)}
              onPress={() => toggleMulti('occupation', o)}
            />
          ))}
        </View>

        {/* INCOME */}
        <Label text="Annual Income" />
        <View style={styles.wrap}>
          {annualIncomeOptions.map(a => (
            <Chip key={a} label={a}
              selected={form.annualIncome.includes(a)}
              onPress={() => toggleMulti('annualIncome', a)}
            />
          ))}
        </View>

        {/* STATE */}
        <Label text="Preferred State" />
        <TouchableOpacity style={styles.dropdown}
          onPress={() => setShowState(!showState)}>
          <Text>{form.preferredState?.[0] || 'Select State'}</Text>
        </TouchableOpacity>

        {showState && (
          <View style={styles.dropdownBox}>
            {states.map(s => (
              <TouchableOpacity key={s.state} style={styles.dropdownItem}
                onPress={() => {
                  setForm({ ...form, preferredState: [s.state], preferredCity: [] });
                  fetchCities(s.state);
                  setShowState(false);
                }}>
                <Text>{s.state}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CITY */}
        <Label text="Preferred City" />
        <TouchableOpacity style={styles.dropdown}
          onPress={() => setShowCity(!showCity)}>
          <Text>{form.preferredCity?.[0] || 'Select City'}</Text>
        </TouchableOpacity>

        {showCity && (
          <View style={styles.dropdownBox}>
            {cities.map(c => (
              <TouchableOpacity key={c} style={styles.dropdownItem}
                onPress={() => {
                  setForm({ ...form, preferredCity: [c] });
                  setShowCity(false);
                }}>
                <Text>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  label: {
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    color: '#D2691E',
  },

  row: { flexDirection: 'row', gap: 10 },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },

  inputFull: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },

  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },

  chipActive: { backgroundColor: '#ff4e50', borderColor: '#ff4e50' },

  chipText: { color: '#222', fontSize: 13, fontWeight: '600' },

  chipTextActive: { color: '#fff' },

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },

  dropdownBox: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 999,
    elevation: 12,
    marginTop: 6,
    overflow: 'hidden',
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  saveBtn: {
    backgroundColor: '#ff4e50',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },

  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
