import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff4e50" barStyle="light-content" />

      {/* Top Highlight */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* Logo Section */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </Animated.View>

      {/* Text Section */}
      <Animated.View
        style={{
          marginTop: 26,
          opacity: fadeAnim,
          transform: [{ translateY: textAnim }],
          alignItems: "center",
        }}
      >
        <Text style={styles.appName}>Dhakad Matrimony</Text>
        <Text style={styles.tagline}>
          Where Real Connections Become Forever ❤️
        </Text>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Trusted • Verified • Premium Matches
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff4e50",
    justifyContent: "center",
    alignItems: "center",
  },

  topGlow: {
    position: "absolute",
    top: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  bottomGlow: {
    position: "absolute",
    bottom: -140,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  logoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  logo: {
    width: 135,
    height: 135,
    resizeMode: "contain",
  },

  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.6,
  },

  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  footer: {
    position: "absolute",
    bottom: 30,
  },

  footerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    letterSpacing: 0.4,
  },
});
