import React, { useState } from "react";
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
import { useProfile } from "../context/ProfileContext"; 

const VERIFY_OTP_API = "http://143.110.244.163:5000/api/auth/verify-otp";
const RESEND_OTP_API = "http://143.110.244.163:5000/api/auth/send-otp";

export default function MobileOtpScreen() {
  const navigation = useNavigation();
  const { bootstrap } = useProfile(); 

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  /* 🔹 VERIFY OTP */
  const verifyOtp = async () => {
    if (otp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const phone = await AsyncStorage.getItem("phone");
      if (!phone) {
        Alert.alert("Error", "Phone number missing. Please login again.");
        navigation.replace("Login");
        return;
      }

      const res = await axios.post(VERIFY_OTP_API, {
        phone,
        otp,
      });

      console.log("VERIFY OTP RESPONSE 👉", res.data);

      if (!res.data?.success) {
        Alert.alert(
          "Invalid OTP",
          res.data?.message || "OTP verification failed"
        );
        setOtp("");
        return;
      }

      // ✅ CLEAR OLD SESSION (IMPORTANT)
      await AsyncStorage.multiRemove(["token", "user"]);
      delete axios.defaults.headers.common["Authorization"];

      // ✅ SAVE NEW AUTH DATA
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ SET AXIOS HEADER FOR ALL NEXT API CALLS
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      // ✅ MOST IMPORTANT: refresh ProfileContext for NEW USER
      await bootstrap();

      Alert.alert("Success", "OTP verified successfully");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.log("OTP VERIFY ERROR 👉", error?.response?.data || error.message);
      Alert.alert("Error", "Invalid or expired OTP");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 RESEND OTP */
  const resendOtp = async () => {
    try {
      setResending(true);

      const phone = await AsyncStorage.getItem("phone");
      if (!phone) {
        Alert.alert("Error", "Phone number missing");
        return;
      }

      const res = await axios.post(RESEND_OTP_API, { phone });

      if (res.data?.success) {
        Alert.alert("OTP Sent", "New OTP sent to your mobile");
      } else {
        Alert.alert("Failed", res.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your SMS</Text>

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
            {resending ? "Resending..." : "Resend OTP?"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES (UNCHANGED DESIGN) ================= */

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
  input: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 4,
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
    textAlign: "center",
  },
  resend: {
    color: "#ff4e50",
    fontWeight: "600",
    marginTop: 20,
  },
});
