import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Menu, User, Bell, Gift, Ticket, Calendar, Star } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { notificationService } from '@/services/api';
import { getUserData } from '@/utils/storage';
import type { Notification } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;

const NotificationIcons = {
  promo: Gift,
  booking: Ticket,
  event: Calendar,
  reward: Star,
};

const NotificationColors = {
  promo: '#FF6B6B',
  booking: '#4ECDC4',
  event: '#FFD93D',
  reward: '#6C5CE7',
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserData();
      
      if (!userData?.id) {
        setError('Please log in to view notifications');
        return;
      }

      const response = await notificationService.getUserNotifications(userData.id);
      setNotifications(response || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setReadNotifications(prev => [...prev, id]);
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
          <Text style={styles.loadingText}>Loading notifications...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
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
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Bell size={48} color="#666666" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>We'll notify you when something new arrives</Text>
          </View>
        ) : (
          notifications.map((notification, index) => {
            const IconComponent = NotificationIcons[notification.type] || Bell;
            const isRead = readNotifications.includes(notification._id) || notification.isRead;

            return (
              <Animated.View
                key={notification._id}
                entering={FadeInDown.delay(index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.notificationItem,
                    !isRead && styles.notificationUnread
                  ]}
                  onPress={() => markAsRead(notification._id)}
                >
                  <View 
                    style={[
                      styles.iconContainer,
                      { backgroundColor: NotificationColors[notification.type] || '#666666' }
                    ]}
                  >
                    <IconComponent color="#FFFFFF" size={20} />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  {!isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })
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
    gap: 12,
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
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    alignItems: 'center',
  },
  notificationUnread: {
    backgroundColor: '#2A2A2A',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 24,
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  notificationTime: {
    color: '#999999',
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ED188D',
    position: 'absolute',
    top: 16,
    right: 16,
  },
});