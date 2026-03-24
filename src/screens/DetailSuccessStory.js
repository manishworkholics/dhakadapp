import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../components/Footer";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

export default function DetailSuccessStory({ route, navigation }) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await axios.get(`${API_URL}/success/${id}`);
      setStory(res.data.story);
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff7a00" />
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.center}>
        <Text>Story not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Custom Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>DetailSuccess Story</Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== HERO IMAGE WITH BLUR BACKGROUND ===== */}
        <ImageBackground
          source={{ uri: story.image }}
          style={styles.imageWrapper}
          blurRadius={12}
        >
          <Image
            source={{ uri: story.image }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* ===== CONTENT CARD ===== */}
        <View style={styles.card}>
          <Text style={styles.title}>{story.title}</Text>

          <Text style={styles.couple}>
            💖 {story.name} & {story.partnerName}
          </Text>

          <View style={styles.divider} />

          {story.story.split("\n\n").map((para, index) => (
            <Text key={index} style={styles.storyText}>
              {para}
            </Text>
          ))}

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Start Your Success Story ❤️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  topBar: {
    height: 110,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop:50
  },

  topTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginLeft: 8,
    marginTop:50
  },

  scrollContent: {
    paddingBottom: 110,
  },

  /* IMAGE SECTION - SAME DESIGN */
  imageWrapper: {
    width: "100%",
    height: 340,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  heroImage: {
    width: "98%",
    height: "95%",
    borderRadius: 14,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 20,
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },

  couple: {
    fontSize: 16,
    color: "#ff7a00",
    fontWeight: "600",
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },

  storyText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    marginBottom: 12,
  },

  ctaBtn: {
    backgroundColor: "#ff7a00",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 1,
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});