import { SQLiteDatabase } from 'expo-sqlite';
import { Pet } from '../types';

type PetRow = {
  id: string;
  name: string;
  imageUrl: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  sex: 'male' | 'female';
  birthDate: number;
  allergies: string;
  weight: number;
  microchipCode: number;
  sterilized: number;
  deceased: number;
};

type SQLiteValue = string | number | null;

export class PetRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Create a new pet
   */
  async createPet(pet: Omit<Pet, 'id'>): Promise<Pet> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        pet.name,
        pet.imageUrl,
        pet.species,
        pet.breed,
        pet.sex,
        pet.birthDate,
        JSON.stringify(pet.allergies),
        pet.weight,
        pet.microchipCode,
        pet.sterilized ? 1 : 0,
        pet.deceased ? 1 : 0
      ];

      await this.db.runAsync(
        `INSERT INTO pets (
          id, name, imageUrl, species, breed, sex, birthDate, 
          allergies, weight, microchipCode, sterilized, deceased
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      return {
        id,
        ...pet
      };
    } catch (error) {
      console.error('Error in createPet:', error);
      throw error;
    }
  }

  /**
   * Get all pets
   */
  async getAllPets(): Promise<Pet[]> {
    const results = await this.db.getAllAsync<PetRow>(
      'SELECT * FROM pets ORDER BY name ASC',
      []
    );

    return results.map(this.mapPetRow);
  }

  /**
   * Get pet by ID
   */
  async getPetById(id: string): Promise<Pet | null> {
    const result = await this.db.getFirstAsync<PetRow>(
      'SELECT * FROM pets WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapPetRow(result);
  }

  /**
   * Update a pet
   */
  async updatePet(id: string, updates: Partial<Omit<Pet, 'id'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map(field => {
      if (field === 'allergies') {
        return `${field} = ?`;
      }
      if (field === 'sterilized' || field === 'deceased') {
        return `${field} = ?`;
      }
      return `${field} = ?`;
    }).join(', ');

    const values: SQLiteValue[] = fields.map(field => {
      const value = updates[field as keyof typeof updates];
      if (field === 'allergies') {
        return JSON.stringify(value);
      }
      if (field === 'sterilized' || field === 'deceased') {
        return value ? 1 : 0;
      }
      return value as SQLiteValue;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE pets SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Delete a pet
   */
  async deletePet(id: string): Promise<boolean> {
    const result = await this.db.runAsync(
      'DELETE FROM pets WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Get living pets
   */
  async getLivingPets(): Promise<Pet[]> {
    const results = await this.db.getAllAsync<PetRow>(
      'SELECT * FROM pets WHERE deceased = 0 ORDER BY name ASC',
      []
    );

    return results.map(this.mapPetRow);
  }

  /**
   * Map a database row to a Pet object
   */
  private mapPetRow(row: PetRow): Pet {
    return {
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl,
      species: row.species,
      breed: row.breed,
      sex: row.sex,
      birthDate: row.birthDate,
      allergies: JSON.parse(row.allergies || '[]'),
      weight: row.weight,
      microchipCode: row.microchipCode,
      sterilized: Boolean(row.sterilized),
      deceased: Boolean(row.deceased)
    };
  }
} 