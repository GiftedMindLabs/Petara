import React, { useRef, useState } from 'react';
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
  const animation = useRef(new Animated.Value(0)).current;

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
    <View style={styles.container}>
      <View style={styles.backdrop}>
        {items.map((item, index) => {
          const itemAnimation = {
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -60 * (items.length - index)],
                }),
              },
            ],
            opacity: animation,
          };

          return (
            <Animated.View
              key={index}
              style={[styles.itemContainer, itemAnimation]}
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
              <Animated.View 
                style={[
                  styles.labelContainer,
                  {
                    opacity: animation
                  }
                ]}
              >
                <Text style={styles.label}>{item.label}</Text>
              </Animated.View>
            </Animated.View>
          );
        })}
      </View>
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
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 998,
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
    zIndex: 999,
  },
  plus: {
    fontSize: 32,
    color: 'white',
    includeFontPadding: false,
  },
  itemContainer: {
    position: 'absolute',
    right: 4,
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 997,
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
    color: 'white',
  },
  labelContainer: {
    position: 'absolute',
    right: 64,
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    color: 'white',
    fontSize: 14,
  },
});

export default FloatingActionButton; 