import React, { useEffect, useState } from "react";
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
import Ionicons from "react-native-vector-icons/Ionicons"; // 👈 add this

const RESET_API = "http://143.110.244.163:5000/api/auth/reset-password";

export default function ResetPasswordScreen({ navigation, route }) {
  const routeEmail = route?.params?.email;

  const [email, setEmail] = useState(routeEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👇 NEW STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

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

  const onSave = async () => {
    if (!password) return showModal("Enter new password", "error");
    if (password.length < 6)
      return showModal("Password must be at least 6 characters", "error");
    if (password !== confirmPassword)
      return showModal("Passwords do not match", "error");

    try {
      setLoading(true);

      const res = await axios.post(RESET_API, {
        email,
        newPassword: password,
      });

      if (res.data?.success === false) {
        showModal(res.data?.message || "Something went wrong", "error");
        return;
      }

      showModal("Password Updated!", "success");

      await AsyncStorage.multiRemove(["resetEmail", "debugOtp"]);

      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }, 1200);
    } catch (err) {
      showModal(err?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create New Password</Text>

        {/* 🔐 PASSWORD FIELD */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter New Password"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            placeholderTextColor="#8a8a8a"
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* 🔐 CONFIRM PASSWORD FIELD */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            value={confirmPassword}
            placeholderTextColor="#8a8a8a"
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={onSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Save Password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 14 }}
        >
          <Text style={styles.link}>
            Remember password? <Text style={styles.linkBold}>Login Now</Text>
          </Text>
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
    backgroundColor: "#FDFBF7",
    justifyContent: "center",
    padding: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
    color: "#111",
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
    marginTop: 4,
  },
  btnText: { color: "#fff", fontWeight: "900" },
  link: { textAlign: "center", color: "#6B7280", fontWeight: "700" },
  linkBold: { color: "#D4AF37", fontWeight: "900" },

  inputWrapper: {
  position: "relative",
  justifyContent: "center",
},

eyeIcon: {
  position: "absolute",
  right: 12,
},
});
