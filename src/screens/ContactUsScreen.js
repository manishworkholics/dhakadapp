import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 768;

export default function ContactUsScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSend = () => {
    console.log("Form Data =>", form);
  };

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
            <Icon name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Contact Us</Text>

          <View style={{ width: 34 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Top Banner */}
          <View style={styles.topBanner}>
            <Text style={styles.topBannerText}>Lakhs of Happy Marriages</Text>
          </View>

          {/* Main Title */}
          <Text style={styles.pageTitle}>Contact For Any Query</Text>

          {/* Main Content */}
          <View
            style={[
              styles.mainRow,
              isSmallDevice && styles.mainColumn,
            ]}
          >
            {/* Left Contact Info */}
            <View style={[styles.leftCard, isSmallDevice && styles.leftCardMobile]}>
              <View style={styles.iconBlock}>
                <Icon name="location-sharp" size={42} color="#D4AF37" />
              </View>
              <Text style={styles.infoTextCenter}>
                315, Princes Business Skypark,{`\n`}
                AB Road, Vijay Nagar Indore
              </Text>

              <View style={styles.sectionGap} />

              <View style={styles.iconBlock}>
                <Icon name="call" size={40} color="#D4AF37" />
              </View>
              <Text style={styles.infoHeading}>Mobile</Text>
              <Text style={styles.infoValue}>+91 8982079600</Text>
              <Text style={styles.infoValue}>+91 8770896005-6-7</Text>

              <View style={styles.sectionGap} />

              <View style={styles.iconBlock}>
                <Icon name="mail" size={40} color="#D4AF37" />
              </View>
              <Text style={styles.infoHeading}>Email</Text>
              <Text style={styles.infoValue}>dhakadmatrimonial@gmail.com</Text>
            </View>

            {/* Right Form */}
            <View style={styles.rightForm}>
              <View style={styles.row}>
                <TextInput
                  placeholder="Your Name"
                  placeholderTextColor="#6B7280"
                  style={[styles.input, styles.halfInput]}
                  value={form.name}
                  onChangeText={(text) => handleChange("name", text)}
                />
                <TextInput
                  placeholder="Your Email"
                  placeholderTextColor="#6B7280"
                  style={[styles.input, styles.halfInput]}
                  value={form.email}
                  onChangeText={(text) => handleChange("email", text)}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  placeholder="Mobile Number"
                  placeholderTextColor="#6B7280"
                  style={[styles.input, styles.halfInput]}
                  value={form.mobile}
                  onChangeText={(text) => handleChange("mobile", text)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  placeholder="Subject"
                  placeholderTextColor="#6B7280"
                  style={[styles.input, styles.halfInput]}
                  value={form.subject}
                  onChangeText={(text) => handleChange("subject", text)}
                />
              </View>

              <TextInput
                placeholder="Message"
                placeholderTextColor="#6B7280"
                style={[styles.input, styles.messageBox]}
                value={form.message}
                onChangeText={(text) => handleChange("message", text)}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSend}
                activeOpacity={0.85}
              >
                <Text style={styles.sendBtnText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
       <Footer />
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
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  content: {
    paddingBottom: 24,
  },

  topBanner: {
    height: 76,
    backgroundColor: "#6D2606",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
  },

  topBannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "400",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 26,
    marginBottom: 28,
  },

  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 16,
  },

  mainColumn: {
    flexDirection: "column",
  },

  leftCard: {
    width: isSmallDevice ? "100%" : "33%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  leftCardMobile: {
    marginBottom: 18,
  },

  iconBlock: {
    marginBottom: 10,
  },

  infoTextCenter: {
    fontSize: 15,
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 26,
  },

  sectionGap: {
    height: 24,
  },

  infoHeading: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 10,
  },

  infoValue: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 28,
    textAlign: "center",
  },

  rightForm: {
    width: isSmallDevice ? "100%" : "63%",
  },

  row: {
    flexDirection: isSmallDevice ? "column" : "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 14,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DDE3",
    borderRadius: 6,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    height: 48,
  },

  halfInput: {
    flex: 1,
  },

  messageBox: {
    height: 160,
    paddingTop: 14,
    marginBottom: 16,
  },

  sendBtn: {
    height: 56,
    backgroundColor: "#D4AF37",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop:-5
  },

  sendBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});