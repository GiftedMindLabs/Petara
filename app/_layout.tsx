import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import "react-native-reanimated";
import { SelectedPetProvider } from "./providers/SelectedPetProvider";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";

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
      dueDate INTEGER NOT NULL,
      isComplete INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      recurring INTEGER NOT NULL DEFAULT 0,
      recurrencePattern TEXT CHECK(recurrencePattern IN ('daily', 'weekly', 'monthly', 'yearly')),
      recurrenceInterval INTEGER,
      recurrenceWeekDays TEXT,
      recurrenceMonthDay INTEGER CHECK(recurrenceMonthDay BETWEEN 1 AND 31),
      recurrenceEndDate INTEGER,
      recurrenceCount INTEGER,
      lastCompletedDate INTEGER,
      nextDueDate INTEGER,
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
      date INTEGER NOT NULL,
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
      startDate INTEGER NOT NULL,
      endDate INTEGER,
      frequency TEXT NOT NULL,
      dosage TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('ongoing', 'scheduled', 'completed')),
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS vaccinations (
      id TEXT PRIMARY KEY,
      petId TEXT NOT NULL,
      name TEXT NOT NULL,
      dateGiven INTEGER NOT NULL,
      dueDate INTEGER NOT NULL,
      administeredBy TEXT NOT NULL,
      lotNumber TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      petId TEXT NOT NULL,
      date INTEGER NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('veterinary', 'food', 'supplies', 'grooming', 'medications', 'other')),
      description TEXT NOT NULL,
      vendor TEXT NOT NULL,
      reimbursed REAL NOT NULL DEFAULT 0,
      linkedVetVisitId TEXT,
      linkedVaccinationId TEXT,
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
      FOREIGN KEY (linkedVetVisitId) REFERENCES vet_visits (id) ON DELETE SET NULL,
      FOREIGN KEY (linkedVaccinationId) REFERENCES vaccinations (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('veterinarian', 'groomer', 'sitter', 'trainer', 'other')),
      phone TEXT,
      email TEXT,
      address TEXT,
      notes TEXT
    );
  `);
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
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
        options={{
          enableChangeListener: true
        }}
      >
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
      </SQLiteProvider>
    </SafeAreaView>
  );
}
