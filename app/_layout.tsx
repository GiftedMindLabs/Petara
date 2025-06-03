import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const handleFormSubmit = async (formType: string, formData: any) => {
    // Here you'll implement the logic to handle different form submissions
    switch (formType) {
      case "contact":
        // Handle contact form submission
        break;
      case "pet":
        // Handle pet form submission
        break;
      case "task":
        // Handle task form submission
        break;
      case "treatment":
        // Handle treatment form submission
        break;
      case "vaccination":
        // Handle vaccination form submission
        break;
      case "vetVisit":
        // Handle vet visit form submission
        break;
      default:
        console.warn(`Unhandled form type: ${formType}`);
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}
