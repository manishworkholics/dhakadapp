



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Modal, Pressable } from "react-native";
import AppModal from "../components/AppModal";


const API_URL = "http://143.110.244.163:5000/api/auth/register";

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    createdfor: "",
    password: "",
  });
  const [openFor, setOpenFor] = useState(false);

  const createdForOptions = [
    { label: "Self", value: "self" },
    { label: "Son", value: "son" },
    { label: "Daughter", value: "daughter" },
    { label: "Brother", value: "brother" },
    { label: "Sister", value: "sister" },
  ];



  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= VALIDATION ================= */

  const isValidEmail = (email) => {
    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const isValidPassword = (password) => {
    return (
      password.length >= 6 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  /* ================= REGISTER ================= */

  const onRegister = async () => {
    const { name, email, phone, createdfor, password } = form;

    if (!name || !email || !phone || !createdfor || !password) {
      showModal("Please fill all fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showModal("Please enter a valid email address", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      showModal("Enter valid 10 digit number", "error");
      return;
    }

    if (!isValidPassword(password)) {
      showModal("Password must be strong", "error");
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
        showModal("Registration successful! OTP sent to your email.", "success");
        setTimeout(() => {
          navigation.replace("EmailOtp", { email });
        }, 800);
      } else if (res.data.success) {
        showModal("Registration successful!", "success");
      } else {
        showModal(res.data.message || "Registration Failed", "error");
      }
    } catch (err) {
      showModal(
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };




  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/dhakadlogoapp.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* CREATED FOR */}
        <View style={styles.dropdownWrap}>
          {/* CREATED FOR - Custom Designed Dropdown */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dropdownField}
            onPress={() => setOpenFor(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                !form.createdfor && { color: "#999" },
              ]}
            >
              {form.createdfor
                ? createdForOptions.find((o) => o.value === form.createdfor)?.label
                : "Profile Created For"}
            </Text>

            <Text style={styles.dropdownIcon}>▾</Text>
          </TouchableOpacity>

          {/* Modal Dropdown */}
          <Modal
            transparent
            visible={openFor}
            animationType="fade"
            onRequestClose={() => setOpenFor(false)}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setOpenFor(false)}>
              <Pressable style={styles.modalCard} onPress={() => { }}>
                <Text style={styles.modalTitle}>Profile Created For</Text>

                {createdForOptions.map((item) => {
                  const selected = form.createdfor === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.optionRow, selected && styles.optionRowSelected]}
                      onPress={() => {
                        handleChange("createdfor", item.value); // ✅ same logic
                        setOpenFor(false);
                      }}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {item.label}
                      </Text>

                      {selected ? <Text style={styles.checkMark}>✓</Text> : null}
                    </TouchableOpacity>
                  );
                })}
              </Pressable>
            </Pressable>
          </Modal>

        </View>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={form.name}
          onChangeText={(t) => handleChange("name", t)}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
        />

        <TextInput
          placeholder="Phone Number "
          keyboardType="number-pad"
          style={styles.input}
          maxLength={10}
          value={form.phone}
          onChangeText={(t) => handleChange("phone", t.replace(/[^0-9]/g, ""))}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={form.password}
          onChangeText={(t) => handleChange("password", t)}
        />

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={onRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>


      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    paddingVertical: 30,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 130,
    marginBottom: 25,
  },
  input: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 15,
  },
  dropdownWrap: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  registerBtn: {
    backgroundColor: "#ff4e50",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginTop: 18,
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loginText: {
    color: "#444",
  },
  loginLink: {
    color: "#ff4e50",
    fontWeight: "600",
  },
  dropdownField: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 52,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: "#ececec",
  },
  dropdownText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },
  dropdownIcon: {
    fontSize: 18,
    color: "#555",
    marginTop: -2,
  },


  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 19,
    overflow: "hidden",

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionRowSelected: {
    backgroundColor: "#fff3f3",
  },
  optionText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",

  },
  optionTextSelected: {
    color: "#ff4e50",
  },
  checkMark: {
    fontSize: 16,
    color: "#ff4e50",
    fontWeight: "900",
  },

});
