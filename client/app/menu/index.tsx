import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const WINDOW_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = WINDOW_WIDTH - 32;
const ITEM_HEIGHT = ITEM_WIDTH * 0.6;

const menuItems = [
  {
    _id: 1,
    name: 'Gourmet Popcorn Combo',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
    description: 'Sweet & salty popcorn with a drink of your choice',
    category: 'Snacks'
  },
  {
    id: 2,
    name: 'Nachos Supreme',
    price: '$14.99',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80',
    description: 'Loaded nachos with cheese, jalapeños, and guacamole',
    category: 'Snacks'
  },
  {
    id: 3,
    name: 'Movie Snack Bundle',
    price: '$19.99',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
    description: 'Popcorn, candy, and two medium drinks',
    category: 'Combos'
  },
  {
    id: 4,
    name: 'Soft Drinks Variety',
    price: '$4.99',
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80',
    description: 'Choice of Coca-Cola, Sprite, or Fanta',
    category: 'Drinks'
  },
  {
    id: 5,
    name: 'Premium Coffee',
    price: '$5.99',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    description: 'Freshly brewed premium coffee',
    category: 'Drinks'
  }
];

const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'combos', label: 'Combos' },
];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const router = useRouter();

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category.toLowerCase() === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView 
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuListContent}
      >
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <Image 
              source={{ uri: item.image }}
              style={styles.menuImage}
            />
            <View style={styles.menuContent}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
              </View>
              <Text style={styles.menuDescription}>{item.description}</Text>
              <Text style={styles.menuCategory}>{item.category}</Text>
            </View>
          </View>
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
  categoriesContainer: {
    paddingTop: 16,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333333',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#ED188D',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  categoryButtonTextActive: {
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
    position: 'absolute',
  },
  menuContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  menuCategory: {
    color: '#ED188D',
    fontSize: 12,
    fontWeight: '500',
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