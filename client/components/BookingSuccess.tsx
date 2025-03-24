import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

type BookingSuccessProps = {
  bookingDetails: {
    branch: string;
    date: string;
    time: string;
    name: string;
    phone: string;
  };
  onClose: () => void;
};

const Confetti = ({ delay }: { delay: number }) => {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // More explosive vertical movement
    y.value = withDelay(
      delay,
      withSequence(
        withSpring(-300, { damping: 8, stiffness: 100 }), // Higher initial burst
        withSpring(-150, { damping: 10 }) // Settle higher
      )
    );

    // Wider horizontal spread
    x.value = withDelay(
      delay,
      withSequence(
        withSpring(Math.random() * 300 - 150, { damping: 8 }), // Wider spread
        withSpring(Math.random() * 300 - 150, { damping: 10 })
      )
    );

    // Faster rotation
    rotate.value = withDelay(
      delay,
      withSequence(
        withTiming(360 * 4, { duration: 1000, easing: Easing.linear }), // Faster initial spin
        withTiming(360 * 6, { duration: 1500, easing: Easing.linear }) // Continue spinning
      )
    );

    // Add scale animation for more dynamic effect
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.5, { damping: 5 }),
        withSpring(1, { damping: 8 })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { translateX: x.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[{
        width: Math.random() * 6 + 6, // Varied sizes
        height: Math.random() * 6 + 6,
        backgroundColor: ['#FF0099', '#00FF99', '#0099FF', '#9900FF', '#FFFF00', '#FF00FF'][Math.floor(Math.random() * 6)],
        position: 'absolute',
        borderRadius: 4,
      }, style]}
    />
  );
};

export default function BookingSuccess({ bookingDetails, onClose }: BookingSuccessProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* More confetti particles for a denser effect */}
        {Array(30).fill(0).map((_, i) => (
          <Confetti key={i} delay={i * 50} /> // Faster sequence
        ))}

        <Animated.View style={[styles.content, containerStyle]}>
          <View style={styles.checkCircle}>
            <Check size={32} color="#FFFFFF" />
          </View>
          
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your room has been successfully booked</Text>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Branch</Text>
              <Text style={styles.detailValue}>{bookingDetails.branch}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{bookingDetails.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{bookingDetails.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{bookingDetails.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{bookingDetails.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden', // Contain confetti
    backgroundColor: '#000000',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00CC66',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 32,
    textAlign: 'center',
  },
  details: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  detailLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF0099',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});