import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import FloatingActionButton from "./components/ui/FloatingActionButton";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
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
          <Stack.Screen
            name="[...FormModal]"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: "box-none",
            marginBottom: Platform.select({ ios: 90, android: 70 }),
          }}
        >
          <FloatingActionButton
            items={[
              {
                icon: "✓",
                label: "Add Task",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "task",
                    },
                  }),
              },
              {
                icon: "🐾",
                label: "Add Pet",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "pet",
                    },
                  }),
              },
              {
                icon: "👤",
                label: "Add Contact",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "contact",
                    },
                  }),
              },
              {
                icon: "🏥",
                label: "Add Vet Visit",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "vetVisit",
                    },
                  }),
              },
              {
                icon: "💉",
                label: "Add Vaccination",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "vaccination",
                    },
                  }),
              },
              {
                icon: "💊",
                label: "Add Treatment",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "treatment",
                    },
                  }),
              },
              {
                icon: "💰",
                label: "Add Expense",
                onPress: () =>
                  router.push({
                    pathname: "/FormModal",
                    params: {
                      title: "Add",
                      action: "create",
                      form: "expense",
                    },
                  }),
              },
            ]}
          />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}
