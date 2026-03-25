import React, { useMemo, useState } from 'react';
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

  const teamMembers = useMemo(
    () => [
      {
        id: 1,
        name: 'Rahul',
        role: 'Marketing Manager',
        image: require('../assets/images/team1.jpg'),
      },
      {
        id: 2,
        name: 'Rohit',
        role: 'HR Manager',
        image: require('../assets/images/team2.jpg'),
      },
      {
        id: 3,
        name: 'Shubham',
        role: 'Marketing Manager',
        image: require('../assets/images/team1.jpg'),
      },
      {
        id: 4,
        name: 'Karan',
        role: 'Marketing Manager',
        image: require('../assets/images/team2.jpg'),
      },
    ],
    [],
  );

  const faqData = useMemo(
    () => [
      {
        question: 'Who can register?',
        answer:
          'Any adult individual from the Dhakad community, or families looking for a suitable life partner for their loved ones, can register on Dhakad Matrimony.',
      },
      {
        question: 'Is it safe and secure?',
        answer:
          'Yes, our platform focuses on profile authenticity, privacy, and secure user experience. We aim to provide a trusted and respectful matchmaking environment.',
      },
      {
        question: 'How is it different?',
        answer:
          'Dhakad Matrimony is specially focused on the Dhakad community, combining cultural values, genuine profiles, and modern technology for meaningful matches.',
      },
      {
        question: 'Is registration free?',
        answer:
          'Yes, registration can be free depending on the services offered. Additional premium features can be introduced as per app requirements.',
      },
      {
        question: 'How can I find matches?',
        answer:
          'After registration, you can browse profiles, apply filters, and connect with suitable matches based on preferences, compatibility, and family values.',
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
                  source={require('../assets/images/couple 1.png')}
                  style={[styles.circleImage, styles.leftCircle]}
                  resizeMode="cover"
                />

                <Image
                  source={require('../assets/images/about1.png')}
                  style={[styles.circleImage, styles.rightCircle]}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Content */}
            <View style={styles.textSection}>
              <Text style={styles.welcomeText}>Welcome To</Text>
              <Text style={styles.brandText}>Dhakad Matrimony</Text>

              <Text style={styles.description}>
                A trusted platform dedicated to bringing together individuals
                and families from the Dhakad community. Our mission is to help
                you find a life partner who shares your values, traditions, and
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

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Our Mission</Text>
                <Text style={styles.infoText}>
                  Our mission is to provide a safe, reliable, and
                  community-focused matrimony platform for the Dhakad community.
                  We are committed to helping individuals and families find
                  suitable life partners through genuine profiles, transparent
                  processes, and respectful matchmaking.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Our Vision</Text>
                <Text style={styles.infoText}>
                  Our vision is to become the most trusted and respected
                  matrimony platform for the Dhakad community by preserving
                  cultural values while embracing modern technology for genuine
                  and successful matches.
                </Text>
              </View>
            </View>
          </View>

          {/* Meet Our Team */}
          <View style={styles.sectionContainer}>
            {renderSectionTitle('Meet', 'Our Team')}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.teamScrollContent}
            >
              {teamMembers.map(member => (
                <View key={member.id} style={styles.teamCard}>
                  <Image
                    source={member.image}
                    style={styles.teamImage}
                    resizeMode="cover"
                  />

                  <View style={styles.teamInfoCard}>
                    <Text style={styles.teamName}>{member.name}</Text>
                    <Text style={styles.teamRole}>{member.role}</Text>
                  </View>
                </View>
              ))}
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
                      activeOpacity={0.8}
                      style={styles.faqHeader}
                      onPress={() => toggleFaq(index)}
                    >
                      <Text style={styles.faqQuestion}>{item.question}</Text>
                      <Icon
                        name={
                          isOpen ? 'chevron-up-outline' : 'chevron-down-outline'
                        }
                        size={22}
                        color="#2C2C2C"
                      />
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.faqBody}>
                        <Text style={styles.faqAnswer}>{item.answer}</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F3EEF7',
  },

  container: {
    flex: 1,
    backgroundColor: '#F3EEF7',
    marginBottom:30
  },

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#F3EEF7',
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },

  rightSpace: {
    width: 34,
  },

  content: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#F8F6F3',
    overflow: 'hidden',
  },

  topBanner: {
    height: 60,
    backgroundColor: '#6D2606',
    justifyContent: 'center',
    alignItems: 'center',
  },

  topBannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  imageSection: {
    backgroundColor: '#F8F6F3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },

  circleWrap: {
    width: width,
    height: CIRCLE_SIZE + 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  circleImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: '#9B2C2C',
    position: 'absolute',
    backgroundColor: '#ddd',
  },

  leftCircle: {
    left: width * 0.12,
    zIndex: 1,
  },

  rightCircle: {
    right: width * 0.12,
    zIndex: 2,
  },

  textSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  welcomeText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1B2A3A',
    marginBottom: 2,
    marginTop: -10,
  },

  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#D4AF37',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 28,
    marginBottom: 10,
  },

  infoCard: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8DFC9',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6D2606',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },

  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  sectionTitleWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },

  sectionTitleBlack: {
    color: '#16202A',
  },

  sectionTitleGold: {
    color: '#D4AF37',
  },

  titleUnderline: {
    marginTop: 6,
    width: 120,
    height: 3,
    borderRadius: 4,
    backgroundColor: '#D4AF37',
  },

  teamScrollContent: {
    paddingLeft: 2,
    paddingRight: 10,
    paddingBottom: 6,
  },

  teamCard: {
    width: TEAM_CARD_WIDTH,
    marginRight: 14,
    alignItems: 'center',
  },

  teamImage: {
    width: '100%',
    height: 210,
    borderRadius: 18,
    backgroundColor: '#D9D9D9',
  },

  teamInfoCard: {
    width: '86%',
    backgroundColor: '#FFFFFF',
    marginTop: -26,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },

  teamName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#E53935',
    marginBottom: 4,
  },

  teamRole: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },

  faqContainer: {
    marginTop: 4,
  },

  faqItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE5',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },

  faqHeader: {
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  faqQuestion: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    paddingRight: 12,
  },

  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF1F4',
  },

  faqAnswer: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginTop: 12,
  },
});
