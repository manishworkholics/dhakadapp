import React from "react";
import { View } from "react-native";
import SideDrawer from "./SideDrawer";

export default function DrawerLayout({ navigation, children }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      {/* ⭐ drawer always mounted */}
      <SideDrawer navigation={navigation} />
    </View>
  );
}
