import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Menu, User } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import ImageViewer from '@/components/ImageViewer';
import { movieService, menuService, branchService, newsService } from '@/services/api';
import type { Movie, MenuItem, Branch, News } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = WINDOW_WIDTH * 0.7;
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const SPACING = 20;
const MENU_CARD_WIDTH = WINDOW_WIDTH * 0.6;
const MENU_CARD_HEIGHT = MENU_CARD_WIDTH * 1.5;
const BRANCH_CARD_WIDTH = WINDOW_WIDTH * 0.6;
const BRANCH_CARD_HEIGHT = BRANCH_CARD_WIDTH * 0.75;
const NEWS_CARD_WIDTH = WINDOW_WIDTH * 0.85;
const NEWS_CARD_HEIGHT = NEWS_CARD_WIDTH * 0.6;
const CENTER_OFFSET = (WINDOW_WIDTH - CARD_WIDTH) / 2;

function MovieCard({ movie, index, scrollX, onPress }) {
  const inputRange = [
    (index - 2) * (CARD_WIDTH + SPACING),
    (index - 1) * (CARD_WIDTH + SPACING),
    index * (CARD_WIDTH + SPACING),
    (index + 1) * (CARD_WIDTH + SPACING),
    (index + 2) * (CARD_WIDTH + SPACING),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 0.85, 1, 0.85, 0.8],
      'clamp'
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 0.7, 1, 0.7, 0.5],
      'clamp'
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <TouchableOpacity onPress={() => onPress(movie._id)}>
      <Animated.View style={[styles.movieCard, animatedStyle]}>
        <Image source={{ uri: movie.image }} style={styles.movieImage} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function MenuCard({ item, onPress }) {
  const imageRef = useRef();
  const [layout, setLayout] = useState(null);

  const measureLayout = () => {
    imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return (
    <TouchableOpacity 
      style={styles.menuCard}
      onPress={() => {
        measureLayout();
        onPress(item.image, layout);
      }}
    >
      <Image 
        ref={imageRef}
        source={{ uri: item.image }} 
        style={styles.menuImage}
        onLayout={measureLayout}
      />
    </TouchableOpacity>
  );
}

function BranchCard({ item, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.branchCard}
      onPress={() => onPress(item._id)}
    >
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.branchImage}
      />
    </TouchableOpacity>
  );
}

function NewsCard({ item, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => onPress(item._id)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.newsImage}
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLayout, setImageLayout] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState({
    movies: true,
    menu: true,
    branches: true,
    news: true,
  });
  const [error, setError] = useState({
    movies: null,
    menu: null,
    branches: null,
    news: null,
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleImagePress = (imageUrl, layout) => {
    setSelectedImage(imageUrl);
    setImageLayout(layout);
    setIsImageViewerVisible(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  const handleMoviePress = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  const handleBranchPress = (branchId: string) => {
    router.push(`/branch/${branchId}`);
  };

  const handleNewsPress = (newsId: string) => {
    router.push(`/news/${newsId}`);
  };

  const fetchData = async () => {
    try {
      const moviesResponse = await movieService.getMovies();
      setMovies(moviesResponse || []);
    } catch (err) {
      setError(prev => ({ ...prev, movies: 'Failed to load movies' }));
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(prev => ({ ...prev, movies: false }));
    }

    try {
      const menuResponse = await menuService.getMenuItems();
      setMenuItems(menuResponse || []);
    } catch (err) {
      setError(prev => ({ ...prev, menu: 'Failed to load menu items' }));
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(prev => ({ ...prev, menu: false }));
    }

    try {
      const branchesResponse = await branchService.getBranches();
      setBranches(branchesResponse || []);
    } catch (err) {
      setError(prev => ({ ...prev, branches: 'Failed to load branches' }));
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(prev => ({ ...prev, branches: false }));
    }

    try {
      const newsResponse = await newsService.getNews();
      setNewsItems(newsResponse || []);
    } catch (err) {
      setError(prev => ({ ...prev, news: 'Failed to load news' }));
      console.error('Error fetching news:', err);
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: CARD_WIDTH + SPACING,
          animated: false,
        });
      }, 100);
    }
  }, [movies]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://raw.githubusercontent.com/stackblitz/webcontainer-core/main/examples/cinema-logo.png' }}
          style={styles.logo}
        />
        <TouchableOpacity>
          <User color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.movieSection}>
          {loading.movies ? (
            <ActivityIndicator size="large" color="#ED188D" />
          ) : error.movies ? (
            <Text style={styles.errorText}>{error.movies}</Text>
          ) : (
            <Animated.ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movieList}
              snapToInterval={CARD_WIDTH + SPACING}
              decelerationRate="fast"
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              bounces={false}
            >
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  index={index}
                  scrollX={scrollX}
                  onPress={handleMoviePress}
                />
              ))}
            </Animated.ScrollView>
          )}
          <TouchableOpacity 
            style={styles.movieListButton}
            onPress={() => router.push('/movies')}
          >
            <Text style={styles.movieListButtonText}>Danh sách phim (Movie List)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Branches</Text>
            <TouchableOpacity onPress={() => router.push('/branch')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading.branches ? (
            <ActivityIndicator size="large" color="#ED188D" />
          ) : error.branches ? (
            <Text style={styles.errorText}>{error.branches}</Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.branchContainer}
            >
              {branches.map((item) => (
                <BranchCard 
                  key={item._id} 
                  item={item}
                  onPress={handleBranchPress}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu food - drink</Text>
            <TouchableOpacity onPress={() => router.push('/menu')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading.menu ? (
            <ActivityIndicator size="large" color="#ED188D" />
          ) : error.menu ? (
            <Text style={styles.errorText}>{error.menu}</Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menuContainer}
            >
              {menuItems.map((item) => (
                <MenuCard 
                  key={item._id} 
                  item={item}
                  onPress={handleImagePress}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <TouchableOpacity onPress={() => router.push('/news')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading.news ? (
            <ActivityIndicator size="large" color="#ED188D" />
          ) : error.news ? (
            <Text style={styles.errorText}>{error.news}</Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.newsContainer}
            >
              {newsItems.map((item) => (
                <NewsCard 
                  key={item._id} 
                  item={item}
                  onPress={handleNewsPress}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <ImageViewer
        isVisible={isImageViewerVisible}
        imageUrl={selectedImage}
        onClose={handleCloseImageViewer}
        sourceLayout={imageLayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  movieSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#FF0099',
    fontSize: 14,
  },
  movieList: {
    paddingHorizontal: CENTER_OFFSET,
    gap: SPACING,
    alignItems: 'center',
    paddingVertical: 20,
  },
  movieCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: '#333333',
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  movieListButton: {
    backgroundColor: '#FF0099',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  movieListButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 16,
  },
  menuCard: {
    width: MENU_CARD_WIDTH,
    height: MENU_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: '#333333',
  },
  menuImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  branchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 16,
  },
  branchCard: {
    width: BRANCH_CARD_WIDTH,
    height: BRANCH_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: '#333333',
  },
  branchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  newsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 16,
  },
  newsCard: {
    width: NEWS_CARD_WIDTH,
    height: NEWS_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: '#333333',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
});