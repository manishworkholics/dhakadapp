import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";

const shortlistData = [
  {
    id: "1",
    name: "Pradeep Sen",
    age: 23,
    city: "Indore",
    occupation: "Software Developer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Amit Sharma",
    age: 27,
    city: "Bhopal",
    occupation: "Business Analyst",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

export default function ShortlistScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.city} • Age {item.age}
        </Text>
        <Text style={styles.occupation}>{item.occupation}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.viewText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.removeBtn}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header
        title="Shortlist"
        onMenuPress={() => navigation.openDrawer()}
      />

      {shortlistData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            You have not shortlisted any profiles yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={shortlistData}
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
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  details: {
    color: "#777",
    marginTop: 2,
  },
  occupation: {
    color: "#555",
    marginTop: 2,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  viewBtn: {
    borderWidth: 1,
    borderColor: "#ff4e50",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  viewText: {
    color: "#ff4e50",
    fontWeight: "600",
    fontSize: 13,
  },
  removeBtn: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  removeText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 13,
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
