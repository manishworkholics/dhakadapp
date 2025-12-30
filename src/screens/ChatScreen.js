import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <Header title="Chats" />

      {/* Body */}
      <View style={styles.center}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>No Conversations Yet</Text>
        <Text style={styles.subTitle}>
          Start chatting with your matches and build connections.
        </Text>
      </View>

      {/* Footer */}
      <Footer />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
