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
      <Header title="Shivam Thakur" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔶 Profile + Upgrade Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileId}>DH1409005</Text>
              <Text style={styles.accountType}>Account : Free</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeText}>Upgrade Now</Text>
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
