
// src/components/Header.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useProfile } from "../context/ProfileContext";
import { useDrawer } from "../context/DrawerContext";

const Header = ({ title, onMenuPress, onNotificationPress }) => {
  const { profile } = useProfile();
  const { openDrawer } = useDrawer();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        console.log("MENU CLICKED");
        openDrawer();
      }}>
        <Icon name="menu-outline" size={26} color="red" />
      </TouchableOpacity>

      {/* Title */}
      <View>
        <Text style={styles.title}>
          {profile?.name || ''}
        </Text>
      </View>

      <TouchableOpacity onPress={openDrawer}>
        <Icon name="search" size={24} color="red" style={styles.searchIcon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={openDrawer}>
        <Icon name="notifications-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 1
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  alignItems: 'center',
  position: 'relative', notification: {
    width: 36,
    height: 36,
    borderRadius: 18,

    justifyContent: 'center',

  },
  bell: {
    fontSize: 25,
    color: '#fff',
  },
  menu: {
    fontSize: 25, color: 'black',
  },
  searchIcon: {
    marginLeft: 120
  }

});

export default Header;



