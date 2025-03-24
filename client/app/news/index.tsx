import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const WINDOW_WIDTH = Dimensions.get('window').width;
const NEWS_CARD_HEIGHT = (WINDOW_WIDTH - 32) * 0.6;

const newsItems = [
  {
    id: 1,
    title: 'New IMAX Theater Opening Soon',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    date: 'March 20, 2024',
    description: 'Experience movies like never before in our state-of-the-art IMAX theater.',
  },
  {
    id: 2,
    title: 'Special Movie Marathon Weekend',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    date: 'March 25, 2024',
    description: 'Join us for an epic movie marathon featuring classic blockbusters.',
  },
  {
    id: 3,
    title: 'Exclusive Preview Screenings',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
    date: 'March 30, 2024',
    description: 'Be among the first to watch upcoming releases before they hit theaters.',
  },
  {
    id: 4,
    title: 'New Food Menu Launch',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80',
    date: 'April 5, 2024',
    description: 'Discover our new gourmet menu items perfect for your movie experience.',
  },
];

export default function NewsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.newsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.newsListContent}
      >
        {newsItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.newsCard}
            onPress={() => router.push(`/news/${item.id}`)}
          >
            <Image 
              source={{ uri: item.image }}
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <Text style={styles.newsDate}>{item.date}</Text>
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
  },
  newsContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1,
  },
  newsDate: {
    color: '#ED188D',
    fontSize: 14,
    marginBottom: 4,
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