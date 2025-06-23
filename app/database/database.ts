import { SQLiteDatabase } from "expo-sqlite";
// Migration function to set up the database schema
export const migrateDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    console.log("Migrate database function called")
    // Enable foreign keys
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Create version table with a fixed ID to ensure a single row
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS db_version (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        version INTEGER NOT NULL
      );
    `);

    // Read current version or default to 0
    const versionResult = await db.getFirstAsync<{ version: number }>(
      "SELECT version FROM db_version WHERE id = 1"
    );
    const currentVersion = versionResult?.version ?? 0;

    // Run migrations for version 1
    if (currentVersion < 1) {
      console.log("Creating initial tables and migrating to version 1...");
      await db.execAsync("BEGIN TRANSACTION;");
      try {
        // Step 1: Create independent tables first
        await db.execAsync(`
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

        await db.execAsync(`
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
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS vet_visits (
            id TEXT PRIMARY KEY,
            petId TEXT NOT NULL,
            date INTEGER NOT NULL,
            reason TEXT NOT NULL,
            notes TEXT,
            weight REAL,
            notificationIdentifier TEXT UNIQUE,
            contactId TEXT,
            FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
            FOREIGN KEY (contactId) REFERENCES contacts (id) ON DELETE SET NULL
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS vaccinations (
            id TEXT PRIMARY KEY,
            petId TEXT NOT NULL,
            name TEXT NOT NULL,
            startDate INTEGER NOT NULL,
            endDate INTEGER,
            lotNumber TEXT NOT NULL,
            manufacturer TEXT NOT NULL,
            vetVisitId TEXT,
            FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
            FOREIGN KEY (vetVisitId) REFERENCES vet_visits (id) ON DELETE SET NULL
          );
        `);

        await db.execAsync(`
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
            notes TEXT,
            vetVisitId TEXT,
            FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
            FOREIGN KEY (vetVisitId) REFERENCES vet_visits (id) ON DELETE SET NULL
          );
        `);

        // Step 2: Create dependent tables
        await db.execAsync(`
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
            notificationIdentifier TEXT UNIQUE,
            FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
            FOREIGN KEY (linkedTreatmentId) REFERENCES treatments (id) ON DELETE SET NULL,
            FOREIGN KEY (linkedVaccinationId) REFERENCES vaccinations (id) ON DELETE SET NULL,
            FOREIGN KEY (linkedVetVisitId) REFERENCES vet_visits (id) ON DELETE SET NULL
          );
        `);

        await db.execAsync(`
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
        `);

        // Update schema version
        await db.execAsync(`
          INSERT OR REPLACE INTO db_version (id, version) VALUES (1, 1);
        `);

        await db.execAsync("COMMIT;");
      } catch (error) {
        await db.execAsync("ROLLBACK;");
        throw error;
      }
    }

    // Future migrations here...
    // if (currentVersion < 2) { ... }

  } catch (error) {
    console.error("Database migration failed:", error);
    throw error;
  }
};