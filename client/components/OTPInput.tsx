import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  Keyboard,
} from 'react-native';

type OTPInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export default function OTPInput({
  length = 6,
  value,
  onChange,
  error = false,
}: OTPInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const digits = value.split('');

  useEffect(() => {
    // Auto focus on mount for web
    if (Platform.OS === 'web') {
      inputRef.current?.focus();
    }
  }, []);

  const handlePress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const handleChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    // Limit to specified length
    const limited = cleaned.slice(0, length);
    onChange(limited);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.digits}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <Pressable
              key={index}
              onPress={handlePress}
              style={[
                styles.digit,
                isFocused && index === digits.length && styles.digitFocused,
                error && styles.digitError,
              ]}
            >
              <Text style={styles.digitText}>{digits[index] || ''}</Text>
            </Pressable>
          ))}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        maxLength={length}
        keyboardType="number-pad"
        style={styles.hiddenInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        caretHidden={true}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: 1,
  },
  digits: {
    flexDirection: 'row',
    gap: 8,
  },
  digit: {
    width: 44,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  digitFocused: {
    borderColor: '#FF0099',
  },
  digitError: {
    borderColor: '#FF4444',
    backgroundColor: '#331111',
  },
  digitText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});