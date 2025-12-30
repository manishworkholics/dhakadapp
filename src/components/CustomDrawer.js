import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CustomDrawer({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.profileSection}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Shivam Thakur</Text>
        <Text style={styles.id}>SH07635039</Text>
      </View>

      {/* Menu */}
      <DrawerItem icon="person-outline" label="View & Edit Profile" />
      <DrawerItem icon="download-outline" label="Download Profile" />
      <DrawerItem icon="star-outline" label="Upgrade to Premium" />

      <Text style={styles.section}>Discover Your Matches</Text>
      <DrawerItem
        icon="people-outline"
        label="Matches"
        onPress={() => navigation.navigate("Matches")}
      />
      <DrawerItem icon="mail-outline" label="Inbox" />
      <DrawerItem icon="chatbubble-outline" label="Chat" />

      <Text style={styles.section}>Options & Settings</Text>
      <DrawerItem icon="settings-outline" label="Account Settings" />
      <DrawerItem icon="help-circle-outline" label="Help & Support" />
      <DrawerItem icon="log-out-outline" label="Logout" />
    </View>
  );
}

const DrawerItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={20} color="#444" />
    <Text style={styles.itemText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  profileSection: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f2f2f2",
    marginBottom: 8,
  },
  name: { fontSize: 16, fontWeight: "700" },
  id: { color: "#888", marginTop: 2 },

  section: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "700",
    color: "#777",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemText: { marginLeft: 14, fontSize: 15 },
});
