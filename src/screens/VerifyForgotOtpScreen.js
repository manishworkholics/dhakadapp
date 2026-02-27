import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AppModal from "../components/AppModal";

const VERIFY_API = "http://143.110.244.163:5000/api/auth/verify-forgot-otp";
const RESEND_API = "http://143.110.244.163:5000/api/auth/forgot-password";

export default function VerifyForgotOtpScreen({ navigation, route }) {
  // ✅ web jaisa: local storage se email
  const routeEmail = route?.params?.email;

  const [email, setEmail] = useState(routeEmail || "");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  const [loading, setLoading] = useState(false);

  // ✅ web jaisa timer
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // ✅ AppModal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      const storedEmail = await AsyncStorage.getItem("resetEmail");
      const finalEmail = storedEmail || routeEmail;

      if (!finalEmail) {
        showModal("Email missing", "error");
        setTimeout(() => navigation.replace("ForgotPassword"), 900);
        return;
      }
      setEmail(finalEmail);
    };
    init();
  }, [routeEmail, navigation]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);

    const id = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timer]);

  /* ---------------- OTP INPUT LOGIC ---------------- */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    // ✅ web jaisa: 4 digit complete होते ही auto submit
    if (next.join("").length === 4) {
      submitOtp(next.join(""));
    }
  };

  const handleKeyPress = (e, index) => {
    // RN: Backspace detect
    if (e?.nativeEvent?.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ---------------- SUBMIT OTP ---------------- */
  const resetOtpInputs = () => {
    setOtp(["", "", "", ""]);
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  };

  const submitOtp = async (finalOtp) => {
    if (loading) return;
    if (!email) return showModal("Email missing", "error");
    if (finalOtp.length !== 4) return showModal("Enter 4 digit OTP", "error");

    try {
      setLoading(true);

      const res = await axios.post(VERIFY_API, {
        email,
        otp: finalOtp,
      });

      // ✅ success handling
      if (res.data?.success === false) {
        showModal(res.data?.message || "Invalid OTP", "error");
        resetOtpInputs();
        return;
      }

      showModal("OTP Verified!", "success");

      setTimeout(() => {
        navigation.replace("ResetPassword", { email, otp: finalOtp });
      }, 2000);
    } catch (err) {
      showModal(err?.response?.data?.message || "Invalid OTP", "error");
      resetOtpInputs();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBtn = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) return showModal("Enter 4 digit OTP", "error");
    submitOtp(finalOtp);
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    if (!canResend) return;
    if (!email) return showModal("Email missing", "error");

    try {
      await axios.post(RESEND_API, { email });

      showModal("OTP Resent", "success");
      setTimer(30);
      setCanResend(false);
      resetOtpInputs();
    } catch (err) {
      showModal(err?.response?.data?.message || "Failed to resend OTP", "error");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backRow}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Please enter the 4-digit OTP</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              onChangeText={(t) => handleChange(t, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.otpBox,
                index === 0 ? styles.otpBoxGold : styles.otpBoxRed,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleVerifyBtn}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sentText}>
          OTP sent to <Text style={styles.bold}>{email}</Text>
        </Text>

        <Text style={styles.resendText}>
          {canResend ? (
            <Text onPress={resendOtp} style={styles.resendNow}>
              Resend OTP
            </Text>
          ) : (
            `Resend in ${timer}s`
          )}
        </Text>
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
    backgroundColor: "#FDFBF7",
    justifyContent: "center",
    padding: 18,
  },
  backRow: { position: "absolute", top: 50, left: 18 },
  backText: { fontWeight: "800", color: "#111" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    alignItems: "center",
  },

  title: { fontSize: 14, fontWeight: "800", color: "#111", marginBottom: 14 },

  otpRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    backgroundColor: "#fff",
  },
  otpBoxGold: { borderWidth: 1.5, borderColor: "#D4AF37" },
  otpBoxRed: { borderWidth: 1.5, borderColor: "#ff4e50" },

  btn: {
    width: "100%",
    backgroundColor: "#D4AF37",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 2,
  },
  btnText: { color: "#fff", fontWeight: "900" },

  sentText: { marginTop: 14, color: "#6B7280", fontWeight: "700" },
  bold: { color: "#111", fontWeight: "900" },

  resendText: { marginTop: 10, color: "#6B7280", fontWeight: "800" },
  resendNow: { color: "#ff4e50", fontWeight: "900" },
});