import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Chats" />

      {/* Body */}
      <View style={styles.center}>
        <View style={styles.card}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
            }}
            style={styles.image}
          />

          <Text style={styles.title}>No Conversations Yet</Text>

          <Text style={styles.subTitle}>
            When you connect with matches, your conversations will appear here.
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Find Matches</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
    marginBottom: 20,
    opacity: 0.9,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
  },

  button: {
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
   searchIcon:{
    marginLeft:"120"
  }
  

});
