import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";

export default function BlogScreen({ navigation }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://143.110.244.163:5000/api/blogs");

      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (error) {
      console.log("Blog API Error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderBlogCard = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.blogCard}
        onPress={() => navigation.navigate("BlogDetails", { blog: item })}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.blogImage} />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>Blog</Text>
          </View>
        </View>

        <View style={styles.blogContent}>
          <View style={styles.metaRow}>
            {/* <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#ff4e50" />
              <Text style={styles.metaText}>
                {formatDate(item.publishedAt || item.createdAt)}
              </Text>
            </View> */}

            {/* <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color="#ff4e50" />
              <Text style={styles.metaText}>{item.author}</Text>
            </View> */}
          </View>

          <Text numberOfLines={2} style={styles.blogTitle}>
            {item.title}
          </Text>

          <Text numberOfLines={3} style={styles.blogDescription}>
            {item.excerpt}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.readMoreText}>Read More......</Text>


            <View style={styles.arrowBtn}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={[""]} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Header title="Blogs" />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item) => item._id}
          renderItem={renderBlogCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff4e50"]}
            />
          }
          ListHeaderComponent={
            <View style={styles.topSection}>
             
              <LinearGradient
             colors={["#ff512f", "#dd2476"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.blogBanner}
              >
                <Text style={styles.blogBannerText}>Dhakad Matrimony Blog</Text>
              </LinearGradient>
               <Text style={styles.smallHeading}>Latest Blogs</Text>
              <Text style={styles.subHeading}>
                Discover relationship advice, marriage tips and Dhakad Matrimony guides.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No blogs found</Text>
            </View>
          }
        />
      )}

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  listContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 100,
  },

  topSection: {
    marginBottom: 16,
    paddingHorizontal: 2,
   

  },

  smallHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ff4e50",
    marginBottom: 4,
  },

  mainHeading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },

  subHeading: {
    fontSize: 14,
    color: "#666",
    lineHeight: 21,
  },

  blogCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  imageWrapper: {
    position: "relative",
  },

  blogImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },

  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 14,
    backgroundColor: "rgba(255,78,80,0.95)",
    paddingHorizontal: 19,
    paddingVertical: 5,
    borderRadius: 20,
  },

  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  blogContent: {
    padding: 16,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2f3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 6,
  },

  metaText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  blogTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    lineHeight: 28,
    marginBottom: 8,
  },

  blogDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  readMoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff4e50",
  },

  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ff4e50",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 15,
    color: "#777",
    fontWeight: "600",
  },
blogBanner: {
  height: 55,
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: -16,   // 👈 ye important hai
  marginBottom: 15,
  backgroundColor: "#a33a00",
  
 
},

blogBannerText: {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "600",
},
});