import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { useProfile } from "../context/ProfileContext";

const VERIFY_OTP_API = "http://143.110.244.163:5000/api/auth/verify-otp";
const RESEND_OTP_API = "http://143.110.244.163:5000/api/auth/send-otp";

export default function MobileOtpScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // success | warning | error

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

  const navigation = useNavigation();
  const { bootstrap } = useProfile();

  const [otp, setOtp] = useState(""); // we will keep string
  const inputRefs = useRef([]); // refs array
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  /* 🔹 VERIFY OTP */
  const verifyOtp = async () => {
    if (otp.length !== 4) {
      showModal("Please enter a valid 4-digit OTP", "error");
      return;
    }

    try {
      setLoading(true);

      const phone = await AsyncStorage.getItem("phone");
      if (!phone) {
        showModal("Phone number missing. Please login again.", "error");
        navigation.replace("Login");
        return;
      }

      const res = await axios.post(VERIFY_OTP_API, { phone, otp });

      if (!res.data?.success) {
        showModal(res.data?.message || "OTP verification failed", "error");
        setOtp("");
        // focus first box again
        inputRefs.current?.[0]?.focus?.();
        return;
      }

      await AsyncStorage.multiRemove(["token", "user"]);
      delete axios.defaults.headers.common["Authorization"];

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      await bootstrap();
      showModal("OTP verified successfully", "success");

      setTimeout(() => {
        setModalVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }, 1200);
    } catch (error) {
      showModal("User Registered SuccessFully . Panding For Admin approval .After approval you will be able to Login", "error");
      setOtp("");
      inputRefs.current?.[0]?.focus?.();
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
        showModal("Phone number missing", "error");
        return;
      }

      const res = await axios.post(RESEND_OTP_API, { phone });

      if (res.data?.success) {
        showModal("New OTP sent to your mobile", "success");
        setTimeout(() => setModalVisible(false), 1200);

        setOtp("");
        inputRefs.current?.[0]?.focus?.();
      } else {
        showModal(res.data?.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      showModal("Unable to resend OTP", "error");
    } finally {
      setResending(false);
    }
  };

  // ✅ OTP change with auto-focus (safe)
  const handleOtpChange = (text, index) => {
    const digit = (text || "").replace(/[^0-9]/g, "");
    if (!digit) return;

    // ensure length 4
    const arr = otp.split("");
    while (arr.length < 4) arr.push("");

    arr[index] = digit[digit.length - 1]; // last typed digit
    const nextOtp = arr.join("").slice(0, 4);
    setOtp(nextOtp);

    // move to next
    if (index < 3) {
      inputRefs.current?.[index + 1]?.focus?.();
    }
  };

  // ✅ Backspace support: empty current -> go previous
  const handleKeyPress = (e, index) => {
    if (e?.nativeEvent?.key !== "Backspace") return;

    const arr = otp.split("");
    while (arr.length < 4) arr.push("");

    // if current already empty, go prev
    if (!arr[index] && index > 0) {
      inputRefs.current?.[index - 1]?.focus?.();
      return;
    }

    // clear current digit
    arr[index] = "";
    setOtp(arr.join("").slice(0, 4));
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack("Login")}
        activeOpacity={0.8}
      >
         <Icon name="arrow-back-sharp" size={26} color="black" />
      </TouchableOpacity>

      {/* Top Illustration */}
      <Image
        source={require("../assets/images/logo-dark.png")}
        style={styles.illus}
        resizeMode="contain"
      />

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your SMS</Text>

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {[0, 1, 2, 3].map((i) => (
          <TextInput
            key={i}
            ref={(ref) => {
              if (ref) inputRefs.current[i] = ref; // ✅ null guard
            }}
            value={otp[i] ? otp[i] : ""}
            onChangeText={(t) => handleOtpChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpBox}
            textAlign="center"
            autoFocus={i === 0}
          />
        ))}
      </View>

      {/* Resend */}
      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive OTP?</Text>
        <TouchableOpacity
          onPress={resendOtp}
          disabled={resending}
          activeOpacity={0.8}
        >
          <Text style={styles.resendBtnText}>
            {resending ? " RESENDING..." : " RESEND OTP"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyBtn, loading && { opacity: 0.8 }]}
        onPress={verifyOtp}
        disabled={loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyBtnText}>VERIFY OTP</Text>
        )}
      </TouchableOpacity>

      {/* ✅ YOUR EXISTING CUSTOM MODAL (UNCHANGED) */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View
              style={[
                styles.modalTopLine,
                modalType === "success" && { backgroundColor: "#22c55e" },
                modalType === "warning" && { backgroundColor: "#f59e0b" },
                modalType === "error" && { backgroundColor: "#ef4444" },
              ]}
            />

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
              activeOpacity={0.85}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },

  backBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop:25
  },
  backIcon: {
    fontSize: 34,
    color: "#111",
    marginTop: -6,
  },

  illus: {
    width: "90%",
    height: 100,
    marginTop: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 88,
    color: "#111",
  
   
  },
  subtitle: {
    fontSize: 12.5,
    color: "#777",
    marginTop: 6,
    marginBottom: 22,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 10,
  },

  otpBox: {
    width: 54,
    height: 54,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: "#DC143C",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "800",
    color: "#111",
    elevation: 3,
  },

  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 28,
  },
  resendText: {
    fontSize: 12.5,
    color: "#666",
  },
  resendBtnText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#e11d48",
  },

  verifyBtn: {
    width: "85%",
    backgroundColor: "#DC143C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    marginTop:-15
   
  },
  verifyBtnText: {
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 1,
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
    width: "82%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 14,
    alignItems: "center",
  },

  modalTopLine: {
    width: "65%",
    height: 4,
    borderRadius: 99,
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
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