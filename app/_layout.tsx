import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
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
            <MainStack />
          </SelectedPetProvider>
        </SQLiteProvider>
      </SafeAreaView>
    </Suspense>
  );
}

const TestStack = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
    </Stack>
  );
};

const MainStack = () => {
  return (
    <Stack>
      <Stack.Screen name="test" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="FormModal"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};