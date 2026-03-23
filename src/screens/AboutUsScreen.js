import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.42;

export default function AboutUsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3EEF7" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Icon name="arrow-back" size={24} color="#1E1E1E" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>About Us</Text>

          <View style={styles.rightSpace} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.card}>
            {/* Top Banner */}
            <View style={styles.topBanner}>
              <Text style={styles.topBannerText}>Lakhs of Happy Marriages</Text>
            </View>

            {/* Image Area */}
            <View style={styles.imageSection}>
              <View style={styles.circleWrap}>
                <Image
                  source={require("../assets/images/couple 1.png")}
                  style={[styles.circleImage, styles.leftCircle]}
                />
                <Image
                 source={require("../assets/images/about1.png")}
                  style={[styles.circleImage, styles.rightCircle]}
                />
              </View>
            </View>

            {/* Content */}
            <View style={styles.textSection}>
              <Text style={styles.welcomeText}>Welcome To</Text>
              <Text style={styles.brandText}>Dhakad Metrimony</Text>

              <Text style={styles.description}>
                a trusted platform dedicated to bringing together individuals and
                families from the Dhakad community. Our mission is to help you
                find a life partner who shares your values, traditions, and
                vision for the future.
              </Text>

              <Text style={styles.description}>
                We understand that marriage is not just a bond between two
                individuals, but a union of families. That’s why Dhakad
                Matrimony focuses on authenticity, compatibility, and cultural
                harmony.
              </Text>

              <Text style={styles.description}>
                Our platform offers a safe, reliable, and easy-to-use
                experience, ensuring genuine profiles and meaningful
                connections. With deep respect for Dhakad traditions and modern
                lifestyle needs, we aim to bridge the gap between tradition and
                technology.
              </Text>

              <Text style={styles.description}>
                Whether you are looking for a partner for yourself or for a
                loved one, Dhakad Matrimony is committed to making your journey
                simple, respectful, and successful.
              </Text>

              {/* Optional info blocks */}
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Our Mission</Text>
                <Text style={styles.infoText}>
                  To provide a trusted and meaningful matrimonial platform for
                  the Dhakad community.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Our Vision</Text>
                <Text style={styles.infoText}>
                  To become the most reliable and respected matrimony platform
                  for genuine and successful matches.
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
      <Footer/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3EEF7",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3EEF7",
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#F3EEF7",
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
  },

  rightSpace: {
    width: 34,
  },

  content: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#F8F6F3",
    borderRadius: 0,
    overflow: "hidden",
  },

  topBanner: {
    height: 78,
    backgroundColor: "#6D2606",
    justifyContent: "center",
    alignItems: "center",
  },

  topBannerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },

  imageSection: {
    backgroundColor: "#F8F6F3",
    paddingTop: 42,
    paddingBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
  },

  circleWrap: {
    width: width - 60,
    height: CIRCLE_SIZE + 40,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  circleImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: "#D4AF37",
    position: "absolute",
    backgroundColor: "#ddd",
  },

  leftCircle: {
    left: 18,
    zIndex: 1,
  },

  rightCircle: {
    right: 18,
    zIndex: 2,
  },

  textSection: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  welcomeText: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1B2A3A",
    marginBottom: 2,
  },

  brandText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#D4AF37",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 31,
    marginBottom: 10,
  },

  infoCard: {
    marginTop: 14,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8DFC9",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6D2606",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
});