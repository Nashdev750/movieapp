import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { movieService } from '@/services/api';
import type { Movie } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieService.getMovie(id as string);
      setMovie(response);
    } catch (err) {
      setError('Failed to load movie details. Please try again later.');
      console.error('Error fetching movie details:', err);
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

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMovieDetails}>
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
          <Image source={{ uri: movie.image }} style={styles.posterImage} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.description}>{movie.description}</Text>

          {/* Trailer Section */}
          {movie.trailerUrl && (
            <View style={styles.trailerContainer}>
              <WebView
                style={styles.trailer}
                source={{ uri: movie.trailerUrl }}
                allowsFullscreenVideo
              />
            </View>
          )}

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
});