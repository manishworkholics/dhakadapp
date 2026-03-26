import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const { height, width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={require("../assets/images/welcome-img.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.topSection}>
            <Image
              source={require("../assets/images/dhakadlogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <LinearGradient
            colors={[
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.15)",
              "rgba(0,0,0,0.45)",
              "rgba(0,0,0,0.75)",
              "rgba(0,0,0,0.95)",
            ]}
            locations={[0, 0.2, 0.45, 0.75, 1]}
            style={styles.bottomGradient}
          >
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>Your journey begins here...</Text>
          </LinearGradient>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },

  topSection: {
    alignItems: "center",
    paddingTop: 34,
  },

  logo: {
    width: 190,
    height: 110,
    alignSelf: "center",
    marginTop: 8,
  },

  bottomGradient: {
  paddingHorizontal: 28,
  paddingBottom: height * 0.05,   // ⭐ responsive
  paddingTop: height * 0.12,      // ⭐ responsive
  justifyContent: "flex-end",
},

  loginBtn: {
    width: "100%",
    backgroundColor: "#FF4D5A",
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  registerBtn: {
    width: "100%",
    backgroundColor: "#F1DB2F",
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    
  },

  registerText: {
    color: "#111",
    fontSize: 18,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    opacity: 0.95,
  },
});