import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

type BottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  snapPoints?: string[];
  onChange?: (index: number) => void;
};

export default function BottomSheet({ 
  bottomSheetRef, 
  children, 
  snapPoints = ['60%', '90%'],
  onChange 
}: BottomSheetProps) {
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const customSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const content = (
    <View style={styles.contentContainer}>
      {children}
    </View>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={customSnapPoints}
      onChange={onChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.indicator}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView 
          behavior="padding" 
          style={styles.keyboardView}
          keyboardVerticalOffset={16}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: '#1A1A1A',
  },
  indicator: {
    backgroundColor: '#666666',
    width: 40,
  },
});