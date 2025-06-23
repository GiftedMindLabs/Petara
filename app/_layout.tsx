import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { useState } from "react";
import "react-native-reanimated";
import { migrateDatabase } from "./database/database";

export default function RootLayout() {
  return (
    <RootLayoutNav />
  );
}

function RootLayoutNav() {
  const [migrationComplete, setMigrationComplete] = useState(false);
  return (
    <>
      <SQLiteProvider
        databaseName="petara.db"
        onInit={async (db) => {
          await migrateDatabase(db);
          setMigrationComplete(true); // only trigger re-render when done
        }}
        options={migrationComplete ? { enableChangeListener: true } : undefined}
      >
        <TestStack />
      </SQLiteProvider>
    </>
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