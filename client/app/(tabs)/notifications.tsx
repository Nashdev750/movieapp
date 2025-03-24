import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Menu, User, Bell, Gift, Ticket, Calendar, Star } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const WINDOW_WIDTH = Dimensions.get('window').width;

const notifications = [
  {
    id: 1,
    type: 'promo',
    title: 'Special Weekend Offer!',
    message: 'Get 20% off on all movie tickets this weekend.',
    time: '2 hours ago',
    icon: Gift,
    color: '#FF6B6B',
    isNew: true,
  },
  {
    id: 2,
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking for "Inception" has been confirmed for tomorrow at 7:30 PM.',
    time: '5 hours ago',
    icon: Ticket,
    color: '#4ECDC4',
    isNew: true,
  },
  {
    id: 3,
    type: 'event',
    title: 'Upcoming Movie Premiere',
    message: 'Don\'t miss the exclusive premiere of "The Dark Knight" next week.',
    time: '1 day ago',
    icon: Calendar,
    color: '#FFD93D',
  },
  {
    id: 4,
    type: 'reward',
    title: 'You\'ve Earned Points!',
    message: 'Earned 500 points from your last visit. Check your rewards now!',
    time: '2 days ago',
    icon: Star,
    color: '#6C5CE7',
  },
  {
    id: 5,
    type: 'promo',
    title: 'Member Exclusive Deal',
    message: 'Members get free popcorn upgrade this month.',
    time: '3 days ago',
    icon: Gift,
    color: '#FF6B6B',
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [readNotifications, setReadNotifications] = React.useState<number[]>([]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const markAsRead = (id: number) => {
    setReadNotifications(prev => [...prev, id]);
  };

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id) && n.isNew).length;

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

      {/* Notifications */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification, index) => {
          const IconComponent = notification.icon;
          const isRead = readNotifications.includes(notification.id);

          return (
            <Animated.View
              key={notification.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity
                style={[
                  styles.notificationItem,
                  !isRead && notification.isNew && styles.notificationUnread
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: notification.color }]}>
                  <IconComponent color="#FFFFFF" size={20} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                {!isRead && notification.isNew && (
                  <View style={styles.unreadDot} />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
  headerCenter: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ED188D',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
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
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});