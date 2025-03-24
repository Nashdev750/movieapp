import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const WINDOW_WIDTH = Dimensions.get('window').width;

// Extended branch data with additional details
const branchesData = {
  1: {
    _id: 1,
    name: 'Downtown Branch',
    address: 'abc xyz sdf ghi kmn',
    googleMapsUrl: 'https://maps.google.com/?q=Downtown+Branch',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    ],
  },
  2: {
    id: 2,
    name: 'Westside Cinema',
    address: '123 Cinema Street, West District',
    googleMapsUrl: 'https://maps.google.com/?q=Westside+Cinema',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    ],
  },
  // Add more branches with their details...
};

export default function BranchDetailsScreen() {
  const { id } = useLocalSearchParams();
  const branch = branchesData[id as keyof typeof branchesData];

  if (!branch) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Branch not found</Text>
      </View>
    );
  }

  const openGoogleMaps = () => {
    Linking.openURL(branch.googleMapsUrl);
  };

  const handleBooking = () => {
    // Implement booking functionality
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Image */}
      <View style={styles.mainImageContainer}>
        <Image 
          source={{ uri: branch.images[0] }} 
          style={styles.mainImage}
        />
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <Text style={styles.addressLabel}>Specific address:</Text>
        <Text style={styles.addressText}>{branch.address}</Text>
        <TouchableOpacity onPress={openGoogleMaps}>
          <Text style={styles.mapLink}>Link Google Map</Text>
        </TouchableOpacity>
      </View>

      {/* Facility Images */}
      <View style={styles.section}>
        <Text style={styles.facilityImagesLabel}>Specific images of this facility</Text>
        {branch.images.map((image, index) => (
          <View key={index} style={styles.facilityImageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.facilityImage}
            />
          </View>
        ))}
      </View>

      {/* Booking Button */}
      <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
        <Text style={styles.bookingButtonText}>BOOKING ROOM (ĐẶT PHÒNG)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainImageContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * 0.5,
    marginBottom: 24,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  mapLink: {
    color: '#ED188D',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  facilityImagesLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  facilityImageContainer: {
    width: '100%',
    height: WINDOW_WIDTH - 32,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#333333',
  },
  facilityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bookingButton: {
    margin: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ED188D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
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