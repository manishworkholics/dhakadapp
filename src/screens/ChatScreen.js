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
const BASE_URL = "http://143.110.244.163:5000"; 

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

  // ✅ Web jaisa logic: photo field handle + relative url fix
  const getImageUri = (photo) => {
    if (!photo) return DEFAULT_AVATAR;
    if (typeof photo !== "string") return DEFAULT_AVATAR;

    if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
    if (photo.startsWith("/")) return `${BASE_URL}${photo}`;
    return `${BASE_URL}/${photo}`;
  };

  const renderChatItem = ({ item }) => {
    const otherUser = item.participants?.find(
      (p) => p._id !== currentUser?._id
    );

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
          source={{ uri: getImageUri(otherUser?.photo) }} // ✅ FIX (web jaisa)
          style={styles.chatAvatar}
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
    const sender = item.participants?.find(
      (p) => p._id !== currentUser?._id
    );

    return (
      <View style={styles.requestCard}>
        <View style={styles.leftSection}>
          {/* ✅ Request me bhi web jaisa photo */}
          <Image
            source={{ uri: getImageUri(sender?.photo) }}
            style={styles.reqPhoto}
          />

          <View>
            <Text style={styles.reqName}>{sender?.name}</Text>
            <Text style={styles.reqSub}>Chat Request</Text>
          </View>
        </View>

        <View style={styles.reqBtns}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => respondToRequest(item._id, "accept")}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => respondToRequest(item._id, "reject")}
          >
            <Text style={styles.rejectText}>Reject</Text>
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
        data={[...(requests.length ? [{ type: "requests" }] : []), ...chats]}
        keyExtractor={(item, index) => item._id || `req-${index}`}
        renderItem={({ item }) => {
          if (item.type === "requests") {
            return (
              <View>
                <Text style={styles.sectionTitle}>Chat Requests</Text>
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
            colors={["#ff4e50"]}
            tintColor="#ff4e50"
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

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 6,
  },

  chatCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 19,
    borderRadius: 13,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // ✅ chat list image style
  chatAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  name: { fontSize: 15, fontWeight: "700", color: "#222" },
  lastMessage: { fontSize: 13, color: "#777", marginTop: 2 },
  pendingText: { fontSize: 11, color: "#ff9800", marginTop: 2 },

  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  // ✅ request photo (web jaisa)
  reqPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  reqName: { fontSize: 15, fontWeight: "600", color: "#000" },
  reqSub: { fontSize: 12, color: "#777", marginTop: 2 },

  reqBtns: { flexDirection: "row", justifyContent: "flex-end" },

  acceptBtn: {
    backgroundColor: "#22C55E",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
  },

  rejectBtn: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  acceptText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  rejectText: { color: "#DC2626", fontSize: 13, fontWeight: "600" },
});
