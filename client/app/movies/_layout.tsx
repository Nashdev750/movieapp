import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MoviesLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTitleStyle: {
          color: '#FFFFFF',
        },
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <View style={styles.backIconContainer}>
              <ChevronLeft color="#FFFFFF" size={24} />
              <ChevronLeft color="#FFFFFF" size={24} style={styles.secondChevron} />
            </View>
          </TouchableOpacity>
        ),
        title: 'Movie List',
      }}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
  },
  backIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondChevron: {
    marginLeft: -16,
  },
});