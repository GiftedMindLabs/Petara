import { SQLiteDatabase } from 'expo-sqlite';
import { Vaccination } from '../types';

type VaccinationRow = {
  id: string;
  petId: string;
  name: string;
  startDate: number;
  endDate: number | null;
  lotNumber: string;
  manufacturer: string;
  vetVisitId: string | null;
};

type SQLiteValue = string | number | null;

export class VaccinationRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Create a new vaccination
   */
  async createVaccination(vaccination: Omit<Vaccination, 'id'>): Promise<Vaccination> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        vaccination.petId,
        vaccination.name,
        vaccination.startDate,
        vaccination.endDate || null,
        vaccination.lotNumber,
        vaccination.manufacturer,
        vaccination.vetVisitId || null
      ];

      await this.db.runAsync(
        `INSERT INTO vaccinations (
          id, petId, name, startDate, endDate, lotNumber, manufacturer, vetVisitId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      return {
        id,
        ...vaccination
      };
    } catch (error) {
      console.error('Error in createVaccination:', error);
      throw error;
    }
  }

  /**
   * Get all vaccinations for a pet
   */
  async getVaccinationsForPet(petId: string): Promise<Vaccination[]> {
    const results = await this.db.getAllAsync<VaccinationRow>(
      'SELECT * FROM vaccinations WHERE petId = ? ORDER BY startDate DESC',
      [petId]
    );

    return results.map(this.mapVaccinationRow);
  }

  /**
   * Get vaccination by ID
   */
  async getVaccinationById(id: string): Promise<Vaccination | null> {
    const result = await this.db.getFirstAsync<VaccinationRow>(
      'SELECT * FROM vaccinations WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapVaccinationRow(result);
  }

  /**
   * Update a vaccination
   */
  async updateVaccination(id: string, updates: Partial<Omit<Vaccination, 'id'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values: SQLiteValue[] = fields.map(field => {
      const value = updates[field as keyof typeof updates];
      return value ?? null;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE vaccinations SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Delete a vaccination
   */
  async deleteVaccination(id: string): Promise<boolean> {
    const result = await this.db.runAsync(
      'DELETE FROM vaccinations WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  async getAllVaccinations(): Promise<Vaccination[]> {
    const results = await this.db.getAllAsync<VaccinationRow>(
      'SELECT * FROM vaccinations ORDER BY startDate DESC'
    );
    return results.map(this.mapVaccinationRow);
  }

  /**
   * Get upcoming vaccinations
   */
  async getUpcomingVaccinations(): Promise<Vaccination[]> {
    const today = new Date().toISOString().split('T')[0];
    const results = await this.db.getAllAsync<VaccinationRow>(
      "SELECT * FROM vaccinations WHERE endDate >= ? ORDER BY endDate ASC",
      [today]
    );

    return results.map(this.mapVaccinationRow);
  }

  /**
   * Get expired vaccinations
   */
  async getExpiredVaccinations(): Promise<Vaccination[]> {
    const today = new Date().toISOString().split('T')[0];
    const results = await this.db.getAllAsync<VaccinationRow>(
      "SELECT * FROM vaccinations WHERE endDate < ? ORDER BY endDate DESC",
      [today]
    );

    return results.map(this.mapVaccinationRow);
  }

  /**
   * Map a database row to a Vaccination object
   */
  private mapVaccinationRow(row: VaccinationRow): Vaccination {
    return {
      id: row.id,
      petId: row.petId,
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate || undefined,
      lotNumber: row.lotNumber,
      manufacturer: row.manufacturer,
      vetVisitId: row.vetVisitId || undefined
    };
  }
} 