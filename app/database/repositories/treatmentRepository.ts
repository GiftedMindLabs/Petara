import { SQLiteDatabase } from 'expo-sqlite';
import { Treatment } from '../types';

type TreatmentRow = {
  id: string;
  petId: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string | null;
  frequency: string;
  dosage: string;
  status: 'ongoing' | 'scheduled' | 'completed';
};

type SQLiteValue = string | number | null;

export class TreatmentRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Create a new treatment
   */
  async createTreatment(treatment: Omit<Treatment, 'id'>): Promise<Treatment> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        treatment.petId,
        treatment.name,
        treatment.type,
        treatment.startDate,
        treatment.endDate ?? null,
        treatment.frequency,
        treatment.dosage,
        treatment.status
      ];

      await this.db.runAsync(
        `INSERT INTO treatments (
          id, petId, name, type, startDate, endDate, frequency, dosage, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      return {
        id,
        ...treatment
      };
    } catch (error) {
      console.error('Error in createTreatment:', error);
      throw error;
    }
  }

  /**
   * Get all treatments for a pet
   */
  async getTreatmentsForPet(petId: string): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      'SELECT * FROM treatments WHERE petId = ? ORDER BY startDate DESC',
      [petId]
    );

    return results.map(this.mapTreatmentRow);
  }

  /**
   * Get treatment by ID
   */
  async getTreatmentById(id: string): Promise<Treatment | null> {
    const result = await this.db.getFirstAsync<TreatmentRow>(
      'SELECT * FROM treatments WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapTreatmentRow(result);
  }

  /**
   * Update a treatment
   */
  async updateTreatment(id: string, updates: Partial<Omit<Treatment, 'id'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values: SQLiteValue[] = fields.map(field => {
      const value = updates[field as keyof typeof updates];
      return value ?? null;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE treatments SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Delete a treatment
   */
  async deleteTreatment(id: string): Promise<boolean> {
    const result = await this.db.runAsync(
      'DELETE FROM treatments WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Get ongoing treatments
   */
  async getOngoingTreatments(): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      "SELECT * FROM treatments WHERE status = 'ongoing' ORDER BY startDate DESC",
      []
    );

    return results.map(this.mapTreatmentRow);
  }

  /**
   * Get scheduled treatments
   */
  async getScheduledTreatments(): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      "SELECT * FROM treatments WHERE status = 'scheduled' ORDER BY startDate ASC",
      []
    );

    return results.map(this.mapTreatmentRow);
  }

  /**
   * Map a database row to a Treatment object
   */
  private mapTreatmentRow(row: TreatmentRow): Treatment {
    return {
      id: row.id,
      petId: row.petId,
      name: row.name,
      type: row.type,
      startDate: row.startDate,
      endDate: row.endDate ?? undefined,
      frequency: row.frequency,
      dosage: row.dosage,
      status: row.status
    };
  }
} 