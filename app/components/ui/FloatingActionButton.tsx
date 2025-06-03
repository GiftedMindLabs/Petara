import React, { useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface ActionItem {
  icon: string;
  label: string;
  onPress: () => void;
}

interface FloatingActionButtonProps {
  items: ActionItem[];
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = new Animated.Value(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {isOpen && (
        <View style={styles.backdrop} pointerEvents="box-none">
          {items.map((item, index) => {
            const itemAnimation = {
              transform: [
                { scale: animation },
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60 * (items.length - index)],
                  }),
                },
              ],
              opacity: animation,
            };

            return (
              <Animated.View
                key={index}
                style={[styles.itemContainer, itemAnimation]}
                pointerEvents="box-none"
              >
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    item.onPress();
                    toggleMenu();
                  }}
                >
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                </TouchableOpacity>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.Text style={[styles.plus, rotation]}>+</Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  fab: {
    backgroundColor: '#0D9488',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plus: {
    fontSize: 32,
    color: 'white',
    includeFontPadding: false,
  },
  itemContainer: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: '#0D9488',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemIcon: {
    fontSize: 24,
  },
  labelContainer: {
    position: 'absolute',
    right: 64,
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  label: {
    color: 'white',
    fontSize: 14,
  },
});

export default FloatingActionButton; 