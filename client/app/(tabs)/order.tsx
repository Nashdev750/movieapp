import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Menu, User } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const orderHistory = [
  {
    id: 1,
    time: '2024-03-15 14:30',
    message: 'You have booked a room at [time]. We will contact you soon.',
  },
  {
    id: 2,
    time: '2024-03-14 16:45',
    message: 'You have booked a room at [time]. We will contact you soon.',
  },
  {
    id: 3,
    time: '2024-03-13 10:15',
    message: 'You have booked a room at [time]. We will contact you soon.',
  },
];

export default function OrderScreen() {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

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

      {/* Order History */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {orderHistory.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderItem}>
            <Text style={styles.orderMessage}>{order.message}</Text>
            <View style={styles.separator} />
          </TouchableOpacity>
        ))}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  orderItem: {
    marginBottom: 16,
  },
  orderMessage: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginTop: 8,
  },
});