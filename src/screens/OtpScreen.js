import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const VERIFY_OTP_API =
  "http://143.110.244.163:5000/api/auth/verify-email-otp";
const RESEND_OTP_API =
  "http://143.110.244.163:5000/api/auth/resend-email-otp";

export default function OtpScreen() {
  const navigation = useNavigation();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 min
  const [expired, setExpired] = useState(false);

  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

  /* 🔹 TIMER */
  useEffect(() => {
    if (timer <= 0) {
      setExpired(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* 🔹 OTP INPUT HANDLER */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 3) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  /* 🔹 INVALID OTP */
  const handleInvalidOtp = () => {
    Alert.alert("Invalid OTP", "Please try again.");
    setOtp(["", "", "", ""]);
    setTimeout(() => inputRefs.current[0].current.focus(), 200);
  };

  /* 🔹 VERIFY OTP */
  const verifyOtp = async () => {
    if (expired) {
      Alert.alert("OTP Expired", "Please resend OTP");
      return;
    }

    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) {
      Alert.alert("Error", "Please enter valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const email = await AsyncStorage.getItem("email");
      const tempToken = await AsyncStorage.getItem("tempToken");

      if (!email || !tempToken) {
        Alert.alert("Session Expired", "Please login again");
        navigation.replace("Login");
        return;
      }

      const res = await axios.post(
        VERIFY_OTP_API,
        { email, otp: finalOtp },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      if (!res.data?.success) {
        handleInvalidOtp();
        return;
      }

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      await AsyncStorage.removeItem("tempToken");

      Alert.alert("Success", "Email verified successfully");

      navigation.reset({
        index: 0,
        routes: [{ name: "CreateProfile" }],
      });
    } catch (error) {
      handleInvalidOtp();
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 RESEND OTP */
  const resendOtp = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      if (!email) return;

      await axios.post(RESEND_OTP_API, { email });

      setTimer(300);
      setExpired(false);
      setOtp(["", "", "", ""]);
      Alert.alert("OTP Sent", "New OTP sent to your email");
    } catch {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={inputRefs.current[i]}
              value={digit}
              onChangeText={(v) => handleOtpChange(v, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpInput}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={verifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={resendOtp} disabled={!expired}>
          <Text style={styles.resend}>
            {expired
              ? "Resend OTP?"
              : `Resend in ${Math.floor(timer / 60)}:${(
                  timer % 60
                )
                  .toString()
                  .padStart(2, "0")}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 18,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 18,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 18,
  },
  otpInput: {
    width: 55,
    height: 55,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  verifyBtn: {
    backgroundColor: "#ff4e50",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resend: {
    color: "#ff4e50",
    fontWeight: "600",
    marginTop: 20,
  },
});
