import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import RenderHtml from "react-native-render-html";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BlogDetailsScreen({ route }) {
  const { blog } = route.params;
  const { width } = useWindowDimensions();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const source = {
    html: blog?.content || "<p>No content available</p>",
  };

  return (
    <SafeAreaView edges={[""]} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title="Blog Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageCard}>
          <Image source={{ uri: blog.image }} style={styles.coverImage} />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>Blog</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.metaTopRow}>
            {/* <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={15} color="#ff4e50" />
              <Text style={styles.metaText}>
                {formatDate(blog.publishedAt || blog.createdAt)}
              </Text>
            </View> */}

            {/* <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={15} color="#ff4e50" />
              <Text style={styles.metaText}>{blog.author || "Admin"}</Text>
            </View> */}
          </View>

          <Text style={styles.title}>{blog.title}</Text>
          <Text style={styles.description}>{blog.excerpt}</Text>

          <View style={styles.divider} />

          <RenderHtml
            contentWidth={width - 28}
            source={source}
            tagsStyles={{
              body: {
                color: "#444",
                fontSize: 15,
                lineHeight: 26,
              },
              p: {
                color: "#444",
                fontSize: 15,
                lineHeight: 26,
                marginBottom: 14,
              },
              h1: {
                fontSize: 28,
                fontWeight: "800",
                color: "#111",
                marginBottom: 12,
              },
              h2: {
                fontSize: 24,
                fontWeight: "800",
                color: "#111",
                marginTop: 14,
                marginBottom: 10,
              },
              h3: {
                fontSize: 20,
                fontWeight: "700",
                color: "#111",
                marginTop: 12,
                marginBottom: 8,
              },
              ul: {
                marginBottom: 14,
                paddingLeft: 18,
              },
              ol: {
                marginBottom: 14,
                paddingLeft: 18,
              },
              li: {
                color: "#444",
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 8,
              },
              strong: {
                fontWeight: "700",
                color: "#111",
              },
            }}
          />
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 100,
  },

  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    position: "relative",
  },

  coverImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },

  categoryBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(255,78,80,0.95)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },

  categoryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  metaTopRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 12,
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

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    lineHeight: 32,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 14,
  },

  divider: {
    height: 2,
    backgroundColor: "#D3D3D3",
    marginBottom: 14,
  },
});