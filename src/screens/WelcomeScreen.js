import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
            <Icon name="log-in-outline" size={22} color="#333" />
            <Text style={styles.optionText}> Login</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => navigation.navigate("Register")}
        >
          <View style={styles.row}>
            <Icon name="person-add-outline" size={22} color="#333" />
            <Text style={styles.optionText}> Register</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => navigation.navigate("Home")}
          
        >
          <View style={styles.row}>
            <Icon name="person-outline" size={22} color="#333" />
            <Text style={styles.optionText}> Continue as Guest</Text>
          </View>
        </TouchableOpacity> */}

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
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 5,
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
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
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
