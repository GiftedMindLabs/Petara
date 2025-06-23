import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense, useState } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import "react-native-reanimated";
import { migrateDatabase } from "./database/database";
import { SelectedPetProvider } from "./providers/SelectedPetProvider";

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
      <RootLayoutNav />
  );
}

function RootLayoutNav() {
  const [migrationComplete, setMigrationComplete] = useState(false);
  return (
    <Suspense fallback={<ActivityIndicator size="large" color="#0D9488" />}>
    <SafeAreaView style={{ flex: 1 }}>
    <SQLiteProvider
          databaseName="petara.db"
          onInit={async (db) => {
            await migrateDatabase(db);
            setMigrationComplete(true); // only trigger re-render when done
          }}
          options={migrationComplete ? { enableChangeListener: true } : undefined}
        >
          <SelectedPetProvider>
            <Stack 
              screenOptions={{
                contentStyle: { backgroundColor: "#0D9488" },
                headerStyle: { backgroundColor: "#0D9488" },
                headerTintColor: "#0D9488",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="FormModal"
                options={{ headerShown: false, presentation: "modal" }}
              />
            </Stack>
            <StatusBar style="light" />
          </SelectedPetProvider>
      </SQLiteProvider>
      </SafeAreaView>
    </Suspense>
  );
}
