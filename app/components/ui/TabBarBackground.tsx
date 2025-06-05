import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: theme.surface }
      ]} 
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
