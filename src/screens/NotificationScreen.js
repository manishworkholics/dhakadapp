import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://143.110.244.163:5000/api";

/* 🔹 TIME AGO FUNCTION */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1)
      return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* 🔹 FETCH NOTIFICATIONS */
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log("NOTIFICATION ERROR 👉", err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchNotifications();
    }, [])
  );

  
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  /* 🔹 RENDER ITEM */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        !item.read && styles.unreadCard,
      ]}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ProfileDetail", {
          id: item.senderProfileId,
        })
      }
    >
      <Image
        source={{
          uri:
            item.senderPhoto ||
            "https://via.placeholder.com/70",
        }}
        style={styles.avatar}
      />

      <View style={styles.textWrap}>
        <Text style={styles.title}>
          {item.sender?.name || "Someone"}
        </Text>

        <Text style={styles.message}>
          {item.message || "Viewed your profile"}
        </Text>

        <Text style={styles.time}>
          {timeAgo(item.createdAt)}
        </Text>
      </View>

      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 70 }}>
      <Header
        title="Notifications"
        onMenuPress={() => navigation.openDrawer()}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff4e50"
          style={{ marginTop: 40 }}
        />
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            You don’t have any notifications yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff4e50"]}
              tintColor="#ff4e50"
            />
          }
        />
      )}

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },

  unreadCard: {
    borderLeftWidth: 0.5,
    borderLeftColor: "#ff4e50",
    borderRightWidth: 0.5,
    borderRightColor: "#ff4e50",
    borderColor:"#ff4e50",
    borderWidth:0.5,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  textWrap: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    
    
  },

  message: {
    color: "black",
    marginTop: 4,
    fontSize: 13,
  },

  time: {
    color: "black",
    fontSize: 11,
    marginTop: 6,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ff4e50",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyText: {
    color: "#888",
    textAlign: "center",
  },
});
