// src/components/Header.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Header = ({ title, onMenuPress, onNotificationPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu-outline" size={26} color="#000" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={onNotificationPress}>
        <Icon name="notifications-outline" size={24} color="#000" />
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
  },
  
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  alignItems: 'center',
    position: 'relative',notification: {
    width: 36,
    height: 36,
    borderRadius: 18,
    
    justifyContent: 'center',
    
  },
  bell: {
    fontSize: 25,
    color: '#fff',
  },
  menu:{
    fontSize: 25, color: 'black',
  }
  
});

export default Header;
