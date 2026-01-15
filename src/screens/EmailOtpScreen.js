import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE = "http://143.110.244.163:5000/api";

export default function EmailOtpScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const email = route?.params?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      return Alert.alert("Invalid OTP", "Please enter valid 4 digit OTP");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/auth/verify-email-otp`,
        { email, otp }
      );

      if (res.data.success) {
        const token = res.data.token;
        const user = res.data.user;

        // clear old cache
        await AsyncStorage.multiRemove([
          "ownProfile",
          "userPlan",
          "phone"
        ]);

        // save new session
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Success", "Email verified successfully!");

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }

    } catch (err) {
      Alert.alert(
        "Verification Failed",
        err?.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */

  const resendOtp = async () => {
    try {
      setResending(true);

      await axios.post(`${API_BASE}/auth/resend-email-otp`, { email });

      Alert.alert("OTP Sent", "New OTP sent to your email");

    } catch (err) {
      Alert.alert("Failed", "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          OTP sent to {email}
        </Text>

        <TextInput
          placeholder="Enter 4 digit OTP"
          keyboardType="number-pad"
          maxLength={4}
          style={styles.input}
          value={otp}
          onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, ""))}
        />

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

        <TouchableOpacity onPress={resendOtp} disabled={resending}>
          <Text style={styles.resend}>
            {resending ? "Sending..." : "Resend OTP?"}
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
    alignItems: "center"
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 18,
    elevation: 4,
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 18,
    textAlign: "center"
  },
  input: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 6
  },
  verifyBtn: {
    backgroundColor: "#ff4e50",
    width: "100%",
    padding: 14,
    borderRadius: 10
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  resend: {
    color: "#ff4e50",
    fontWeight: "600",
    marginTop: 20
  }
});
