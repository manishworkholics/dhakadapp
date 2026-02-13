import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppModal from "../components/AppModal";

const FORGOT_API = "http://143.110.244.163:5000/api/auth/forgot-password";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSendOtp = async () => {
    if (loading) return;
    if (!email) return showModal("Enter Email First", "error");
    if (!isValidEmail(email)) return showModal("Enter valid email", "error");

    try {
      setLoading(true);

      const res = await axios.post(FORGOT_API, { email });

      // ✅ web jaisa debugOtp store
      if (res?.data?.debugOtp) {
        await AsyncStorage.setItem("debugOtp", String(res.data.debugOtp));
      }

      // ✅ web jaisa resetEmail store
      await AsyncStorage.setItem("resetEmail", email);

      showModal("OTP Sent to Email", "success");

      setTimeout(() => {
        navigation.navigate("VerifyForgotOtp", { email });
      }, 900);
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Your Password</Text>

        <Text style={styles.label}>Enter Registered Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={onSendOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 14 }}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    justifyContent: "center",
    padding: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
    color: "#111",
  },
  label: {
    fontWeight: "800",
    color: "#6B6B6B",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E7EE",
    backgroundColor: "#FBFBFD",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111",
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#D4AF37",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "900",
  },
  backText: {
    textAlign: "center",
    color: "#D4AF37",
    fontWeight: "900",
  },
});
