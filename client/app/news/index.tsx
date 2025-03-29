import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { newsService } from '@/services/api';
import type { News } from '@/services/api/types';
import { Calendar } from 'lucide-react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const NEWS_CARD_HEIGHT = (WINDOW_WIDTH - 32) * 0.6;

export default function NewsScreen() {
  const router = useRouter();
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getNews();
      setNewsItems(response || []);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED188D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.newsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.newsListContent}
      >
        {newsItems.map((item) => (
          <TouchableOpacity 
            key={item._id} 
            style={styles.newsCard}
            onPress={() => router.push(`/news/${item._id}`)}
          >
            <Image 
              source={{ uri: item.image }}
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <View style={styles.dateContainer}>
                <Calendar size={16} color="#ED188D" />
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.overlay} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Booking Button */}
      <TouchableOpacity 
        style={styles.bookingButton}
        onPress={() => router.push('/booking')}
      >
        <Text style={styles.bookingButtonText}>BOOKING ROOM (ĐẶT PHÒNG)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ED188D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsList: {
    flex: 1,
  },
  newsListContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 80,
  },
  newsCard: {
    width: '100%',
    height: NEWS_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333333',
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
  },
  newsContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  newsDate: {
    color: '#ED188D',
    fontSize: 14,
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  bookingButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ED188D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});