import { Stack } from "expo-router";
import { openDatabaseAsync, SQLiteProvider } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import "react-native-reanimated";
import { migrateDatabase } from "./database/database";


export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const db = await openDatabaseAsync("petara.db");
      await migrateDatabase(db);
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </SafeAreaView>
    );
  }

  return (
    <SQLiteProvider
      databaseName="petara.db"
      options={{ enableChangeListener: true }}
    >
      <TestStack />
    </SQLiteProvider>
  );
}

const TestStack = () => {
  return (
    <Stack>
      <Stack.Screen name="test" options={{ headerShown: false }} />
    </Stack>
  );
};

const MainStack = () => {
  return (
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
  );
};