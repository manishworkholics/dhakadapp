import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useProfile } from "../context/ProfileContext";

export default function CustomDrawer(props) {
  const { profile } = useProfile();

  return (
    <DrawerContentScrollView {...props}>
      <ScrollView style={styles.container}>
        {/* CLOSE */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => props.navigation.closeDrawer()}
        >
          <Icon name="close" size={22} />
        </TouchableOpacity>

        {/* PROFILE */}
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Icon name="person" size={30} color="#fff" />
          </View>

          <Text style={styles.name}>{profile?.name || "User"}</Text>

          <View style={styles.idRow}>
            <Text style={styles.idText}>SH07635039</Text>
            <Icon name="copy-outline" size={16} color="#777" />
          </View>
        </View>

        {/* MENU */}
        <DrawerItem icon="create-outline" label="View and Edit your Profile" />
        <DrawerItem icon="download-outline" label="Download and Share Profile" />
        <DrawerItem
          icon="star-outline"
          label="Upgrade to Premium"
          highlight
        />

        <Section title="Discover Your Matches" />
        <DrawerItem icon="people-outline" label="Matches" />
        <DrawerItem icon="mail-outline" label="Inbox" />
        <DrawerItem icon="chatbubble-outline" label="Chat" />

        <Section title="Options & Settings" />
        <DrawerItem icon="heart-outline" label="Partner Preferences" />
        <DrawerItem icon="filter-outline" label="Contact Filters" />
        <DrawerItem icon="settings-outline" label="Account Settings" />
        <DrawerItem icon="help-circle-outline" label="Help & Support" />
        <DrawerItem icon="shield-checkmark-outline" label="Be Safe Online" />

        <DrawerItem icon="log-out-outline" label="Logout" danger />
      </ScrollView>
    </DrawerContentScrollView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Section = ({ title }) => (
  <Text style={styles.section}>{title}</Text>
);

const DrawerItem = ({ icon, label, highlight, danger }) => (
  <TouchableOpacity style={styles.item}>
    <Icon
      name={icon}
      size={20}
      color={danger ? "#ff4e50" : highlight ? "#ff9800" : "#333"}
    />
    <Text
      style={[
        styles.itemText,
        highlight && { color: "#ff9800" },
        danger && { color: "#ff4e50" },
      ]}
    >
      {label}
    </Text>
    <Icon name="chevron-forward" size={18} color="#ccc" />
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  closeBtn: { alignSelf: "flex-start", marginBottom: 10 },

  profileBox: { alignItems: "center", marginBottom: 20 },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ff9800",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  name: { fontSize: 16, fontWeight: "700" },

  idRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  idText: { fontSize: 12, color: "#777", marginRight: 6 },

  section: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  itemText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 14,
    color: "#333",
  },
});
