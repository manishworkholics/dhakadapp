import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 36) / 2; 

export default function GalleryScreen() {
  const navigation = useNavigation();

  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ API CALL
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(
        'http://143.110.244.163:5000/api/gallery',
      );
      const json = await res.json();

      if (json.success) {
        const sorted = json.gallery.sort(
          (a, b) => a.order - b.order,
        );
        setGalleryData(sorted);
      }
    } catch (e) {
      console.log('Gallery API Error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RENDER ITEM
  const renderItem = ({ item }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9}>
    <Image
      source={{
        uri: item.image || 'https://via.placeholder.com/300',
      }}
      style={styles.image}
    />

    {/* 🔥 Gradient Overlay Feel */}
    <View style={styles.overlay}>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.desc} numberOfLines={1}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Gallery</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* CONTENT */}
        {loading ? (
          <Text style={styles.loading}>Loading gallery...</Text>
        ) : (
      <FlatList
  data={galleryData}
  keyExtractor={item => item._id}
  renderItem={renderItem}
  numColumns={2}
  columnWrapperStyle={{
    justifyContent: 'space-between', // 🔥 equal spacing
    marginBottom: 12, // row gap
  }}
  contentContainerStyle={{
    paddingHorizontal: 1,
    paddingTop: 18,
    paddingBottom: 20,
  }}
  showsVerticalScrollIndicator={false}
/>
        )}
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3EEF7',
  },

  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginBottom: 30,
  },

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    width: ITEM_WIDTH,
    height: 150,
    
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    marginHorizontal:4,
    
  },

  image: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
});