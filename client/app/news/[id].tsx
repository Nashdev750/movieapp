import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const WINDOW_WIDTH = Dimensions.get('window').width;

const newsData = {
  1: {
    _id: 1,
    title: 'New IMAX Theater Opening Soon',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    date: 'March 20, 2024',
    description: 'Experience movies like never before in our state-of-the-art IMAX theater. Our new IMAX theater features cutting-edge projection technology, immersive sound systems, and premium seating for the ultimate movie-watching experience.\n\nThe grand opening will feature exclusive screenings of upcoming blockbusters, special events, and promotional offers for our valued customers. Be among the first to experience the future of cinema in our new IMAX theater.',
    gallery: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
      'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
    ],
  },
  2: {
    id: 2,
    title: 'Special Movie Marathon Weekend',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    date: 'March 25, 2024',
    description: 'Join us for an epic movie marathon featuring classic blockbusters. We\'ve curated a selection of fan-favorite films for an unforgettable weekend of entertainment.\n\nThe marathon includes complimentary snacks, exclusive merchandise, and special pricing for multiple screenings. Don\'t miss this chance to relive the magic of cinema\'s greatest hits on the big screen.',
    gallery: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
    ],
  },
  // Add more news items...
};

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const news = newsData[id as keyof typeof newsData];

  if (!news) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>News article not found</Text>
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
          <Text style={styles.date}>{news.date}</Text>
          <Text style={styles.title}>{news.title}</Text>
          <Text style={styles.description}>{news.description}</Text>

          {/* Gallery */}
          {news.gallery && (
            <View style={styles.gallery}>
              <Text style={styles.galleryTitle}>Gallery</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContent}
              >
                {news.gallery.map((image, index) => (
                  <Image 
                    key={index}
                    source={{ uri: image }} 
                    style={styles.galleryImage}
                  />
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
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  date: {
    color: '#ED188D',
    fontSize: 14,
    marginBottom: 8,
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
  galleryImage: {
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_WIDTH * 0.4,
    borderRadius: 12,
    marginRight: 12,
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
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});