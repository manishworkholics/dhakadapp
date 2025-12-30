// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Feather icons

const Header = ({ title, onMenuPress, onNotificationPress, profilePic }) => {
  return (
    <View style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
     <Text style={styles.menu}>☰</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Notification / Profile */}
      <TouchableOpacity style={styles.rightButton} onPress={onNotificationPress}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profile} />
        ) : (
          <View style={styles.notification}>
           <Text style={styles.bell}>🔔</Text>
       {/* small red dot for notification */}
          </View>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 40,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  rightButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
