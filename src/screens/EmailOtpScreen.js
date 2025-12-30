import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EmailOtpScreen() {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");

  const verifyOtp = () => {
    if (!otp) return Alert.alert("Enter OTP!");
    // later add API verify
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>

        <TextInput
          placeholder="Enter 6 digit OTP"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
          <Text style={styles.verifyBtnText}>Verify & Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.resend}>Resend OTP?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    marginBottom: 18
  },
  input: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 4
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
