import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Menu, User, Gift, Ticket } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { giftService } from '@/services/api';
import { getUserData } from '@/utils/storage';
import type { Gift as GiftType } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default function GiftScreen() {
  const navigation = useNavigation();
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserData();
      
      if (!userData?.id) {
        setError('Please log in to view your gifts');
        return;
      }

      const response = await giftService.getUserGifts(userData.id);
      setGifts(response || []);
    } catch (err) {
      console.error('Error fetching gifts:', err);
      setError('Failed to load gifts. Please try again.');
    } finally {
      setLoading(false);
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
          <Text style={styles.loadingText}>Loading gifts...</Text>
        </View>
      </View>
    );
  }

  if (error) {
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGifts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {gifts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Gift size={48} color="#666666" />
            <Text style={styles.emptyText}>No gifts available</Text>
            <Text style={styles.emptySubtext}>Make a booking to earn rewards!</Text>
          </View>
        ) : (
          gifts.map((gift, index) => (
            <Animated.View
              key={gift._id}
              entering={FadeInDown.delay(index * 100)}
            >
              <View style={styles.giftCard}>
                <View style={styles.giftHeader}>
                  <Gift color="#ED188D" size={24} />
                  <View style={styles.giftDiscount}>
                    <Text style={styles.discountText}>{gift.discount}% OFF</Text>
                  </View>
                </View>

                <View style={styles.giftContent}>
                  <Text style={styles.giftType}>{gift.type}</Text>
                  <Text style={styles.giftDescription}>{gift.description}</Text>
                  
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Code:</Text>
                    <Text style={styles.codeValue}>{gift.code}</Text>
                  </View>

                  <View style={styles.giftFooter}>
                    <Text style={styles.expiryText}>
                      Expires: {new Date(gift.expiresAt).toLocaleDateString()}
                    </Text>
                    {gift.isUsed && (
                      <View style={styles.usedBadge}>
                        <Text style={styles.usedText}>USED</Text>
                      </View>
                    )}
                  </View>
                </View>

                {!gift.isUsed && (
                  <TouchableOpacity style={styles.useButton}>
                    <Text style={styles.useButtonText}>Use Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
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
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  giftCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  giftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  giftDiscount: {
    backgroundColor: '#ED188D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  giftContent: {
    gap: 8,
  },
  giftType: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  giftDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  codeLabel: {
    color: '#666666',
    fontSize: 14,
  },
  codeValue: {
    color: '#ED188D',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  giftFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  expiryText: {
    color: '#666666',
    fontSize: 12,
  },
  usedBadge: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  usedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  useButton: {
    backgroundColor: '#ED188D',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  useButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});