import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

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

const movies = [
  {
    id: 1,
    title: 'Inception',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80',
  },
  {
    id: 2,
    title: 'The Dark Knight',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80',
  },
  {
    id: 3,
    title: 'Interstellar',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80',
  },
  {
    id: 5,
    title: 'The Matrix',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80',
  },
  {
    id: 6,
    title: 'Forrest Gump',
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=500&q=80',
  },
  {
    id: 7,
    title: 'The Shawshank Redemption',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80',
  },
  {
    id: 8,
    title: 'Goodfellas',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80',
  },
  {
    id: 9,
    title: 'The Godfather',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&q=80',
  },
];

export default function MovieListScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState('new');
  const router = useRouter();

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
            <View key={movie.id} style={styles.movieContainer}>
              <TouchableOpacity 
                style={styles.movieCard}
                onPress={() => router.push(`/movies/${movie.id}`)}
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