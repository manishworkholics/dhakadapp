import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import Clipboard from "@react-native-clipboard/clipboard";
import { useDrawer } from "../context/DrawerContext";
import { useProfile } from "../context/ProfileContext";

export default function SideDrawer({ navigation }) {
  const { open, closeDrawer } = useDrawer();
  const { profile } = useProfile();

  const go = (screen) => {
    closeDrawer();
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // clears everything
      closeDrawer();
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (err) {
      console.log("Logout error", err);
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      {/* Overlay */}
      <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />

      {/* Drawer */}
      <View style={styles.drawer}>
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={closeDrawer}>
          <Icon name="close" size={22} color="#BFBFBF" />
        </TouchableOpacity>

        {/* Profile */}
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

          <View>
            <Text style={styles.username}>{profile?.name || "User"}</Text>

            {/* USER ID + COPY */}
            <View style={styles.useridbox}>
              <Text style={styles.userid}>
                DH{profile?._id?.slice(0, 5) || "XXXXX"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(profile?._id || "");
                  alert("User ID copied");
                }}
                style={{ marginLeft: 6 }}
              >
                <Feather name="copy" size={14} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <DrawerItem icon="home" title="Home" onPress={() => go("Home")} />
        <Divider />

        {/* Profile Options */}
        <DrawerItem
          icon="person-outline"
          title="View and Edit your Profile"
          onPress={() => go("Profile")}
        />
        <Divider />
        <DrawerItem icon="download-outline" title="Download and Share Profile" />
        <Divider />
        <DrawerItem
          icon="diamond-outline"
          title="Upgrade to Premium"
          onPress={() => go("Premium")}
        />

        {/* Matches */}
        <Text style={styles.section}>Discover Your Matches</Text>
        <Divider />
        <DrawerItem icon="people-outline" title="Matches" onPress={() => go("Matches")} />
        <Divider />
        <DrawerItem icon="mail-outline" title="Inbox" onPress={() => go("Interest")} />
        <Divider />
        <DrawerItem icon="chatbubbles-outline" title="Chat" onPress={() => go("Chat")} />

        {/* Settings */}
        <Text style={styles.section}>Options & Settings</Text>
        <Divider />
        <DrawerItem
          icon="person-add-outline"
          title="Partner Preferences"
          onPress={() => go("PartnerPreference")}
        />
        <Divider />
        <DrawerItem icon="filter-outline" title="Contact Filters" />
        <Divider />
        <DrawerItem icon="settings-outline" title="Account Settings" />
        <Divider />
        <DrawerItem icon="help-circle-outline" title="Help & Support" />
        <Divider />
        <DrawerItem icon="shield-checkmark-outline" title="Be Safe Online" />
        <Divider />

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Icon name="log-out-outline" size={18} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

/* Drawer Item */
const DrawerItem = ({ icon, title, onPress, highlight }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={18} color={highlight ? "#f7941d" : "#444"} />
    <Text style={[styles.itemText, highlight && { color: "#f7941d", fontWeight: "600" }]}>
      {title}
    </Text>
    <Icon name="chevron-forward" size={16} color="#bbb" />
  </TouchableOpacity>
);

/* Divider */
const Divider = () => <View style={styles.divider} />;

/* Styles */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  drawer: {
    width: 307,
    height: "100%",
    backgroundColor: "#fff",
    padding: 18,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "#BFBFBF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
  },
  useridbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  userid: {
    fontSize: 12,
    color: "#888",
  },
  section: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    marginLeft: 10,
    color: "red",
    fontWeight: "600",
  },
});
