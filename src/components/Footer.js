
// src/components/Footer.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function Footer() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const isActive = (screen) => currentRoute === screen;

  return (
    <View style={styles.footer}>
      {/* HOME */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Home")}
      >
        <Entypo
          name="home"
          size={22}
          color={isActive("Home") ? "#FFD700" : "white"}
        />
        <Text
          style={[
            styles.text,
            isActive("Home") && styles.activeText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* MATCHES */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Matches")}
      >
        <Icon
          name="users"
          size={22}
          color={isActive("Matches") ? "#FFD700" : "white"}
        />
        <Text
          style={[
            styles.text,
            isActive("Matches") && styles.activeText,
          ]}
        >
          Matches
        </Text>
      </TouchableOpacity>

      {/* CHAT */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Chat")}
      >
        <AntDesign
          name="wechat"
          size={22}
          color={isActive("Chat") ? "#FFD700" : "white"}
        />
        <Text
          style={[
            styles.text,
            isActive("Chat") && styles.activeText,
          ]}
        >
          Chat
        </Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Profile")}
      >
        <Icon
          name="user"
          size={22}
          color={isActive("Profile") ? "#FFD700" : "white"}
        />
        <Text
          style={[
            styles.text,
            isActive("Profile") && styles.activeText,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>

      {/* PREMIUM */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Premium")}
      >
        <FontAwesome5
          name="crown"
          size={18}
          color={isActive("Premium") ? "#FFD700" : "white"}
        />
        <Text
          style={[
            styles.text,
            isActive("Premium") && styles.activeText,
          ]}
        >
          Premium
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 75, 75, 1)",
    borderTopWidth: 1,
    borderColor: "rgba(255, 75, 75, 1)",
    zIndex: 100,
    elevation: 10,
  },

  item: {
    alignItems: "center",
  },

  text: {
    color: "white",
    fontSize: 12,
    marginTop: 3,
  },

  activeText: {
    color: "#FFD700",
    fontWeight: "700",
  },
});
