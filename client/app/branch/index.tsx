import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const WINDOW_WIDTH = Dimensions.get('window').width;
const BRANCH_CARD_SIZE = (WINDOW_WIDTH - 48) / 2;

const branches = [
  {
    id: 1,
    name: 'Downtown Branch',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
  {
    id: 2,
    name: 'Westside Cinema',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  },
  {
    id: 3,
    name: 'Central Movies',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
  {
    id: 4,
    name: 'Harbor Theater',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  },
  {
    id: 5,
    name: 'Eastside Cinema',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
  {
    id: 6,
    name: 'Riverside Movies',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  },
];

export default function BranchScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.branchGrid}>
        {branches.map((branch) => (
          <TouchableOpacity
            key={branch.id}
            style={styles.branchCard}
            onPress={() => router.push(`/branch/${branch.id}`)}
          >
            <View style={styles.branchImageContainer}>
              <View style={styles.branchImage} />
            </View>
            <Text style={styles.branchName}>{branch.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  branchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  branchCard: {
    width: BRANCH_CARD_SIZE,
  },
  branchImageContainer: {
    width: '100%',
    height: BRANCH_CARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#333333',
  },
  branchImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  branchName: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'left',
  },
});