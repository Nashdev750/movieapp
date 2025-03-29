import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { branchService } from '@/services/api';
import type { Branch } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default function BranchDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBranchDetails();
  }, [id]);

  const fetchBranchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchService.getBranch(id as string);
      setBranch(response);
    } catch (err) {
      setError('Failed to load branch details. Please try again later.');
      console.error('Error fetching branch details:', err);
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMaps = () => {
    if (branch?.googleMapsUrl) {
      Linking.openURL(branch.googleMapsUrl);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED188D" />
      </View>
    );
  }

  if (error || !branch) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Branch not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBranchDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        {branch.googleMapsUrl && (
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text style={styles.mapLink}>Link Google Map</Text>
          </TouchableOpacity>
        )}
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
      <TouchableOpacity style={styles.bookingButton}>
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
});