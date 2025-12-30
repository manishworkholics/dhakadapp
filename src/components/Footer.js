// src/components/Footer.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Matches")}>
        <Text>Matches</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
        <Text>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
});
