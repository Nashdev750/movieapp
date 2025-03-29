import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { movieService } from '@/services/api';
import type { Movie } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MOVIE_CARD_WIDTH = (WINDOW_WIDTH - 48) / 3;

const categories = [
  { id: 'new', label: 'New movie', color: '#ED188D' },
  { id: 'action', label: 'Actions' },
  { id: 'mental', label: 'Mentality' },
  { id: 'cartoon', label: 'Cartoon' },
  { id: 'humor', label: 'Humorous' },
  { id: 'horror', label: 'Horror' },
];

export default function MovieListScreen() {
  const [selectedCategory, setSelectedCategory] = useState('new');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieService.getMovies();
      setMovies(response || []);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error('Error fetching movies:', err);
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchMovies}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}>
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && { color: '#ED188D' },
                ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.moviesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.moviesGrid}>
          {movies.map((movie) => (
            <View key={movie._id} style={styles.movieContainer}>
              <TouchableOpacity 
                style={styles.movieCard}
                onPress={() => router.push(`/movies/${movie._id}`)}
              >
                <Image source={{ uri: movie.image }} style={styles.movieImage} />
              </TouchableOpacity>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
            </View>
          ))}
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
  categoriesContainer: {
    height: 40,
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
    height: 40,
  },
  categoryButton: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: 'transparent',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  moviesContainer: {
    flex: 1,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  movieContainer: {
    width: MOVIE_CARD_WIDTH,
    marginBottom: 16,
  },
  movieCard: {
    width: '100%',
    height: MOVIE_CARD_WIDTH * 1.5,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'left',
  },
});