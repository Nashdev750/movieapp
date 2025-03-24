import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Menu, User } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Animated, { 
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import ImageViewer from '@/components/ImageViewer';

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

const movies = [
  {
    id: 1,
    title: 'Inception',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80'
  },
  {
    id: 2,
    title: 'The Dark Knight',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80'
  },
  {
    id: 3,
    title: 'Interstellar',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80'
  },
  {
    id: 5,
    title: 'The Matrix',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80'
  }
];

const menuItems = [
  {
    id: 1,
    name: 'Gourmet Popcorn Combo',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
  },
  {
    id: 2,
    name: 'Nachos Supreme',
    price: '$14.99',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80',
  },
  {
    id: 3,
    name: 'Movie Snack Bundle',
    price: '$19.99',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
  }
];

const branchItems = [
  {
    id: 1,
    name: 'Downtown Branch',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
  {
    id: 2,
    name: 'Westside Cinema',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  },
  {
    id: 3,
    name: 'Central Movies',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
  {
    id: 4,
    name: 'Harbor Theater',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  }
];

const newsItems = [
  {
    id: 1,
    title: 'New IMAX Theater Opening Soon',
    description: 'Experience movies like never before in our state-of-the-art IMAX theater.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    date: 'March 20, 2024'
  },
  {
    id: 2,
    title: 'Special Movie Marathon Weekend',
    description: 'Join us for an epic movie marathon featuring classic blockbusters.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    date: 'March 25, 2024'
  },
  {
    id: 3,
    title: 'Exclusive Preview Screenings',
    description: 'Be among the first to watch upcoming releases before they hit theaters.',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
    date: 'March 30, 2024'
  }
];

function MovieCard({ movie, index, scrollX }) {
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
    <Animated.View style={[styles.movieCard, animatedStyle]}>
      <Image source={{ uri: movie.image }} style={styles.movieImage} />
    </Animated.View>
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
  const imageRef = useRef();
  const [layout, setLayout] = useState(null);

  const measureLayout = () => {
    imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return (
    <TouchableOpacity 
      style={styles.branchCard}
      onPress={() => {
        measureLayout();
        onPress(item.image, layout);
      }}
    >
      <Image 
        ref={imageRef}
        source={{ uri: item.image }} 
        style={styles.branchImage}
        onLayout={measureLayout}
      />
    </TouchableOpacity>
  );
}

function NewsCard({ item, onPress }) {
  const imageRef = useRef();
  const [layout, setLayout] = useState(null);

  const measureLayout = () => {
    imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => {
        measureLayout();
        onPress(item.image, layout);
      }}
    >
      <Image 
        ref={imageRef}
        source={{ uri: item.image }} 
        style={styles.newsImage}
        onLayout={measureLayout}
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLayout, setImageLayout] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

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

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: CARD_WIDTH + SPACING,
        animated: false,
      });
    }, 100);
  }, []);

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
                key={movie.id}
                movie={movie}
                index={index}
                scrollX={scrollX}
              />
            ))}
          </Animated.ScrollView>
          <TouchableOpacity style={styles.movieListButton}>
            <Text style={styles.movieListButtonText}>Danh sách phim (Movie List)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu food - drink</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuContainer}
          >
            {menuItems.map((item) => (
              <MenuCard 
                key={item.id} 
                item={item}
                onPress={handleImagePress}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Branches</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.branchContainer}
          >
            {branchItems.map((item) => (
              <BranchCard 
                key={item.id} 
                item={item}
                onPress={handleImagePress}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newsContainer}
          >
            {newsItems.map((item) => (
              <NewsCard 
                key={item.id} 
                item={item}
                onPress={handleImagePress}
              />
            ))}
          </ScrollView>
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
  }
});