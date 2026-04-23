// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

// export default function AppModal({
//   visible,
//   message,
//   type = "success",
//   onClose,
// }) {
//   const title =
//     type === "success" ? "Success" : type === "warning" ? "Warning" : "Error";

//   const accent =
//     type === "success" ? "#22c55e" :
//     type === "warning" ? "#f59e0b" :
//     "#ff4d4f"; // your app red tone

//   return (
//     <Modal transparent visible={visible} animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.container}>
          
//           {/* Accent Top Line */}
//           <View style={[styles.accent, { backgroundColor: accent }]} />

//           <Text style={styles.title}>{title}</Text>

//           <Text style={styles.message}>{message}</Text>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: "#ff4d4f" }]}
//             onPress={onClose}
//           >
//             <Text style={styles.buttonText}>OK</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   container: {
//     width: "100%",
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 22,
//     alignItems: "center",
//     elevation: 10,
//   },
//   accent: {
//     height: 5,
//     width: "40%",
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#111",
//     marginBottom: 10,
//   },
//   message: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#555",
//     marginBottom: 20,
//     fontWeight: "600",
//     lineHeight: 20,
//   },
//   button: {
//     paddingHorizontal: 40,
//     paddingVertical: 12,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },
// });


import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AppModal({
  visible,
  message,
  type = "success",
  onClose,
}) {
  const config = {
    success: {
      title: "Success",
      color: "#22c55e",
      icon: "checkmark-circle",
    },
    warning: {
      title: "Warning",
      color: "#f59e0b",
      icon: "alert-circle",
    },
    error: {
      title: "Error",
      color: "#ff4d4f",
      icon: "close-circle",
    },
  };

  const { title, color, icon } = config[type] || config.success;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* 🔥 ICON CIRCLE */}
          <View style={[styles.iconWrapper, { backgroundColor: color + "20" }]}>
            <Ionicons name={icon} size={42} color={color} />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>{title}</Text>

          {/* MESSAGE */}
          <Text style={styles.message}>{message}</Text>

          {/* BUTTON */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={onClose}
            activeOpacity={0.8}
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
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",

    // 🔥 Premium shadow
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 22,
    fontWeight: "500",
    lineHeight: 20,
    flexShrink: 1,
  },

  button: {
    width: "70%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});