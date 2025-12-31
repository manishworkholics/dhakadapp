import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://143.110.244.163:5000/api/auth/email-login";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(API_URL, {
        email,
        password,
      });
console.log("API RESPONSE 👉", res.data);
      const data = res?.data;

      if (!data?.success) {
        alert(data?.message || "Login failed");
        return;
      }

      // 🔐 OTP REQUIRED
      if (data?.requiresVerification) {
        await AsyncStorage.setItem("tempEmail", email);

        // optional: for testing
        if (data?.debugOtp) {
          await AsyncStorage.setItem("debugOtp", String(data.debugOtp));
        }

        alert("OTP sent to your email");
        navigation.navigate("EmailOtp");
        return;
      }

      // ✅ DIRECT LOGIN
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      alert(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          placeholder="Enter Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordWrap}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.or}>──────────── OR ────────────</Text>

        <TouchableOpacity
          style={styles.otpBtn}
          onPress={() => navigation.navigate("Otp")}
        >
          <Text style={styles.otpBtnText}>Login with OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerWrap}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.regText}>
            Don’t have an account?{" "}
            <Text style={styles.regHighlight}>Create Account</Text>
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
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginVertical: 8,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },
  showText: {
    color: "#ff4e50",
    fontWeight: "600",
  },
  loginBtn: {
    backgroundColor: "#ff4e50",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
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
