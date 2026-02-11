import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../components/Header";

const API_URL = "http://143.110.244.163:5000/api";

export default function ChatDetailScreen({ route, navigation }) {
  const { chatId } = route.params;

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const flatListRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setCurrentUser(JSON.parse(u));
    });
  }, []);

  const fetchChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/chat/messages/${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChat(res.data.chat);
      setMessages(res.data.messages || []);

      await axios.put(
        `${API_URL}/chat/seen/${chatId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      alert("Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const temp = {
      _id: `temp-${Date.now()}`,
      message: text,
      createdAt: new Date(),
      senderId: currentUser?._id,
    };


    setMessages((p) => [...p, temp]);
    setText("");

    try {
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `${API_URL}/chat/messages/send`,
        { chatRoomId: chatId, message: temp.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setMessages((p) => p.filter((m) => m._id !== temp._id));

      const code = err?.response?.data?.code;

      if (code === "PREMIUM_REQUIRED")
        alert("Upgrade to premium to send messages");
      else if (code === "PLAN_EXPIRED")
        alert("Your plan expired");
      else alert("Failed to send message");
    }
  };


  const otherUser =
    chat?.participants?.find(
      (p) => p._id !== currentUser?._id
    );

  const renderItem = ({ item }) => {
    const isMine =
      item.senderId === currentUser?._id ||
      item.sender?._id === currentUser?._id;

    const time = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.rowRight : styles.rowLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine && { color: "#fff" },
            ]}
          >
            {item.message}
          </Text>

          <Text style={styles.timeText}>{time}</Text>
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f4f6f8" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}  // ✅ adjust if header height changes
    >
      <Header
        title={otherUser?.name || "Chat"}
        onMenuPress={() => navigation.goBack()}
      />

      {/* ✅ Chat list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 12 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        style={{ flex: 1 }}
      />

      {/* ✅ Input fixed bottom (like Instagram) */}
      <View style={styles.inputWrap}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#000000"
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            !text.trim() && styles.sendDisabled,
          ]}
          onPress={sendMessage}
          disabled={!text.trim()}
          activeOpacity={0.85}
        >
          <Icon name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


/* ================= STYLES ================= */
const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  pendingBanner: {
    backgroundColor: "#fff3cd",
    paddingVertical: 10,
    alignItems: "center",
  },

  pendingText: { color: "#856404", fontSize: 13, fontWeight: "600" },

  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  myMessage: {
    backgroundColor: "#ff4e50",
    borderTopRightRadius: 5,
  },


  otherMessage: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },


  messageText: { fontSize: 14, color: "#222" },

  time: { fontSize: 10, color: "#eee", textAlign: "right", marginTop: 4 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 18 : 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    backgroundColor: "#DCDCDC",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight:600,
    maxHeight: 110,      // ✅ instagram style multiline limit
  },

  sendBtn: {
    backgroundColor: "#ff4e50",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sendDisabled: { opacity: 0.5 },


  sendDisabled: { opacity: 0.5 },

  sendText: { color: "#fff", fontWeight: "700" },

  messageRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  rowRight: {
    justifyContent: "flex-end",
  },

  rowLeft: {
    justifyContent: "flex-start",
  },

  timeText: {
    fontSize: 10,
    color: "#ccc",
    alignSelf: "flex-end",
    marginTop: 4,
  },

});
