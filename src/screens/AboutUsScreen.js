import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.42;
const TEAM_CARD_WIDTH = Math.min(width * 0.72, 240);

export default function AboutUsScreen() {
  const navigation = useNavigation();

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // ✅ TEAM STATE
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // ✅ API CALL
  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch('http://143.110.244.163:5000/api/team');
      const json = await res.json();

      if (json.success) {
        const sorted = json.members.sort((a, b) => a.order - b.order);
        setTeamMembers(sorted);
      }
    } catch (e) {
      console.log('API ERROR:', e);
    } finally {
      setLoadingTeam(false);
    }
  };

  // ✅ FAQ SAME
  const faqData = useMemo(
    () => [
      {
        question: 'Who can register?',
        answer:
          'Any adult individual from the Dhakad community can register.',
      },
      {
        question: 'Is it safe and secure?',
        answer:
          'Yes, our platform focuses on privacy and authenticity.',
      },
      {
        question: 'How is it different?',
        answer:
          'Focused on Dhakad community with genuine profiles.',
      },
      {
        question: 'Is registration free?',
        answer: 'Yes, basic registration is free.',
      },
      {
        question: 'How can I find matches?',
        answer:
          'Browse profiles and connect based on preferences.',
      },
    ],
    [],
  );

  const toggleFaq = index => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const renderSectionTitle = (blackText, goldText) => (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>
        <Text style={styles.sectionTitleBlack}>{blackText} </Text>
        <Text style={styles.sectionTitleGold}>{goldText}</Text>
      </Text>
      <View style={styles.titleUnderline} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3EEF7" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Icon name="arrow-back" size={24} color="#1E1E1E" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>About Us</Text>

          <View style={styles.rightSpace} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* TOP BANNER */}
            <View style={styles.topBanner}>
              <Text style={styles.topBannerText}>
                Lakhs of Happy Marriages
              </Text>
            </View>

            {/* IMAGE SECTION */}
            <View style={styles.imageSection}>
              <View style={styles.circleWrap}>
                <Image
                  source={require('../assets/images/couple 1.png')}
                  style={[styles.circleImage, styles.leftCircle]}
                />
                <Image
                  source={require('../assets/images/about1.png')}
                  style={[styles.circleImage, styles.rightCircle]}
                />
              </View>
            </View>

            {/* TEXT */}
            <View style={styles.textSection}>
              <Text style={styles.welcomeText}>Welcome To</Text>
              <Text style={styles.brandText}>Dhakad Matrimony</Text>

              <Text style={styles.description}>
                A trusted platform dedicated to bringing together individuals
                and families from the Dhakad community.
              </Text>

              <Text style={styles.description}>
                We understand that marriage is a union of families.
              </Text>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Our Mission</Text>
                <Text style={styles.infoText}>
                  Provide safe and reliable matrimony platform.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Our Vision</Text>
                <Text style={styles.infoText}>
                  Become most trusted matrimony platform.
                </Text>
              </View>
            </View>
          </View>

          {/* 🔥 TEAM SECTION */}
          <View style={styles.sectionContainer}>
            {renderSectionTitle('Meet', 'Our Team')}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.teamScrollContent}
            >
              {loadingTeam ? (
                <Text style={{ marginLeft: 10 }}>Loading...</Text>
              ) : (
                teamMembers.map(member => (
                  <View key={member._id} style={styles.teamCard}>
                    <Image
                      source={{
                        uri:
                          member.photo ||
                          'https://via.placeholder.com/300',
                      }}
                      style={styles.teamImage}
                    />

                    <View style={styles.teamInfoCard}>
                      <Text style={styles.teamName}>
                        {member.name}
                      </Text>
                      <Text style={styles.teamRole}>
                        {member.post}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* FAQ */}
          <View style={styles.sectionContainer}>
            {renderSectionTitle('Why Choose', 'Dhakad Matrimony?')}

            <View style={styles.faqContainer}>
              {faqData.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <View key={index} style={styles.faqItem}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => toggleFaq(index)}
                    >
                      <Text style={styles.faqQuestion}>
                        {item.question}
                      </Text>
                      <Icon
                        name={
                          isOpen
                            ? 'chevron-up-outline'
                            : 'chevron-down-outline'
                        }
                        size={22}
                      />
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.faqBody}>
                        <Text style={styles.faqAnswer}>
                          {item.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
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
  safeArea: { flex: 1, backgroundColor: '#F3EEF7' },
  container: { flex: 1, marginBottom: 30 },

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  backBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: { fontSize: 18, fontWeight: '700' },
  rightSpace: { width: 34 },

  card: { backgroundColor: '#F8F6F3' },

  topBanner: {
    height: 60,
    backgroundColor: '#6D2606',
    justifyContent: 'center',
    alignItems: 'center',
  },

  topBannerText: { color: '#fff', fontWeight: '700' },

  imageSection: { alignItems: 'center', padding: 30 },

  circleWrap: {
    width: width,
    height: CIRCLE_SIZE + 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: '#9B2C2C',
    position: 'absolute',
  },

  leftCircle: { left: width * 0.12 },
  rightCircle: { right: width * 0.12 },

  textSection: { padding: 16 },

  welcomeText: { fontSize: 25, fontWeight: '800' },
  brandText: { fontSize: 24, color: '#D4AF37' },

  description: { fontSize: 15, marginBottom: 10, lineHeight: 24 },

  infoCard: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8DFC9',
  },

  infoTitle: { fontWeight: '700', color: '#6D2606' },
  infoText: { color: '#444' },

  sectionContainer: { paddingHorizontal: 16, marginTop: 24 },

  sectionTitleWrap: { alignItems: 'center', marginBottom: 18 },

  sectionTitle: { fontSize: 26, fontWeight: '800' },

  sectionTitleBlack: { color: '#16202A' },
  sectionTitleGold: { color: '#D4AF37' },

  titleUnderline: {
    width: 120,
    height: 3,
    backgroundColor: '#D4AF37',
    marginTop: 6,
  },

  teamScrollContent: { paddingRight: 10 },

  teamCard: {
    width: TEAM_CARD_WIDTH,
    marginRight: 14,
    alignItems: 'center',
  },

  teamImage: {
    width: '100%',
    height: 210,
    borderRadius: 18,
  },

  teamInfoCard: {
    width: '86%',
    backgroundColor: '#fff',
    marginTop: -26, // 🔥 overlap effect
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },

  teamName: { fontWeight: '800', color: '#E53935' },
  teamRole: { color: '#374151' },

  faqContainer: {},

  faqItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9DEE5',
  },

  faqHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  faqQuestion: { fontWeight: '600' },

  faqBody: { padding: 16 },

  faqAnswer: { color: '#4B5563' },
});