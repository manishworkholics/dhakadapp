import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";

const { width } = Dimensions.get("window");

export default function TermsAndConditionScreen() {
  const navigation = useNavigation();

  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API CALL
  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const res = await fetch(
        "http://143.110.244.163:5000/api/terms"
      );
      const json = await res.json();

      if (json.success) {
        setTermsData(json.data);
      }
    } catch (e) {
      console.log("Terms API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F2FA" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Terms & Conditions</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* TOP BANNER */}
          <View style={styles.topBanner}>
            <Text style={styles.topBannerText}>
              Dhakad Matrimony Policy
            </Text>
          </View>

          {/* CONTENT */}
          <View style={styles.introCard}>
            {loading ? (
              <Text>Loading terms...</Text>
            ) : (
              <>
                <Text style={styles.title}>
                  {termsData?.title}
                </Text>

                <RenderHTML
                  contentWidth={width}
                  source={{ html: termsData?.content }}
                />
              </>
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
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
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  topBanner: {
    height: 60,
    backgroundColor: "#6D2606",
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
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ECE6D8",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D4AF37",
    marginBottom: 10,
  },
});