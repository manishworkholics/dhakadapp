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
import { useProfile } from "../context/ProfileContext";

const EMAIL_LOGIN_API = "http://143.110.244.163:5000/api/auth/email-login";
const SEND_OTP_API = "http://143.110.244.163:5000/api/auth/send-otp";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { bootstrap } = useProfile(); // ✅ ADD

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // success | warning | error


  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };



  const [loginMode, setLoginMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      showModal("Email and password are required", "warning");


      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(EMAIL_LOGIN_API, { email, password });
      const data = res.data;

      if (!data.success) {
        showModal(data.message || "Invalid credentials", "error");
        return;
      }

      if (data.requiresVerification) {
        navigation.navigate("EmailOtp", { email: data.user.email });
        return;
      }

      // ✅ remove old session + old caches (user-wise remove we do in logout too)
      await AsyncStorage.multiRemove(["token", "user", "phone"]);

      // ✅ save new session
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // ✅ set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // ✅ VERY IMPORTANT: refresh context for new user
      // await bootstrap();

      // ✅ reset to home
      showModal("Login successful", "success");

      setTimeout(async () => {
        await bootstrap();

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }, 1200);

    } catch (error) {
      showModal(error?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {

      showModal("Enter valid 10-digit mobile number", "error");
      return;
    }

    try {
      setLoading(true);

      // ✅ YAHI SABSE IMPORTANT FIX HAI
      await AsyncStorage.multiRemove(["token", "user"]);
      delete axios.defaults.headers.common["Authorization"];

      const res = await axios.post(SEND_OTP_API, { phone });

      if (res.data?.success) {
        await AsyncStorage.setItem("phone", phone);
        showModal("OTP sent to your mobile number", "success");

        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate("MobileOtp");
        }, 1200);
      } else {

        showModal("Failed", res.data?.message || "Failed to send OTP", "error");
      }
    } catch (error) {

      showModal("Error", error?.response?.data?.message || "Server error", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.card}>
        <Image
          source={require("../assets/images/logo-dark.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subTitle}>Login to continue</Text>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, loginMode === "email" && styles.tabActive]}
            onPress={() => setLoginMode("email")}
          >
            <Text
              style={[
                styles.tabText,
                loginMode === "email" && styles.tabTextActive,
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, loginMode === "otp" && styles.tabActive]}
            onPress={() => setLoginMode("otp")}
          >
            <Text
              style={[
                styles.tabText,
                loginMode === "otp" && styles.tabTextActive,
              ]}
            >
              OTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* EMAIL */}
        {loginMode === "email" && (
          <>
            <TextInput
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordWrap}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#9AA0A6"
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
              onPress={handleEmailLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* OTP */}
        {loginMode === "otp" && (
          <>
            <TextInput
              placeholder="Enter Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
            />

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSendOtp}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.divider} />
        </View>

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

      <Text style={styles.footerText}>Secure • Verified • Trusted</Text>


      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text
              style={[
                styles.modalTitle,
                modalType === "success" && { color: "#22c55e" },
                modalType === "warning" && { color: "#f59e0b" },
                modalType === "error" && { color: "#ef4444" },
              ]}
            >
              {modalType === "success"
                ? "Success"
                : modalType === "warning"
                  ? "Warning"
                  : "Error"}
            </Text>

            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                modalType === "success" && { backgroundColor: "#22c55e" },
                modalType === "warning" && { backgroundColor: "#f59e0b" },
                modalType === "error" && { backgroundColor: "#ef4444" },
              ]}
              onPress={() => {
                if (modalType !== "success") setModalVisible(false);
              }}

            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}



    </View>
  );

}

// ✅ your same styles (paste your styles here)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  bgCircle1: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255, 78, 80, 0.14)",
  },
  bgCircle2: {
    position: "absolute",
    bottom: -140,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 78, 80, 0.10)",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  logo: {
    width: 170,
    height: 70,
    alignSelf: "center",
    marginTop: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginTop: 6,
  },
  subTitle: {
    fontSize: 12.5,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F2F3F7",
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#ff4e50",
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

  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E7EE",
    backgroundColor: "#FBFBFD",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111",
  },
  showText: {
    color: "#ff4e50",
    fontWeight: "800",
    fontSize: 12.5,
  },

  loginBtn: {
    backgroundColor: "#ff4e50",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E9EAF1",
  },
  or: {
    marginHorizontal: 10,
    color: "#9CA3AF",
    fontWeight: "800",
    fontSize: 12,
  },

  registerWrap: {
    alignItems: "center",
    paddingVertical: 8,
  },
  regText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },
  regHighlight: {
    color: "#ff4e50",
    fontWeight: "900",
  },

  footerText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },

  // custom model styles

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },


  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 14,
    alignItems: "center",
  },

  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
    fontWeight: "600",
  },

  modalBtn: {
    backgroundColor: "#ff4e50",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
  },


});

