import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Header from "../components/Header";

const interestsData = [
  {
    id: "1",
    name: "Muskan Dhakad",
    age: 24,
    city: "Indore",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    status: "new",
  },
  {
    id: "2",
    name: "Riya Sharma",
    age: 26,
    city: "Bhopal",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "accepted",
  },
];

export default function InterestScreen({ navigation }) {
  const [mainTab, setMainTab] = useState("received"); // received | sent
  const [subTab, setSubTab] = useState("new"); // new | accepted | denied

  const filteredData = interestsData.filter(
    (item) => item.status === subTab
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.age} yrs • {item.city}
        </Text>

        {subTab === "new" && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn}>
              <Text style={styles.rejectText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity>
        <Text style={styles.viewProfile}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header
        title="Interests"
        onMenuPress={() => navigation.openDrawer()}
      />

      {/* MAIN TABS */}
      <View style={styles.mainTabs}>
        <TabButton
          title="Received"
          active={mainTab === "received"}
          onPress={() => setMainTab("received")}
        />
        <TabButton
          title="Sent"
          active={mainTab === "sent"}
          onPress={() => setMainTab("sent")}
        />
      </View>

      {/* SUB TABS */}
      <View style={styles.subTabs}>
        <SubTab title="New" active={subTab === "new"} onPress={() => setSubTab("new")} />
        <SubTab
          title="Accepted"
          active={subTab === "accepted"}
          onPress={() => setSubTab("accepted")}
        />
        <SubTab
          title="Denied"
          active={subTab === "denied"}
          onPress={() => setSubTab("denied")}
        />
      </View>

      {/* LIST */}
      {filteredData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: "#888" }}>No requests found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

/* 🔹 Reusable Components */

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabBtn, active && styles.tabActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const SubTab = ({ title, active, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.subTab, active && styles.subTabActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  mainTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tabBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: "#ff4e50",
  },
  tabText: {
    fontWeight: "600",
    color: "#777",
  },
  tabTextActive: {
    color: "#ff4e50",
  },

  subTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  subTab: {
    color: "#777",
    fontWeight: "600",
  },
  subTabActive: {
    color: "#ff4e50",
    borderBottomWidth: 2,
    borderColor: "#ff4e50",
  },

  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  details: {
    color: "#777",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 6,
  },
  acceptBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: "#dc3545",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  rejectText: {
    color: "#dc3545",
    fontWeight: "600",
  },
  viewProfile: {
    color: "#ff4e50",
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
