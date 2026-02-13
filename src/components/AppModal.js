import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AppModal({
    visible,
    message,
    type = "success", // success | warning | error
    onClose,
}) {
    if (!visible) return null;

    const title =
        type === "success" ? "Success" : type === "warning" ? "Warning" : "Error";

    const color =
        type === "success" ? "#22c55e" : type === "warning" ? "#f59e0b" : "#ef4444";

    return (
        <View style={styles.overlay}>
            <View style={styles.box}>
                <Text style={[styles.title, { color }]}>{title}</Text>

                <Text style={styles.text}>{message}</Text>

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: color }]}
                    onPress={onClose}
                >
                    <Text style={styles.btnText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
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
    box: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 22,
        borderRadius: 14,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 16,
        color: "#333",
        fontWeight: "600",
    },
    btn: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
    },
    btnText: {
        color: "#fff",
        fontWeight: "700",
    },
});
