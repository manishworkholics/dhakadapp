import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BlogDetailsScreen({ route }) {
  const { blog } = route.params;

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
            <Text style={styles.categoryText}>{blog.category}</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.metaTopRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={15} color="#ff4e50" />
              <Text style={styles.metaText}>{blog.date}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={15} color="#ff4e50" />
              <Text style={styles.metaText}>{blog.readTime}</Text>
            </View>
          </View>

          <View style={styles.authorRow}>
            <Ionicons name="person-circle-outline" size={18} color="#ff4e50" />
            <Text style={styles.authorText}>{blog.author}</Text>
          </View>

          <Text style={styles.title}>{blog.title}</Text>

          <Text style={styles.description}>{blog.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Overview</Text>

          <Text style={styles.content}>{blog.content}</Text>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 100,
  },

  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
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
  },

  categoryBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(255,78,80,0.95)",
    paddingHorizontal: 12,
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
    borderRadius: 22,
    padding: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  metaTopRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 12,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3f4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  metaText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginLeft: 6,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  authorText: {
    fontSize: 13,
    color: "#444",
    marginLeft: 6,
    fontWeight: "700",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    lineHeight: 32,
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },

  content: {
    fontSize: 15,
    color: "#444",
    lineHeight: 26,
  },
});