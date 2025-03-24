import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Box, Phone, List, Building2, Coffee, Newspaper } from 'lucide-react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props) {
  const menuItems = [
    {
      icon: <Box size={24} color="#FF0099" />,
      label: 'Movie list',
      onPress: () => props.navigation.navigate('movies')
    },
    {
      icon: <Building2 size={24} color="#FF0099" />,
      label: 'Branch system',
      onPress: () => props.navigation.navigate('branch')
    },
    {
      icon: <Coffee size={24} color="#FF0099" />,
      label: 'Menu food - drink',
      onPress: () => props.navigation.navigate('menu')
    },
    {
      icon: <Newspaper size={24} color="#FF0099" />,
      label: 'News',
      onPress: () => props.navigation.navigate('news')
    }
  ];

  const handleCallHotline = () => {
    Linking.openURL('tel:0987767');
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.profileSection}>
        <View style={styles.profileImage} />
        <Text style={styles.phoneNumber}>0878216789 (phone)</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            {item.icon}
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleCallHotline}
        >
          <Phone size={24} color="#FF0099" />
          <Text style={styles.menuItemText}>Hotline: 0987767 (call action)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Drawer
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: '#000000',
              width: '80%',
            },
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen 
            name="(tabs)" 
            options={{
              drawerLabel: 'Home',
              headerShown: false,
            }} 
          />
        </Drawer>
        <StatusBar style="light" />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 48,
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
    marginBottom: 12,
  },
  phoneNumber: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 16,
  },
});