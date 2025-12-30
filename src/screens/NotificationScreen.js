import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";

const notifications = [
  {
    id: "1",
    title: "New Interest Received",
    message: "Ankita Kaur has sent you an interest.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    title: "Interest Accepted",
    message: "Riya Sharma accepted your interest.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    title: "Profile Viewed",
    message: "Neha Patel viewed your profile.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "4",
    title: "Plan Expiring Soon",
    message: "Your Silver plan expires in 3 days.",
    time: "3 days ago",
    unread: true,
  },
];

export default function NotificationScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.unread && styles.unreadCard,
      ]}
      activeOpacity={0.8}
      onPress={() => {
        // later: mark as read + deep link
      }}
    >
      <View style={styles.textWrap}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {item.unread && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header
        title="Notifications"
        onMenuPress={() => navigation.openDrawer()}
      />

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            You don’t have any notifications yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff4e50",
  },

  textWrap: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
  },

  message: {
    color: "#555",
    marginTop: 4,
    fontSize: 13,
  },

  time: {
    color: "#999",
    fontSize: 11,
    marginTop: 6,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
