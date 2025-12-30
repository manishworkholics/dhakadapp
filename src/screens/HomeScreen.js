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

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Sujal Prajapati" />

      <ScrollView showsVerticalScrollIndicator={false}>
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

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  profileCard: {
    backgroundColor: 'black',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 10,
  },

  profileId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  editprofiletext: {
    color: 'rgba(255, 126, 0, 1)',
    fontSize: 14,
  },

  accountType: {
    color: 'white',
    marginTop: 2,
  },

  upgradeBtn: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 168, 33, 1)',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '175',
    marginLeft: '85',
    height: 40
  },

  upgradeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
  },

  completeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  completeText: {
    fontSize: 16,
  },

  arrow: {
    fontSize: 18,
    color: '#999',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },

  seeAll: {
    color: '#E91E63',
    fontWeight: 'bold',
  },

  matchCard: {
    backgroundColor: '#fff',
    width: 140,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  matchImg: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  matchName: {
    marginVertical: 6,
    fontWeight: 'bold',
  },

  connectBtn: {
    backgroundColor: '#E91E63',
    padding: 6,
    borderRadius: 5,
  },

  connectText: {
    color: '#fff',
    fontSize: 12,
  },

  chatBtn: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 5,
  },

  chatText: {
    color: '#fff',
    fontSize: 12,
  },

  successWrap: {
    margin: 15,
  },

  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  successSub: {
    color: 'gray',
    marginVertical: 5,
  },

  successCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  successImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  successName: {
    fontWeight: 'bold',
  },

  readMore: {
    color: '#E91E63',
    marginTop: 5,
  },
});

