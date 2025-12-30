// src/screens/MatchesScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const matches = [
  {
    id: "1",
    name: "Ankita Kaur",
    age: 26,
    height: "5'4\"",
    city: "Indore",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    verified: true,
  },
  {
    id: "2",
    name: "Riya Sharma",
    age: 24,
    height: "5'5\"",
    city: "Bhopal",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    verified: true,
  },
  {
    id: "3",
    name: "Neha Patel",
    age: 27,
    height: "5'6\"",
    city: "Ahmedabad",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
  },
];

export default function MatchesScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Image */}
      <Image source={{ uri: item.image }} style={styles.image} />

      {/* Verified Badge */}
      {item.verified && (
        <View style={styles.verified}>
          <Text style={styles.verifiedText}>✔</Text>
        </View>
      )}

      {/* Info Overlay */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.age} yrs • {item.height} • {item.city}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.connectBtn}>
            <Text style={styles.connectText}>Connect</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
    paddingBottom: 90,
    backgroundColor: "#f5f5f5",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 320,
  },

  verified: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#28a745",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  verifiedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  info: {
    padding: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  details: {
    color: "#666",
    marginVertical: 4,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  connectBtn: {
    backgroundColor: "#ff4e50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  connectText: {
    color: "#fff",
    fontWeight: "600",
  },

  chatBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },

  chatText: {
    color: "#ff4e50",
    fontWeight: "600",
  },
});
