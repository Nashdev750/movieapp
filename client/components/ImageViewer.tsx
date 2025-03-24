import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

type ImageViewerProps = {
  isVisible: boolean;
  imageUrl: string;
  onClose: () => void;
  sourceLayout: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
};

export default function ImageViewer({
  isVisible,
  imageUrl,
  onClose,
  sourceLayout,
}: ImageViewerProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (isVisible) {
      // Animate in from bottom with fade and scale
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    } else {
      // Animate out with fade and scale up
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(1.1, { duration: 200 });
      translateY.value = withTiming(-50, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
    }
  }, [isVisible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const closeButtonStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: opacity.value },
    ],
  }));

  if (!imageUrl) return null;

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill, 
        styles.container,
        containerStyle,
      ]} 
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <StatusBar hidden={isVisible} />
      <View style={[StyleSheet.absoluteFill, styles.backdrop]} />
      
      <Animated.Image
        source={{ uri: imageUrl }}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.closeButton, closeButtonStyle]}>
        <TouchableOpacity 
          onPress={() => runOnJS(onClose)()}
          style={styles.closeButtonInner}
        >
          <X color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  image: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});