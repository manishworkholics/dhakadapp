import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { useDrawer } from '../context/DrawerContext';
import { useProfile } from '../context/ProfileContext';

const { width: SCREEN_W } = Dimensions.get('window');
const DRAWER_W = Math.min(307, Math.floor(SCREEN_W * 0.82));

export default function SideDrawer({ navigation }) {
  const { open, closeDrawer } = useDrawer();
  const { profile, resetProfileState } = useProfile();

  const translateX = useRef(new Animated.Value(-DRAWER_W)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -DRAWER_W,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [open, translateX]);

  const go = screen => {
    closeDrawer();
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?._id : null;

      const keysToRemove = ['token', 'user'];
      if (userId) {
        keysToRemove.push(`ownProfile_${userId}`);
        keysToRemove.push(`userPlan_${userId}`);
      }

      await AsyncStorage.multiRemove(keysToRemove);
      delete axios.defaults.headers.common['Authorization'];

      resetProfileState();
      closeDrawer();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        }),
      );
    } catch (err) {
      console.log('Logout error', err);
    }
  };

  const closeWithAnim = () => {
    Animated.timing(translateX, {
      toValue: -DRAWER_W,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      closeDrawer();
    });
  };

  const handleProfileAction = () => {
    closeDrawer();
    navigation.navigate('Profile');
  };

  const profileScore = profile?.profileScore || 0;
  const isProfileComplete = profileScore === 100;

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={closeWithAnim}
    >
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeWithAnim}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_W,
              transform: [{ translateX }],
            },
          ]}
        >
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.drawerContent}
            >
              <TouchableOpacity style={styles.closeBtn} onPress={closeWithAnim}>
                <Icon name="close" size={22} color="#BFBFBF" />
              </TouchableOpacity>

              <View style={styles.profileBox}>
                <View style={styles.avatar}>
                  {profile?.images?.length > 0 ? (
                    <Image
                      source={{ uri: profile.images[0] }}
                      style={styles.avatarImg}
                    />
                  ) : profile?.photos?.length > 0 ? (
                    <Image
                      source={{ uri: profile.photos[0] }}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <Icon name="person" size={30} color="#FFA821" />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.username}>{profile?.name || 'User'}</Text>

                  <View style={styles.useridbox}>
                    <Text style={styles.userid}>
                      DH
                      {profile?.oldVirtualId?.slice(0, 5) ||
                        profile?._id?.slice(0, 5)}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(profile?._id || '');
                        alert('User ID copied');
                      }}
                      style={{ marginLeft: 6 }}
                    >
                      <Feather name="copy" size={14} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* ✅ COMPLETE PROFILE CARD */}
              <View style={styles.completeBox}>
                <Text style={styles.completeTitle}>
                  {isProfileComplete
                    ? 'Your Profile is Completed'
                    : 'Complete Your Profile'}
                </Text>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${profileScore}%` },
                    ]}
                  />
                  <Text style={styles.progressText}>{profileScore}%</Text>
                </View>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleProfileAction}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionText}>
                    {isProfileComplete ? 'Update Profile' : 'Complete Profile'}
                  </Text>
                </TouchableOpacity>
              </View>

              <DrawerItem icon="home" title="Home" onPress={() => go('Home')} />
              <Divider />

              <DrawerItem
                icon="person-outline"
                title="View and Edit your Profile"
                onPress={() => go('Profile')}
              />
              <Divider />

              <DrawerItem
                icon="diamond-outline"
                title="Upgrade to Premium"
                onPress={() => go('Premium')}
              />

              <Text style={styles.section}>Discover Your Matches</Text>
              <Divider />
              <DrawerItem
                icon="people-outline"
                title="Matches"
                onPress={() => go('Matches')}
              />
              <Divider />
              <DrawerItem
                icon="mail-outline"
                title="Interest"
                onPress={() => go('Interest')}
              />
              <Divider />
              <DrawerItem
                icon="chatbubbles-outline"
                title="Chat"
                onPress={() => go('Chat')}
              />

              <Text style={styles.section}>Options & Settings</Text>
              <Divider />
              <DrawerItem
                icon="person-add-outline"
                title="Partner Preferences"
                onPress={() => go('PartnerPreference')}
              />
              <Divider />
              <DrawerItem
                icon="people-sharp"
                title="FindPartner"
                onPress={() => go('FindPartner')}
              />
              <Divider />
              <DrawerItem
                icon="fitness-outline"
                title="Shorlisted"
                onPress={() => go('Shortlist')}
              />
              <Divider />
              <DrawerItem
                icon="notifications-outline"
                title="Notification"
                onPress={() => go('Notification')}
              />
              <Divider />
              <DrawerItem
                icon="pause-circle-outline"
                title="Account Deactivation"
                onPress={() => go('AccountDeactivation')}
              />
              <Divider />
              <DrawerItem
                icon="star-outline"
                title="RateReview"
                onPress={() => go('RateReview')}
              />
              <Divider />
              <DrawerItem
                icon="logo-buffer"
                title="Blog"
                onPress={() => go('Blog')}
              />
              <Divider />
              <DrawerItem
                icon="document-text-outline"
                title="Terms & Conditions"
                onPress={() => go('TermsAndCondition')}
              />
              <Divider />
              <DrawerItem
                icon="information-circle-outline"
                title="About Us"
                onPress={() => go('AboutUs')}
              />
              <Divider />
              <DrawerItem
                icon="call-outline"
                title="Contact Us"
                onPress={() => go('ContactUs')}
              />
              <Divider />

              <DrawerItem
                icon="images-sharp"
                title="Gallery"
                onPress={() => go('Gallery')}
              />
              <Divider />
              <DrawerItem
                icon="heart-circle-sharp"
                title="AddSuccessStory"
                onPress={() => go('AddSuccessStory')}
              />

              <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Entypo name="log-out" size={17} color="red" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const DrawerItem = ({ icon, title, onPress, highlight }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
    <Icon name={icon} size={18} color={highlight ? '#f7941d' : '#444'} />
    <Text
      style={[
        styles.itemText,
        highlight && { color: '#f7941d', fontWeight: '600' },
      ]}
      numberOfLines={1}
    >
      {title}
    </Text>
    <Icon name="chevron-forward" size={16} color="#bbb" />
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  drawer: {
    height: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },

  drawerContent: {
    padding: 18,
    paddingBottom: 40,
  },

  closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#BFBFBF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  useridbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  userid: {
    fontSize: 12,
    color: '#888',
  },

  /* ✅ COMPLETE PROFILE CARD */
  completeBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  completeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  progressCircle: {
    width: 250,
    height: 44,
    borderRadius: 20,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    backgroundColor: '#FFF8DC',

  },

  progressText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },

  actionBtn: {
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#696969',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },

  section: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#777',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  logoutText: {
    marginLeft: 10,
    color: 'red',
    fontWeight: '800',
    fontSize: 15,
  },

  progressBarContainer: {
  width: "100%",
  height: 28,
  backgroundColor: "#F3E9D2", // light gold bg
  borderRadius: 20,
  overflow: "hidden",
  justifyContent: "center",
  marginVertical: 14,
},

progressFill: {
  height: "100%",
  backgroundColor: "#DAA520", // gold fill
  borderRadius: 20,
  position: "absolute",
  left: 0,
  top: 0,
},

progressText: {
  textAlign: "center",
  fontWeight: "800",
  color: "white",
  fontSize: 14,
},
});
