import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import "react-native-reanimated";
import { migrateDatabase } from "./database/database";
import { DataProvider } from "./providers/DataProvider";
import { SelectedPetProvider } from "./providers/SelectedPetProvider";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDark, theme } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <SQLiteProvider 
        databaseName="petara.db" 
        onInit={migrateDatabase}
      >
        <DataProvider>
          <SelectedPetProvider>
            <Stack 
              screenOptions={{
                contentStyle: { backgroundColor: theme.background },
                headerStyle: { backgroundColor: theme.surface },
                headerTintColor: theme.text,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="FormModal"
                options={{ headerShown: false, presentation: "modal" }}
              />
            </Stack>
            <StatusBar style={isDark ? "light" : "dark"} />
          </SelectedPetProvider>
        </DataProvider>
      </SQLiteProvider>
    </SafeAreaView>
  );
}
