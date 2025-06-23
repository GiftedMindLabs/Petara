import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
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
  return (
    <Suspense fallback={<ActivityIndicator size="large" color="#0D9488" />}>
      <SafeAreaView style={{ flex: 1 }}>
        <SQLiteProvider
          databaseName="petara.db"
          onInit={migrateDatabase}
          options={{ enableChangeListener: true }}
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Test Stack</Text>
    </View>
  );
}

const MainStack = () => {

  return (
    <Stack >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="FormModal"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
