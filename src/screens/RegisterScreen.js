import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppModal from '../components/AppModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const API_URL = 'http://143.110.244.163:5000/api/auth/register';

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    createdfor: '',
    password: '',
  });

  const [openFor, setOpenFor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const createdForOptions = [
    { label: 'Self', value: 'self' },
    { label: 'Son', value: 'son' },
    { label: 'Daughter', value: 'daughter' },
    { label: 'Brother', value: 'brother' },
    { label: 'Sister', value: 'sister' },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showModal = (msg, type = 'success') => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const isValidEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = phone => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const isValidPassword = password => {
    return (
      password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password)
    );
  };

  const onRegister = async () => {
    const { name, email, phone, createdfor, password } = form;
    if (!agreeTerms) {
      showModal('Please accept Terms & Conditions', 'warning');
      return;
    }
    if (!name || !email || !phone || !createdfor || !password) {
      showModal('Please fill all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showModal('Please enter a valid email address', 'error');
      return;
    }

    if (!isValidPhone(phone)) {
      showModal('Enter valid 10 digit number', 'error');
      return;
    }

    if (!isValidPassword(password)) {
      showModal('Password must be strong', 'error');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(API_URL, {
        name,
        email,
        phone,
        createdfor,
        password,
      });

      if (res.data.success && res.data.requiresVerification) {
        showModal(
          'Registration successful! OTP sent to your Mobile Number.',
          'success',
        );
        await AsyncStorage.setItem('phone', res.data.phone);
        setTimeout(() => {
          navigation.replace('MobileOtp', { phone });
        }, 800);
      } else if (res.data.success) {
        showModal('Registration successful!', 'success');
      } else {
        showModal(res.data.message || 'Registration Failed', 'error');
      }
    } catch (err) {
      showModal(
        err?.response?.data?.message || 'Something went wrong',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/images/logo-dark.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subHeading}>
            Register to find your perfect match
          </Text>

          <View style={styles.formWrap}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.dropdownField}
              onPress={() => setOpenFor(true)}
            >
              <View style={styles.inputLeft}>
                <Ionicons name="people-outline" size={18} color="#ff4e50" />
                <Text
                  style={[
                    styles.dropdownText,
                    !form.createdfor && styles.placeholderText,
                  ]}
                >
                  {form.createdfor
                    ? createdForOptions.find(o => o.value === form.createdfor)
                        ?.label
                    : 'Created Profile For'}
                </Text>
              </View>

              <Ionicons name="chevron-down" size={18} color="#777" />
            </TouchableOpacity>

            <Modal
              transparent
              visible={openFor}
              animationType="fade"
              onRequestClose={() => setOpenFor(false)}
            >
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setOpenFor(false)}
              >
                <Pressable style={styles.modalCard} onPress={() => {}}>
                  <Text style={styles.modalTitle}>Profile Created For</Text>

                  {createdForOptions.map(item => {
                    const selected = form.createdfor === item.value;
                    return (
                      <TouchableOpacity
                        key={item.value}
                        style={[
                          styles.optionRow,
                          selected && styles.optionRowSelected,
                        ]}
                        onPress={() => {
                          handleChange('createdfor', item.value);
                          setOpenFor(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selected && styles.optionTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>

                        {selected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#ff4e50"
                          />
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </Pressable>
              </Pressable>
            </Modal>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="#ff4e50" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#8a8a8a"
                style={styles.input}
                value={form.name}
                onChangeText={t => handleChange('name', t)}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#ff4e50" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#8a8a8a"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={t => handleChange('email', t)}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={18} color="#ff4e50" />
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor="#8a8a8a"
                keyboardType="number-pad"
                style={styles.input}
                maxLength={10}
                value={form.phone}
                onChangeText={t =>
                  handleChange('phone', t.replace(/[^0-9]/g, ''))
                }
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#ff4e50" />
              <TextInput
                placeholder="Create Password"
                placeholderTextColor="#8a8a8a"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={form.password}
                onChangeText={t => handleChange('password', t)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.termsRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreeTerms && styles.checkboxActive]}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                {agreeTerms && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('TermsAndCondition')}
                >
                  Terms & Conditions
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={onRegister}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginRow}
              activeOpacity={0.8}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AppModal
          visible={modalVisible}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 28,
    marginTop: 60,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },

  logo: {
    width: 140,
    height: 85,
  },

  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 4,
  },

  subHeading: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 22,
    paddingHorizontal: 8,
  },

  formWrap: {
    gap: 10,
  },

  dropdownField: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  dropdownText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  placeholderText: {
    color: '#8a8a8a',
    fontWeight: '500',
  },

  inputWrap: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 11,
  },

  registerBtn: {
    marginTop: 8,
    minHeight: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4e50',
    shadowColor: '#ff4e50',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  registerBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  loginRow: {
    alignItems: 'center',
    marginTop: 4,
  },

  loginText: {
    color: '#555',
    fontSize: 14,
  },

  loginLink: {
    color: '#ff4e50',
    fontWeight: '700',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },

  optionRow: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionRowSelected: {
    backgroundColor: '#fff3f4',
  },

  optionText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },

  optionTextSelected: {
    color: '#ff4e50',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  checkboxActive: {
    backgroundColor: '#ff4e50',
    borderColor: '#ff4e50',
  },

  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },

  termsText: {
    fontSize: 13,
    color: '#444',
  },

  termsLink: {
    color: '#ff4e50',
    fontWeight: '600',
  },
});
