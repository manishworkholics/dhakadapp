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
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AppModal from "../components/AppModal";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = "http://143.110.244.163:5000/api";

export default function RateReviewScreen() {
  const [activeTab, setActiveTab] = useState("write");

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };

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
        showModal("Please select rating", "warning");
        return;
      }

      if (editingId) {
        await axios.put(
          `${API_URL}/review/${editingId}`,
          { rating, title, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        showModal("Review updated ❤️", "success");
      } else {
        await axios.post(
          `${API_URL}/review`,
          {
            targetId: currentUser?._id,
            rating,
            title,
            comment,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        showModal("Review submitted ❤️", "success");
      }

      setRating(0);
      setTitle("");
      setComment("");
      setEditingId(null);
      fetchMyReviews();
      setActiveTab("my");
    } catch (err) {
      showModal(
        err.response?.data?.message || "Something went wrong",
        "warning"
      );
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
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    if (activeTab === "my") {
      fetchMyReviews();
    } else {
      setRefreshing(false);
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
    <SafeAreaView edges={[""]} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9DCE6" />

      <Header title="Rate & Review" />

      <View style={styles.contentWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E75480"]}
              tintColor="#E75480"
            />
          }
        >
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
                  activeTab === "write" && styles.activeTabText,
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
                  activeTab === "my" && styles.activeTabText,
                ]}
              >
                📋 My Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* WRITE REVIEW */}
          {activeTab === "write" && (
            <View style={styles.container}>
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
            </View>
          )}

          {/* MY REVIEWS */}
          {activeTab === "my" && (
            <View style={styles.container}>
              {reviews.length === 0 ? (
                <Text style={styles.noReviewText}>No reviews yet</Text>
              ) : (
                reviews.map((review) => (
                  <View key={review._id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewTitle}>
                        {review.title || "No Title"}
                      </Text>
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: review.isApproved ? "green" : "orange",
                          },
                        ]}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Text>
                    </View>

                    <Text style={styles.ratingText}>
                      {"⭐".repeat(review.rating)}
                    </Text>

                    <Text style={styles.reviewComment}>{review.comment}</Text>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => handleEdit(review)}
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
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => handleDelete(review._id),
                              },
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
            </View>
          )}
        </ScrollView>
      </View>

      <Footer />

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9DCE6",
    
  },

  contentWrapper: {
    flex: 1,
  },

  scrollContainer: {
    paddingBottom: 110,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 12,
    marginBottom: 4,
  },

  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 8,
  },

  activeTab: {
    backgroundColor: "#E75480",
  },

  tabText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
  },

  activeTabText: {
    color: "white",
  },

  container: {
    padding: 18,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },

  star: {
    fontSize: 40,
    color: "#C0C0C0",
    marginHorizontal: 5,
  },

  starActive: {
    color: "#FF8C00",
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
    textAlignVertical: "top",
  },

  submitBtn: {
    backgroundColor: "#E75480",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
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

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  reviewTitle: {
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    marginRight: 10,
  },

  statusText: {
    fontWeight: "bold",
  },

  ratingText: {
    marginVertical: 4,
  },

  reviewComment: {
    color: "#333",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 8,
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
    height: 200,
    alignSelf: "center",
    marginTop: 6,
  },

  noReviewText: {
    textAlign: "center",
    color: "#333",
    fontSize: 15,
  },
});