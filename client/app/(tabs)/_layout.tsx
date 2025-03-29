import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Chrome as Home, Ticket, Gift, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

function TabBarIcon({ Icon, focused }: { Icon: any; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <Icon 
        size={24} 
        color={focused ? '#ED188D' : '#666666'} 
        strokeWidth={focused ? 2.5 : 1.5}
      />
    </View>
  );
}

function BookingButton() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.bookingButtonContainer}
      onPress={() => router.push('/booking')}
    >
      <View style={styles.bookingButton}>
        <Text style={styles.bookingButtonText}>ĐẶT{'\n'}PHÒNG</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#ED188D',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Order',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Ticket} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: '',
          tabBarButton: () => <BookingButton />,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'Quà tặng',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Gift} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notification',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Bell} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 13,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 0,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingButtonContainer: {
    position: 'absolute',
    top: 5,
    alignSelf: 'center',
    width: 70,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingButton: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#ED188D',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#ED188D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 14,
  },
});