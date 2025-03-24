import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Menu, User } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const discountCodes = [
  {
    id: 1,
    code: 'ABCD',
    discount: '30%',
    message: 'You have a 30% discount code ABCD. Show this code on the app to the cashier.',
  },
  {
    id: 2,
    code: 'ABCD',
    discount: '30%',
    message: 'You have a 30% discount code ABCD. Show this code on the app to the cashier.',
  },
  {
    id: 3,
    code: 'ABCD',
    discount: '30%',
    message: 'You have a 30% discount code ABCD. Show this code on the app to the cashier.',
  },
];

export default function GiftScreen() {
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

      {/* Discount Codes */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {discountCodes.map((discount) => (
          <TouchableOpacity key={discount.id} style={styles.discountItem}>
            <Text style={styles.discountMessage}>{discount.message}</Text>
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
  discountItem: {
    marginBottom: 16,
  },
  discountMessage: {
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