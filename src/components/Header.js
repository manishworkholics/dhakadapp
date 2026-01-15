// src/components/Header.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useProfile } from "../context/ProfileContext";
import { useDrawer } from "../context/DrawerContext";

const Header = () => {
  const { profile } = useProfile();
  const { openDrawer } = useDrawer();

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <View style={styles.container}>
      {/* MENU ICON */}
      <TouchableOpacity onPress={openDrawer}>
        <Icon name="menu-outline" size={26} color="red" />
      </TouchableOpacity>

      {/* TITLE / SEARCH INPUT */}
      <View style={styles.center}>
        {isSearching ? (
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search here..."
            autoFocus
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.title}>
            {profile?.name || ""}
          </Text>
        )}
      </View>

      {/* RIGHT ICONS */}
      {isSearching ? (
        <TouchableOpacity
          onPress={() => {
            setIsSearching(false);
            setSearchText("");
          }}
        >
          <Icon name="close" size={24} color="red" />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => setIsSearching(true)}>
            <Icon name="search" size={24} color="red" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openDrawer}>
            <Icon
              name="notifications-outline"
              size={24}
              color="red"
              style={{ marginLeft: 14 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 4,
     marginTop: 35,
  },

  center: {
    flex: 1,
    marginHorizontal: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  searchInput: {
    height: 40,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Header;
