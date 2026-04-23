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
          <Icon name="menu-outline" size={28} color="#DC143C" />

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
                size={25}
                color="#DC143C"
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
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#000000",
    borderBottomWidth: 0.2,
  },
  center: {
    flex: 1,
    marginHorizontal: 12,
    minWidth: 0,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#000000",
    marginLeft: 8,
    flexShrink: 1,
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
