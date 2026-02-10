import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "../context/ProfileContext";
import { useDrawer } from "../context/DrawerContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const Header = () => {
  const { profile } = useProfile();
  const { openDrawer } = useDrawer();
  const navigation = useNavigation();
  const route = useRoute();

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= TITLE LOGIC ================= */
  const displayName =
    profile?.fullName ||
    profile?.name ||
    profile?.username ||
    "";

  // 👇 Home par profile name, baaki pages par route name
  const headerTitle =
    route.name === "Home" ? displayName : route.name;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* LEFT ICON */}
        <TouchableOpacity onPress={openDrawer}>
          <Icon name="menu-outline" size={26} color="red" />
        </TouchableOpacity>

        {/* CENTER */}
        <View style={styles.center}>
          {isSearching ? (
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search Here..."
              autoFocus
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.title} numberOfLines={1}>
              {headerTitle}
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
            {/* <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Icon name="search" size={24} color="red" />
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
            >
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
    </SafeAreaView>
  );
};

export default Header;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    height: 45,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    alignItems: "flex-start",

  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    color: "#000",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
