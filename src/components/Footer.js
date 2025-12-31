// src/components/Footer.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Home")}>
        <Icon name="home" size={22} color="white" />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Matches")}>
        <Icon name="users" size={22} color="white" />
        <Text style={styles.text}>Matches</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Chat")}>
        <Icon name="message-circle" size={22} color="white" />
        <Text style={styles.text}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Profile")}>
        <Icon name="user" size={22} color="white" />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Premium")}>
        <Icon name="award" size={22} color="white" />
        <Text style={styles.text}>Premium</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "rgba(255, 75, 75, 1)",
    backgroundColor: "rgba(255, 75, 75, 1)",
  },
  item: {
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
    marginTop: 3,
  },
});
