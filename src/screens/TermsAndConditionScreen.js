import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
// import Footer from "../components/Footer";

export default function TermsAndConditionScreen() {
  const navigation = useNavigation();

  const termsData = [
    {
      title: "1. Account Responsibility",
      desc: "Users are responsible for maintaining the confidentiality of their account details and for all activities that occur under their account.",
    },
    {
      title: "2. Profile Information",
      desc: "All information submitted by users must be true, accurate, and updated. Fake or misleading profiles may be removed without notice.",
    },
    {
      title: "3. Membership Plans",
      desc: "Premium services are available through paid plans. Features may vary depending on the selected membership.",
    },
    {
      title: "4. Prohibited Activities",
      desc: "Users must not misuse the platform, harass others, upload harmful content, or use the service for unlawful purposes.",
    },
    {
      title: "5. Privacy",
      desc: "Your personal information will be handled according to our privacy practices. We aim to keep your data secure and protected.",
    },
    {
      title: "6. Termination",
      desc: "We reserve the right to suspend or terminate accounts that violate these terms or misuse the platform.",
    },
    {
      title: "7. Updates",
      desc: "Terms and conditions may be updated from time to time. Continued use of the app means you accept the updated terms.",
    },
  ];

  
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F2FA" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Icon name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Terms & Conditions</Text>

          <View style={styles.rightSpace} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Top Banner */}
          <View style={styles.topBanner}>
            <Text style={styles.topBannerText}>Dhakad Matrimony Policy</Text>
          </View>

          {/* Intro Card */}
          <View style={styles.introCard}>
            <Text style={styles.title}>Welcome to Dhakad Matrimony</Text>
            <Text style={styles.text}>
              By using this app, you agree to follow our terms and conditions.
              Please read them carefully before using any services.
            </Text>
          </View>

          {/* Terms List */}
          {termsData.map((item, index) => (
            <View key={index} style={styles.termCard}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <Text style={styles.text}>{item.desc}</Text>
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
      {/* <Footer/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F2FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F6F2FA",
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#F6F2FA",
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  rightSpace: {
    width: 34,
  },

  content: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  topBanner: {
    height: 60,
    backgroundColor: "#6D2606",
    borderRadius: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    
  },

  topBannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECE6D8",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D4AF37",
    marginBottom: 10,
  },

  termCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE7D7",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF8C00",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
  },
});