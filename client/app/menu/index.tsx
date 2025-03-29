import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { menuService } from '@/services/api';
import type { MenuItem } from '@/services/api/types';
import ImageViewer from '@/components/ImageViewer';

const WINDOW_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = WINDOW_WIDTH - 32;
const ITEM_HEIGHT = ITEM_WIDTH * 0.6;

function MenuItemCard({ item, onPress }) {
  const imageRef = useRef();
  const [layout, setLayout] = useState(null);

  const measureLayout = () => {
    imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return (
    <TouchableOpacity 
      style={styles.menuItem}
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
      <View style={styles.menuContent}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuName}>{item.name}</Text>
          <Text style={styles.menuPrice}>${item.price}</Text>
        </View>
        <Text style={styles.menuDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLayout, setImageLayout] = useState<any>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuService.getMenuItems();
      setMenuItems(response || []); // Ensure we always have an array
    } catch (err) {
      setError('Failed to load menu items. Please try again later.');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = (imageUrl: string, layout: any) => {
    setSelectedImage(imageUrl);
    setImageLayout(layout);
    setIsImageViewerVisible(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerVisible(false);
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchMenuItems}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Menu Items */}
      <ScrollView 
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuListContent}
      >
        {menuItems.map((item) => (
          <MenuItemCard 
            key={item._id}
            item={item}
            onPress={handleImagePress}
          />
        ))}
      </ScrollView>

      {/* Booking Button */}
      <TouchableOpacity 
        style={styles.bookingButton}
        onPress={() => router.push('/booking')}
      >
        <Text style={styles.bookingButtonText}>BOOKING ROOM (ĐẶT PHÒNG)</Text>
      </TouchableOpacity>

      {/* Image Viewer */}
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
  menuList: {
    flex: 1,
  },
  menuListContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  menuItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333333',
  },
  menuImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuContent: {
    padding: 16,
    backgroundColor: '#333333',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  menuPrice: {
    color: '#ED188D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
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