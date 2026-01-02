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
import Header from "../components/Header";

const API_URL = "http://143.110.244.163:5000/api";

export default function ChatDetailScreen({ route, navigation }) {
  const { chatId } = route.params;

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef(null);

  /* ================= FETCH CHAT ================= */
  const fetchChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChat(res.data.chat);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log("CHAT DETAIL ERROR", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [chatId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim() || chat?.status !== "active") return;

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/chat/message/send`,
        {
          chatId,
          message: text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setText("");
      }
    } catch (err) {
      console.log("SEND MESSAGE ERROR", err?.response?.data || err.message);
    }
  };

  /* ================= MESSAGE ITEM ================= */
  const renderItem = ({ item }) => {
    const isMine = item.isSender; // backend should send this boolean

    return (
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
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  /* ================= LOADER ================= */
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        title={chat?.otherUser?.name || "Chat"}
        onMenuPress={() => navigation.goBack()}
      />

      {/* ================= CHAT STATUS ================= */}
      {chat?.status !== "active" && (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingText}>
            Chat will start after request is accepted
          </Text>
        </View>
      )}

      {/* ================= MESSAGES ================= */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* ================= INPUT ================= */}
      <View style={styles.inputWrap}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={
            chat?.status === "active"
              ? "Type a message"
              : "Waiting for acceptance..."
          }
          editable={chat?.status === "active"}
          style={[
            styles.input,
            chat?.status !== "active" && styles.inputDisabled,
          ]}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!text.trim() || chat?.status !== "active") &&
              styles.sendDisabled,
          ]}
          onPress={sendMessage}
          disabled={!text.trim() || chat?.status !== "active"}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pendingBanner: {
    backgroundColor: "#fff3cd",
    paddingVertical: 10,
    alignItems: "center",
  },

  pendingText: {
    color: "#856404",
    fontSize: 13,
    fontWeight: "600",
  },

  /* MESSAGE */
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },

  myMessage: {
    backgroundColor: "#ff4e50",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },

  otherMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    elevation: 2,
  },

  messageText: {
    fontSize: 14,
    color: "#222",
  },

  time: {
    fontSize: 10,
    color: "#eee",
    textAlign: "right",
    marginTop: 4,
  },

  /* INPUT */
  inputWrap: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },

  inputDisabled: {
    backgroundColor: "#eee",
  },

  sendBtn: {
    backgroundColor: "#ff4e50",
    paddingHorizontal: 18,
    borderRadius: 22,
    justifyContent: "center",
  },

  sendDisabled: {
    opacity: 0.5,
  },

  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
});
