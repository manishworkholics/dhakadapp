import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const API_URL = "http://143.110.244.163:5000/api";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function ChatScreen() {
  const navigation = useNavigation();

  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setCurrentUser(JSON.parse(u));
    });
  }, []);

  const fetchChats = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get(`${API_URL}/chat/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data.chats || []);
  };

  const fetchRequests = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get(`${API_URL}/chat/request`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data.requests || []);
  };

  const loadAll = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      else setRefreshing(true);

      await Promise.all([fetchChats(), fetchRequests()]);
    } catch (e) {
      alert("Failed to load chats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  const respondToRequest = async (chatRoomId, action) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_URL}/chat/respond`,
        { chatRoomId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadAll();
    } catch {
      alert("Failed to respond");
    }
  };

  const renderChatItem = ({ item }) => {
    const otherUser =
      item.participants?.find((p) => p._id !== currentUser?._id);

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          if (item.status !== "active") {
            alert("Chat request not accepted yet");
            return;
          }

          navigation.navigate("ChatDetail", { chatId: item._id });
        }}
      >
        <Image
          source={{ uri: otherUser?.photos?.[0] || DEFAULT_AVATAR }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{otherUser?.name}</Text>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.message || "No messages yet"}
          </Text>

          {item.status !== "active" && (
            <Text style={styles.pendingText}>Request Pending</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };


  const renderRequest = ({ item }) => {
    const sender =
      item.participants?.find((p) => p._id !== currentUser?._id);

    return (
      <View style={styles.requestCard}>
        <Text style={styles.reqName}>{sender?.name}</Text>
        <View style={styles.reqBtns}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => respondToRequest(item._id, "accept")}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => respondToRequest(item._id, "reject")}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Chats" />

      <FlatList
        data={[
          ...(requests.length
            ? [{ type: "requests" }]
            : []),
          ...chats,
        ]}
        keyExtractor={(item, index) =>
          item._id || `req-${index}`
        }
        renderItem={({ item }) => {
          if (item.type === "requests") {
            return (
              <View>
                <Text style={styles.sectionTitle}>
                  Chat Requests
                </Text>
                <FlatList
                  data={requests}
                  keyExtractor={(i) => i._id}
                  renderItem={renderRequest}
                />
              </View>
            );
          }
          return renderChatItem({ item });
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAll(true)}
          />
        }
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
      />

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    elevation: 4,
  },

  image: { width: 100, height: 100, marginBottom: 16 },

  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  subTitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#ff4e50",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },

  buttonText: { color: "#fff", fontWeight: "700" },

  chatCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  name: { fontSize: 15, fontWeight: "700", color: "#222" },

  lastMessage: { fontSize: 13, color: "#777", marginTop: 2 },

  pendingText: { fontSize: 11, color: "#ff9800", marginTop: 2 },

  time: { fontSize: 11, color: "#999", marginLeft: 6 },
});
