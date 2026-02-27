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

  const [otp, setOtp] = useState("");
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

      const res = await axios.post(VERIFY_OTP_API, {
        phone,
        otp,
      });

      console.log("VERIFY OTP RESPONSE 👉", res.data);

      if (!res.data?.success) {
        showModal(res.data?.message || "OTP verification failed", "error");

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
      showModal("OTP verified successfully", "success");

      setTimeout(() => {
        setModalVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }, 1200);

    } catch (error) {
      showModal("Invalid or expired OTP", "error");
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
        showModal("Phone number missing", "error");
        return;
      }

      const res = await axios.post(RESEND_OTP_API, { phone });

      if (res.data?.success) {
        showModal("New OTP sent to your mobile", "success");

        setTimeout(() => {
          setModalVisible(false);
        }, 1200);
      } else {
        showModal(res.data?.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      showModal("Unable to resend OTP", "error");
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
          placeholderTextColor="#777" 
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
