import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { branchService } from '@/services/api';
import type { Branch } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;
const BRANCH_CARD_SIZE = (WINDOW_WIDTH - 48) / 2;

export default function BranchScreen() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchService.getBranches();
      setBranches(response || []);
    } catch (err) {
      setError('Failed to load branches. Please try again later.');
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED188D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBranches}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.branchGrid}>
        {branches.map((branch) => (
          <TouchableOpacity
            key={branch._id}
            style={styles.branchCard}
            onPress={() => router.push(`/branch/${branch._id}`)}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
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