// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
    <Header
        title="Shivam Thakur"
       
      />


      <ScrollView
        
      >


        {/* 🔶 Profile + Upgrade Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image
              source={require("../assets/images/adminlogo.png")}

            />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileId}>DH1409009</Text>
              <Text style={styles.editprofiletext}>Edit Profile</Text>
              <Text style={styles.accountType}>Account : Free</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeText}>👑 Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* 🔶 Complete Profile Section */}
        <Text style={styles.heading}>Complete Your Profile</Text>

        <View style={styles.completeCard}>
          <Text style={styles.completeText}>Create short bio</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        <View style={styles.completeCard}>
          <Text style={styles.completeText}>Add partner preferences</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        <View style={styles.completeCard}>
          <Text style={styles.completeText}>Find matching profiles</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        {/* 🔶 Premium Matches */}
        <View style={styles.sectionHeader}>
          <Text style={styles.heading}>Premium Matches (54)</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {premiumProfiles.map((item, index) => (
            <View key={index} style={styles.matchCard}>
              <Image source={{ uri: item.image }} style={styles.matchImg} />
              <Text style={styles.matchName}>{item.name}</Text>
              <TouchableOpacity style={styles.connectBtn}>
                <Text style={styles.connectText}>Connect Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* 🔶 New Matches */}
        <View style={styles.sectionHeader}>
          <Text style={styles.heading}>New Matches (54)</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {newProfiles.map((item, index) => (
            <View key={index} style={styles.matchCard}>
              <Image source={{ uri: item.image }} style={styles.matchImg} />
              <Text style={styles.matchName}>{item.name}</Text>
              <TouchableOpacity style={styles.chatBtn}>
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* 🔶 Success Stories */}
        <View style={styles.successWrap}>
          <Text style={styles.successTitle}>Success Story</Text>
          <Text style={styles.successSub}>
            Over 4 Crore success stories have been found
          </Text>

          <View style={styles.successCard}>
            <Image
              source={{
                uri: 'https://randomuser.me/api/portraits/men/44.jpg',
              }}
              style={styles.successImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.successName}>Verite & Devendra</Text>
              <TouchableOpacity>
                <Text style={styles.readMore}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Footer />
    </View>
  );
};

/* 🔹 Dummy Data */
const premiumProfiles = [
  {
    name: 'Aman Kaur',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
  },
  {
    name: 'Jaspreet',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

const newProfiles = [
  {
    name: 'Pooja',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
  {
    name: 'Ritika',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 14,
    padding: 14,
    elevation: 3,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
    marginRight: 12,
  },

  profileId: {
    fontSize: 16,
    fontWeight: "700",
  },

  accountType: {
    color: "#777",
    marginTop: 2,
  },

  upgradeBtn: {
    backgroundColor: "#f7a11b",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 8,
  },

  upgradeText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* Section Headings */
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 14,
    marginTop: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 18,
  },

  seeAll: {
    color: "#ff4e50",
    fontWeight: "600",
  },

  /* Complete Profile Cards */
  completeCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  completeText: {
    fontSize: 15,
    color: "#333",
  },

  arrow: {
    fontSize: 20,
    color: "#bbb",
  },

  /* Matches Cards */
  matchCard: {
    backgroundColor: "#fff",
    width: 160,
    borderRadius: 14,
    marginLeft: 14,
    marginVertical: 12,
    paddingBottom: 12,
    elevation: 3,
  },

  matchImg: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  matchName: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    marginHorizontal: 10,
  },

  connectBtn: {
    backgroundColor: "#ff4e50",
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
  },

  connectText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  chatBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
  },

  chatText: {
    color: "#ff4e50",
    fontWeight: "600",
    fontSize: 13,
  },

  /* Success Stories */
  successWrap: {
    backgroundColor: "#fff",
    margin: 14,
    borderRadius: 14,
    padding: 14,
    elevation: 3,
  },

  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  successSub: {
    color: "#666",
    marginBottom: 14,
  },

  successCard: {
    flexDirection: "row",
    alignItems: "center",
  },

  successImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },

  successName: {
    fontSize: 16,
    fontWeight: "700",
  },

  readMore: {
    color: "#ff4e50",
    marginTop: 4,
    fontWeight: "600",
  },
});



