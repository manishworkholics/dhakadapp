// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Feather icons from react-native-vector-icons

const Header = ({ title, onMenuPress, onNotificationPress, profilePic }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={onNotificationPress}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profile} />
        ) : (
          <Icon name="bell" size={24} color="#000" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Header;
