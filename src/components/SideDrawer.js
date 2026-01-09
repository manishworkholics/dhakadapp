import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useDrawer } from "../context/DrawerContext";

export default function SideDrawer({ navigation }) {
  const { open, closeDrawer } = useDrawer();

  return (
    <Modal visible={open} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />

      <View style={styles.drawer}>
        <Text style={styles.title}>Menu</Text>

        <Item title="Home" onPress={() => go("Home")} />
        <Item title="Matches" onPress={() => go("Matches")} />
        <Item title="Profile" onPress={() => go("Profile")} />

        <TouchableOpacity onPress={closeDrawer}>
          <Text style={{ color: "red", marginTop: 20 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  function go(screen) {
    closeDrawer();
    navigation.navigate(screen);
  }
}

const Item = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ paddingVertical: 12 }}>
    <Text style={{ fontSize: 16 }}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  drawer: {
    width: 260,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
});
