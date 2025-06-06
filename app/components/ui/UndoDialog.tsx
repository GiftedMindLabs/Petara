import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UndoDialogProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

const UndoDialog: React.FC<UndoDialogProps> = ({
  message,
  onUndo,
  onDismiss,
  isVisible
}) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (isVisible) {
      // Slide in
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10
      }).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    } else {
      // Slide out
      Animated.spring(translateY, {
        toValue: -100,
        useNativeDriver: true,
        tension: 80,
        friction: 10
      }).start();
    }
  }, [isVisible, onDismiss, translateY]);

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onUndo} style={styles.undoButton}>
            <IconSymbol name="arrow.uturn.backward" size={16} color="#FFFFFF" />
            <Text style={styles.undoText}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <IconSymbol name="xmark" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  content: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: '#FFFFFF',
    flex: 1,
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  undoText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
});

export default UndoDialog; 