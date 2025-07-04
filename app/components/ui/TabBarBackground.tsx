import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  
  return (
    <View 
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'transparent' }
      ]} 
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
