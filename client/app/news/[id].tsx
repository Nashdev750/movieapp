import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { newsService } from '@/services/api';
import type { News } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsDetails();
  }, [id]);

  const fetchNewsDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getNewsItem(id as string);
      setNews(response);
    } catch (err) {
      setError('Failed to load news details. Please try again later.');
      console.error('Error fetching news details:', err);
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

  if (error || !news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'News article not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNewsDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: news.image }} style={styles.headerImage} />
          <View style={styles.overlay} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color="#ED188D" />
            <Text style={styles.date}>{news.date}</Text>
          </View>
          <Text style={styles.title}>{news.title}</Text>
          <Text style={styles.description}>{news.description}</Text>

          {/* Gallery */}
          {news.gallery && news.gallery.length > 0 && (
            <View style={styles.gallery}>
              <Text style={styles.galleryTitle}>Gallery</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContent}
              >
                {news.gallery.map((image, index) => (
                  <View key={index} style={styles.galleryImageContainer}>
                    <Image 
                      source={{ uri: image }} 
                      style={styles.galleryImage}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * 0.6,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  date: {
    color: '#ED188D',
    fontSize: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 24,
  },
  gallery: {
    marginTop: 24,
  },
  galleryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  galleryContent: {
    gap: 12,
  },
  galleryImageContainer: {
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_WIDTH * 0.4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333333',
    marginRight: 12,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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