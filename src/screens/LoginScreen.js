import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EMAIL_LOGIN_API =
  "http://143.110.244.163:5000/api/auth/email-login";

const SEND_OTP_API =
  "http://143.110.244.163:5000/api/auth/send-otp";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [loginMode, setLoginMode] = useState("email"); // email | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= EMAIL LOGIN ================= */
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(EMAIL_LOGIN_API, {
        email,
        password,
      });

      const data = res?.data;
      console.log("EMAIL LOGIN 👉", data);

      if (!data?.success) {
        Alert.alert("Login Failed", data?.message || "Invalid credentials");
        return;
      }

      // 🔐 EMAIL OTP REQUIRED
      if (data?.requiresVerification) {
        await AsyncStorage.setItem("tempEmail", email);

        if (data?.debugOtp) {
          await AsyncStorage.setItem("debugOtp", String(data.debugOtp));
        }

        Alert.alert("OTP Sent", "Please verify OTP sent to your email");
        navigation.navigate("EmailOtp");
        return;
      }

      // ✅ DIRECT LOGIN
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= MOBILE OTP ================= */
  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert("Invalid Number", "Enter valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(SEND_OTP_API, {
        phone,
      });

      console.log("SEND OTP 👉", res.data);

      if (res.data?.success) {
        await AsyncStorage.setItem("phone", phone);
        Alert.alert("OTP Sent", "OTP sent to your mobile number");
        navigation.navigate("MobileOtp");
      } else {
        Alert.alert("Failed", res.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Server error"
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

        {/* ================= EMAIL LOGIN ================= */}
        {loginMode === "email" && (
          <>
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
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ================= OTP LOGIN ================= */}
        {loginMode === "otp" && (
          <>
            <TextInput
              placeholder="Enter Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              value={phone}
              onChangeText={(t) =>
                setPhone(t.replace(/[^0-9]/g, ""))
              }
            />

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.or}>──────────── OR ────────────</Text>

        {/* 🔁 TOGGLE LOGIN MODE */}
        <TouchableOpacity
          style={styles.otpBtn}
          onPress={() =>
            setLoginMode(loginMode === "email" ? "otp" : "email")
          }
        >
          <Text style={styles.otpBtnText}>
            {loginMode === "email"
              ? "Login with OTP"
              : "Login with Email"}
          </Text>
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
