import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PremiumScreen() {
  return (
    <View style={styles.container}>
      <Header title="Premium Membership" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* TOP BANNER */}
        <View style={styles.banner}>
          <Icon name="diamond" size={40} color="#fff" />
          <Text style={styles.bannerTitle}>Upgrade to Premium</Text>
          <Text style={styles.bannerSub}>
            Find your perfect life partner faster
          </Text>
        </View>

        {/* BENEFITS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>

          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={22} color="#e91e63" />
            <Text style={styles.benefitText}>Unlimited Chat with Matches</Text>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={22} color="#e91e63" />
            <Text style={styles.benefitText}>View Contact Details</Text>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={22} color="#e91e63" />
            <Text style={styles.benefitText}>Profile Boost for More Visibility</Text>
          </View>

          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={22} color="#e91e63" />
            <Text style={styles.benefitText}>Priority Customer Support</Text>
          </View>
        </View>

        {/* PLANS */}
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Gold Plan</Text>
          <Text style={styles.planPrice}>₹999 / 3 Months</Text>
          <TouchableOpacity style={styles.planBtn}>
            <Text style={styles.planBtnText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.planCard, styles.popular]}>
          <Text style={styles.popularTag}>Most Popular</Text>
          <Text style={styles.planTitle}>Platinum Plan</Text>
          <Text style={styles.planPrice}>₹1999 / 6 Months</Text>
          <TouchableOpacity style={styles.planBtn}>
            <Text style={styles.planBtnText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    paddingBottom: 20,
  },

  banner: {
    backgroundColor: "#e91e63",
    padding: 25,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  bannerSub: {
    fontSize: 14,
    color: "#ffe4ec",
    marginTop: 5,
  },

  section: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },

  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  benefitText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#555",
  },

  planCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
  },

  popular: {
    borderWidth: 2,
    borderColor: "#e91e63",
  },

  popularTag: {
    backgroundColor: "#e91e63",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    marginBottom: 8,
  },

  planTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  planPrice: {
    fontSize: 16,
    color: "#e91e63",
    marginVertical: 10,
  },

  planBtn: {
    backgroundColor: "#e91e63",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  planBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
