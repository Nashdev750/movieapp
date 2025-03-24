import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

const WINDOW_WIDTH = Dimensions.get('window').width;

// Extended movie data with additional details
const moviesData = {
  1: {
    _id: 1,
    title: 'Inception',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
  },
  2: {
    id: 2,
    title: 'The Dark Knight',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
  },
  // Add more movies with their details...
};

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const movie = moviesData[id as keyof typeof moviesData];

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: movie.image }} style={styles.posterImage} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.description}>{movie.description}</Text>

          {/* Trailer Section */}
          <View style={styles.trailerContainer}>
            <WebView
              style={styles.trailer}
              source={{ uri: movie.trailerUrl }}
              allowsFullscreenVideo
            />
          </View>

          {/* Booking Button */}
          <TouchableOpacity style={styles.bookingButton}>
            <Text style={styles.bookingButtonText}>BOOKING ROOM (ĐẶT PHÒNG)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    width: '100%',
    height: WINDOW_WIDTH * 0.8,
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 16,
  },
  trailerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trailer: {
    flex: 1,
  },
  bookingButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ED188D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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