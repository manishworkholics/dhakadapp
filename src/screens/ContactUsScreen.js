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
import AppModal from "../components/AppModal";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 768;

export default function ContactUsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };


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

  const handleSend = async () => {
    if (!form.name || !form.email || !form.mobile || !form.subject || !form.message) {

      showModal("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://143.110.244.163:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.mobile,
          subject: form.subject,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Dynamic success message

        showModal(`✅ ${data.message}`, "success");

        setForm({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
      } else {
        // ❌ Dynamic error message (if API sends)

        showModal(`❌ ${data.message || "Something went wrong"}`, "error");
      }
    } catch (error) {
      console.log("API Error:", error);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F2FA" />

      <View style={styles.container}>
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
          <View style={styles.topBanner}>
            <Text style={styles.topBannerText}>Lakhs of Happy Marriages</Text>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.pageTitle}>Contact For Any Query</Text>
            <View style={styles.titleLine} />
            <Text style={styles.pageSubtitle}>
              We’re here to help you with every step of your matchmaking journey.
            </Text>
          </View>

          <View style={[styles.mainRow, isSmallDevice && styles.mainColumn]}>
            <View
              style={[styles.leftCard, isSmallDevice && styles.leftCardMobile]}
            >
              <View style={styles.infoItem}>
                <View style={styles.iconCircle}>
                  <Icon name="location-sharp" size={24} color="#D4AF37" />
                </View>
                <Text style={styles.infoHeading}>Address</Text>
                <Text style={styles.infoTextCenter}>
                  315, Princes Business Skypark,{"\n"}
                  AB Road, Vijay Nagar Indore
                </Text>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.iconCircle}>
                  <Icon name="call-sharp" size={22} color="#D4AF37" />
                </View>
                <Text style={styles.infoHeading}>Mobile</Text>
                <Text style={styles.infoValue}>+91 8982079600</Text>
                <Text style={styles.infoValue}>+91 8770896005-6-7</Text>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.iconCircle}>
                  <Icon name="mail-unread-sharp" size={22} color="#D4AF37" />
                </View>
                <Text style={styles.infoHeading}>Email</Text>
                <Text style={styles.infoValue}>dhakadmatrimonial@gmail.com</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Send Us a Message</Text>
              <Text style={styles.formSubtitle}>
                Fill out the form below and our team will connect with you soon.
              </Text>

              <View style={styles.row}>
                <View style={styles.inputWrap}>
                  <Icon
                    name="person-outline"
                    size={18}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Your Name"
                    placeholderTextColor="#2F4F4F"
                    style={styles.input}
                    value={form.name}
                    onChangeText={(text) => handleChange("name", text)}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Icon
                    name="mail-outline"
                    size={18}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Your Email"
                    placeholderTextColor="#2F4F4F"
                    style={styles.input}
                    value={form.email}
                    onChangeText={(text) => handleChange("email", text)}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputWrap}>
                  <Icon
                    name="call-outline"
                    size={18}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Mobile Number"
                    placeholderTextColor="#2F4F4F"
                    style={styles.input}
                    value={form.mobile}
                    onChangeText={(text) => handleChange("mobile", text)}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Icon
                    name="document-text-outline"
                    size={18}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Subject"
                    placeholderTextColor="#2F4F4F"
                    style={styles.input}
                    value={form.subject}
                    onChangeText={(text) => handleChange("subject", text)}
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, styles.messageWrap]}>
                <Icon
                  name="chatbox-ellipses-outline"
                  size={18}
                  color="#9CA3AF"
                  style={[styles.inputIcon, { marginTop: 14 }]}
                />
                <TextInput
                  placeholder="Message"
                  placeholderTextColor="#2F4F4F"
                  style={[styles.input, styles.messageBox]}
                  value={form.message}
                  onChangeText={(text) => handleChange("message", text)}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSend}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.sendBtnText}>
                  {loading ? "Sending..." : "Send Message"}
                </Text>
                {!loading && <Icon name="arrow-forward" size={18} color="#fff" />}
              </TouchableOpacity>

            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* <Footer /> */}

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E2EC",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  content: {
    paddingBottom: 24,
  },

  topBanner: {
    height: 60,
    backgroundColor: "#6D2606",
    justifyContent: "center",
    alignItems: "center",
  },

  topBannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  titleWrap: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 26,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#8B0000",
    textAlign: "center",
  },

  titleLine: {
    width: 90,
    height: 3,
    borderRadius: 10,
    backgroundColor: "#D4AF37",
    marginTop: 8,
    marginBottom: 12,
  },

  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
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
    width: isSmallDevice ? "100%" : "34%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#ECE6F2",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },

  leftCardMobile: {
    marginBottom: 18,
  },

  infoItem: {
    alignItems: "center",
  },

  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  infoTextCenter: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#EEE8F3",
    marginVertical: 20,
  },

  infoHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8B0000",
    marginBottom: 8,
  },

  infoValue: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 26,
    textAlign: "center",
  },

  formCard: {
    width: isSmallDevice ? "100%" : "63%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ECE6F2",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 1,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#8B0000",
    marginBottom: 6,
  },

  formSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 18,
  },

  row: {
    flexDirection: isSmallDevice ? "column" : "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },

  inputWrap: {
    flex: 1,
    minHeight: 56,
    borderRadius: 10,
    backgroundColor: "#FAFAFC",
    borderWidth: 1,
    borderColor: "#E3E6EC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    height: 56,
    fontWeight: 600
  },

  messageWrap: {
    alignItems: "flex-start",
    minHeight: 150,
    marginBottom: 18,
  },

  messageBox: {
    height: 140,
    paddingTop: 14,
  },

  sendBtn: {
    height: 54,
    backgroundColor: "#D4AF37",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 1,
  },

  sendBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});