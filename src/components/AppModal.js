import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

export default function AppModal({
  visible,
  message,
  type = "success",
  onClose,
}) {
  const title =
    type === "success" ? "Success" : type === "warning" ? "Warning" : "Error";

  const accent =
    type === "success" ? "#22c55e" :
    type === "warning" ? "#f59e0b" :
    "#ff4d4f"; // your app red tone

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* Accent Top Line */}
          <View style={[styles.accent, { backgroundColor: accent }]} />

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ff4d4f" }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    elevation: 10,
  },
  accent: {
    height: 5,
    width: "40%",
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    fontWeight: "600",
    lineHeight: 20,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
