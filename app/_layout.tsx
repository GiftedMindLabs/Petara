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
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import FloatingActionButton from "./components/ui/FloatingActionButton";
import { SelectedPetProvider } from "./providers/SelectedPetProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Migration function to set up the database schema
  const migrateDatabase = async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS pets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        imageUrl TEXT,
        species TEXT NOT NULL CHECK(species IN ('dog', 'cat', 'bird', 'other')),
        breed TEXT NOT NULL,
        sex TEXT NOT NULL CHECK(sex IN ('male', 'female')),
        birthDate INTEGER NOT NULL,
        allergies TEXT,
        weight REAL NOT NULL,
        microchipCode INTEGER,
        sterilized INTEGER NOT NULL DEFAULT 0,
        deceased INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        petId TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('feeding', 'medication', 'walk', 'grooming', 'other')),
        dueDate TEXT NOT NULL,
        isComplete INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        recurring INTEGER NOT NULL DEFAULT 0,
        recurrencePattern TEXT CHECK(recurrencePattern IN ('daily', 'weekly', 'monthly', 'yearly')),
        recurrenceInterval INTEGER,
        recurrenceWeekDays TEXT,
        recurrenceMonthDay INTEGER CHECK(recurrenceMonthDay BETWEEN 1 AND 31),
        recurrenceEndDate TEXT,
        recurrenceCount INTEGER,
        lastCompletedDate TEXT,
        nextDueDate TEXT,
        linkedTreatmentId TEXT,
        linkedVaccinationId TEXT,
        linkedVetVisitId TEXT,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
        FOREIGN KEY (linkedTreatmentId) REFERENCES treatments (id) ON DELETE SET NULL,
        FOREIGN KEY (linkedVaccinationId) REFERENCES vaccinations (id) ON DELETE SET NULL,
        FOREIGN KEY (linkedVetVisitId) REFERENCES vet_visits (id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS vet_visits (
        id TEXT PRIMARY KEY,
        petId TEXT NOT NULL,
        date TEXT NOT NULL,
        reason TEXT NOT NULL,
        notes TEXT,
        vetName TEXT NOT NULL,
        weight REAL,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS treatments (
        id TEXT PRIMARY KEY,
        petId TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        frequency TEXT NOT NULL,
        dosage TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('ongoing', 'scheduled', 'completed')),
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS vaccinations (
        id TEXT PRIMARY KEY,
        petId TEXT NOT NULL,
        name TEXT NOT NULL,
        dateGiven TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        administeredBy TEXT NOT NULL,
        lotNumber TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
      );
    `);
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <SQLiteProvider databaseName="petara.db" onInit={migrateDatabase}>
          <SelectedPetProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="FormModal"
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
          </SelectedPetProvider>
        </SQLiteProvider>
      </SafeAreaView>
    </ThemeProvider>
  );
}
