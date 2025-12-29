import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          placeholder="Enter Mobile Number"
          keyboardType="number-pad"
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("EmailOtp")}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.or}>────────────── OR ──────────────</Text>

        <TouchableOpacity
          style={styles.otpBtn}
          onPress={() => navigation.navigate("Otp")}
        >
          <Text style={styles.otpBtnText}>Continue with OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerWrap}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.regText}>
            Don't have an account? <Text style={styles.regHighlight}>Create Account</Text>
          </Text>
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
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
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
  loginBtn: {
    backgroundColor: "#ff4e50",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  loginBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  or: {
    color: "#999",
    marginVertical: 18,
  },
  otpBtn: {
    backgroundColor: "#7f0000",
    width: "100%",
    padding: 12,
    borderRadius: 10,
  },
  otpBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
  registerWrap: {
    marginTop: 18,
  },
  regText: {
    color: "#666",
  },
  regHighlight: {
    color: "#ff4e50",
    fontWeight: "600",
  },
});
