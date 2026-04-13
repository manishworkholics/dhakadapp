import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  useWindowDimensions,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
// import Header from '../components/Header';
import Footer from '../components/Footer';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://143.110.244.163:5000/api';

export default function BlogDetailsScreen({ route }) {
  const initialBlog = route?.params?.blog || {};
  const { width } = useWindowDimensions();

  const [blogData, setBlogData] = useState(initialBlog);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const fetchBlogDetails = useCallback(
    async (showLoader = false) => {
      try {
        if (showLoader) setLoading(true);

        const slugOrId = initialBlog?.slug || initialBlog?._id;

        if (!slugOrId) {
          setLoading(false);
          setRefreshing(false);
          return;
        }

        let res = null;

        try {
          // most likely endpoint
          res = await axios.get(`${API_URL}/blogs/${slugOrId}`);
        } catch (err1) {
          try {
            // fallback if backend uses singular route
            res = await axios.get(`${API_URL}/blog/${slugOrId}`);
          } catch (err2) {
            try {
              // fallback by id route
              res = await axios.get(`${API_URL}/blogs/details/${slugOrId}`);
            } catch (err3) {
              console.log(
                'Blog Details API Error',
                err3?.response?.data || err3.message,
              );
            }
          }
        }

        if (res?.data?.success && res?.data?.blog) {
          setBlogData(res.data.blog);
        }
      } catch (error) {
        console.log(
          'Blog Details Fetch Error',
          error?.response?.data || error.message,
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [initialBlog],
  );

  useEffect(() => {
    fetchBlogDetails(true);
  }, [fetchBlogDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlogDetails(false);
  };

  const source = {
    html: blogData?.content || '<p>No content available</p>',
  };

  return (
    <SafeAreaView edges={['']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* <Header title="Blog Details" /> */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('Blog')}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Blog Details</Text>

        <View style={{ width: 30 }} />
      </View>

      <LinearGradient
        colors={['#ff512f', '#dd2476']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.blogBanner}
      >
        <Text style={styles.blogBannerText}>Dhakad Matrimony Blog</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#ff4e50" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff4e50']}
              tintColor="#ff4e50"
            />
          }
        >
          <View style={styles.imageCard}>
            <Image
              source={{ uri: blogData?.image }}
              style={styles.coverImage}
            />

      
          </View>

          <View style={styles.contentCard}>
            <View style={styles.metaTopRow}>
              <View style={styles.metaItem}>
               
              </View>

           
            </View>

            <Text style={styles.title}>{blogData?.title}</Text>
            <Text style={styles.description}>{blogData?.excerpt}</Text>

            <View style={styles.divider} />

            <RenderHtml
              contentWidth={width - 28}
              source={source}
              tagsStyles={{
                body: {
                  color: '#444',
                  fontSize: 15,
                  lineHeight: 26,
                },
                p: {
                  color: '#444',
                  fontSize: 15,
                  lineHeight: 26,
                  marginBottom: 14,
                },
                h1: {
                  fontSize: 28,
                  fontWeight: '800',
                  color: '#111',
                  marginBottom: 12,
                },
                h2: {
                  fontSize: 24,
                  fontWeight: '800',
                  color: '#111',
                  marginTop: 14,
                  marginBottom: 10,
                },
                h3: {
                  fontSize: 20,
                  fontWeight: '700',
                  color: '#111',
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
                  color: '#444',
                  fontSize: 15,
                  lineHeight: 24,
                  marginBottom: 8,
                },
                strong: {
                  fontWeight: '700',
                  color: '#111',
                },
              }}
            />
          </View>
        </ScrollView>
      )}

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 100,
  },

  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    position: 'relative',
  },

  coverImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },

  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255,78,80,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },

  categoryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  metaItem: {
    backgroundColor: '#fff2f3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 6,
  },

  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    lineHeight: 32,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginBottom: 14,
  },

  blogBanner: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
    marginHorizontal: -14,
  },

  blogBannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  topBar: {
    height: 108,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:42
  },

  topTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginLeft: 8,
    marginTop:42
  },
});
