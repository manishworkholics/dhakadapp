import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      {/* TOP WELCOME IMAGE */}
      <Image
        source={require("../assets/images/welcomlogoapp.png")} // 👈 yaha apna path dalna
        style={styles.welcomeImg}
        resizeMode="contain"
      />

      <View style={styles.card}>

        <Image
          source={require("../assets/images/logo-dark.png")}
          style={styles.logo}
        />

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <View style={styles.row}>
            <Icon name="log-in-outline" size={25} color="black" />
            <Text style={styles.optionText}> Login</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => navigation.navigate("Register")}
        >
          <View style={styles.row}>
            <Icon name="person-add-outline" size={23} color="black" />
            <Text style={styles.optionText}> Register</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.redBtn}
          onPress={() => navigation.navigate("Register")}
        >
          <View style={styles.row}>
            <Text style={styles.redBtnText}>Continue </Text>
            <Icon name="arrow-forward-outline" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4B4B",
    alignItems: "center",
    justifyContent: "flex-start",   // ⭐ center ki jagah top
    paddingTop: 40,
  },

  welcomeImg: {
    width: "80%",
    height: 300,      // ⭐ image choti hogi
    resizeMode: "contain",
    marginBottom: -100, // ⭐ card ke paas aa jayegi
  },

  card: {
    width: "90%",
    padding: 30,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 15,
    alignItems: "center",
  },

  logo: {
    width: 180,
    height: 120,
    marginBottom: 25,
  },

  optionBtn: {
    backgroundColor: "#f8f8f8",
    width: "100%",
    padding: 13,
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 0.5,
    borderColor: "gray",
  },

  optionText: {
    fontSize: 17,
    color: "black",
    marginLeft: 15,
    fontWeight: "600",
  },

  redBtn: {
    backgroundColor: "#ff4e50",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
  },

  redBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});