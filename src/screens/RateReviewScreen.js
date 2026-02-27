import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

export default function RateReviewScreen() {
  const [activeTab, setActiveTab] = useState("write");

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  /* LOAD USER */
  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setCurrentUser(JSON.parse(u));
    });
  }, []);

  useEffect(() => {
    if (activeTab === "my") fetchMyReviews();
  }, [activeTab]);

  const handleSubmit = async () => {
    try {
      const token = await getToken();

      if (!rating) {
        Alert.alert("Please select rating");
        return;
      }

      if (editingId) {
        await axios.put(
          `${API_URL}/review/${editingId}`,
          { rating, title, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Alert.alert("Review updated ❤️");
      } else {
        await axios.post(
          `${API_URL}/review`,
          {
            targetId: currentUser?._id, // dynamic later
            rating,
            title,
            comment,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Alert.alert("Review submitted ❤️");
      }

      setRating(0);
      setTitle("");
      setComment("");
      setEditingId(null);
      fetchMyReviews();
      setActiveTab("my");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    }
  };

  const fetchMyReviews = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(`${API_URL}/review/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const token = await getToken();

    await axios.delete(`${API_URL}/review/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMyReviews();
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setTitle(review.title);
    setComment(review.comment);
    setEditingId(review._id);
    setActiveTab("write");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9DCE6" />

      {/* Top Image */}
      <Image
        source={require("../assets/images/couple 1.png")} 
        style={styles.topImage}
        resizeMode="contain"
      />

      {/* Tabs */}
      <View style={styles.tabs}>
  <TouchableOpacity
    style={[styles.tabBtn, activeTab === "write" && styles.activeTab]}
    onPress={() => setActiveTab("write")}
  >
    <Text
      style={[
        styles.tabText,
        activeTab === "write" && styles.activeTabText
      ]}
    >
      ⭐ Write Review
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.tabBtn, activeTab === "my" && styles.activeTab]}
    onPress={() => setActiveTab("my")}
  >
    <Text
      style={[
        styles.tabText,
        activeTab === "my" && styles.activeTabText
      ]}
    >
      📋 My Reviews
    </Text>
  </TouchableOpacity>
</View>

      {/* ================= WRITE REVIEW ================= */}
      {activeTab === "write" && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Share Your Experience</Text>

          <View style={styles.starsRow}>
            {stars.map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text style={[styles.star, rating >= s && styles.starActive]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Review Title (Optional)"
            placeholderTextColor="#777"   
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Write your experience..."
            placeholderTextColor="#777"  
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {editingId ? "Update Review" : "Submit Review"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ================= MY REVIEWS ================= */}
      {activeTab === "my" && (
        <ScrollView contentContainerStyle={styles.container}>
          {reviews.length === 0 ? (
            <Text style={{ textAlign: "center" }}>No reviews yet</Text>
          ) : (
            reviews.map((review) => (
              <View key={review._id} style={styles.reviewCard}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {review.title || "No Title"}
                  </Text>
                  <Text
                    style={{
                      color: review.isApproved ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {review.isApproved ? "Approved" : "Pending"}
                  </Text>
                </View>

                <Text style={{ marginVertical: 4 }}>
                  {"⭐".repeat(review.rating)}
                </Text>

                <Text>{review.comment}</Text>

                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(review)}     // ✅ add
                    activeOpacity={0.8}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      Alert.alert(
                        "Delete Review",
                        "Are you sure you want to delete this review?",
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Delete", style: "destructive", onPress: () => handleDelete(review._id) },
                        ]
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9DCE6" },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    marginTop: 30
  },

  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },

  activeTab: {
    backgroundColor: "#E75480",
  },

  tabText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
  },

  container: {
    padding: 18,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },

  star: {
    fontSize: 40,
    color: "#ddd",
    marginHorizontal: 4,
  },

  starActive: {
    color: "#FFD700",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  textArea: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginBottom: 10,
  },

  submitBtn: {
    backgroundColor: "#E75480",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },

  reviewCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  editBtn: {
    width: 80,
    height: 36,
    backgroundColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deleteBtn: {
    width: 80,
    height: 36,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  editText: {
    color: "#333",
    fontWeight: "700",
  },
  topImage: {
  width: "100%",
  height: 150,
},
topImage: {
  width: "100%",
  height: 200,
  alignSelf: "center",
  marginTop: 6,
}
});