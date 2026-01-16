
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

const Header = () => {
  const { profile } = useProfile();
  const { openDrawer } = useDrawer();

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
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
    </SafeAreaView>
  );
};


//old css 
// const styles = StyleSheet.create({
//   container: {
//     height: 56,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     backgroundColor: "#fff",
//     elevation: 4,

//   },

//   center: {
//     flex: 1,
//     marginHorizontal: 14,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//   },

//   searchInput: {
//     height: 40,
//     backgroundColor: "#f1f1f1",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 15,
//   },

//   rightIcons: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });


// my new css 

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


export default Header;
