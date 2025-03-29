import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Menu, User, Calendar, Clock, MapPin } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { bookingService } from '@/services/api';
import { getUserData } from '@/utils/storage';
import type { Booking } from '@/services/api/types';
import { format } from 'date-fns';

const BookingStatusMap = {
  0: { label: 'Pending', color: '#FFB800' },
  1: { label: 'Confirmed', color: '#00CC66' },
  2: { label: 'Completed', color: '#666666' },
  3: { label: 'Cancelled', color: '#FF4444' },
};

export default function OrderScreen() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserData();
      
      if (!userData?.id) {
        setError('No user data found. Please make a booking first.');
        return;
      }

      const response = await bookingService.getUserBookings(userData.id);
      setBookings(response || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (err) {
      return dateString;
    }
  };

  if (loading) {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ED188D" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchUserBookings}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings found</Text>
          <Text style={styles.emptySubtext}>Your booking history will appear here</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {bookings.map((booking) => (
            <View key={booking._id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.branchName}>{booking.branchName}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: BookingStatusMap[booking.status]?.color || '#666666' }
                ]}>
                  <Text style={styles.statusText}>
                    {BookingStatusMap[booking.status]?.label || 'Unknown'}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#ED188D" />
                  <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#ED188D" />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#ED188D" />
                  <Text style={styles.detailText}>{booking.branchName}</Text>
                </View>
              </View>

              {booking.status === 0 && (
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  branchName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#331111',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
});