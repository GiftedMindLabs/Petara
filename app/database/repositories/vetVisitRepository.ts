import { SQLiteDatabase } from 'expo-sqlite';
import { VetVisit } from '../types';

type VetVisitRow = {
  id: string;
  petId: string;
  date: number;
  reason: string;
  notes: string | null;
  weight: number | null;
  notificationIdentifier: string | null;
  contactId: string | null;
};

type SQLiteValue = string | number | null;

export class VetVisitRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Create a new vet visit
   */
  async createVetVisit(visit: Omit<VetVisit, 'id'>): Promise<VetVisit> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        visit.petId,
        visit.date,
        visit.reason,
        visit.notes ?? null,
        visit.weight ?? null,
        visit.contactId ?? null
      ];

      await this.db.runAsync(
        `INSERT INTO vet_visits (id, petId, date, reason, notes, weight, contactId)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      return {
        id,
        ...visit
      };
    } catch (error) {
      console.error('Error in createVetVisit:', error);
      throw error;
    }
  }

  async getAllVetVisits(): Promise<VetVisit[]> {
    const results = await this.db.getAllAsync<VetVisitRow>(
      'SELECT * FROM vet_visits ORDER BY date DESC'
    );
    return results.map(this.mapVetVisitRow);
  }

  /**
   * Get all vet visits for a pet
   */
  async getVetVisitsForPet(petId: string): Promise<VetVisit[]> {
    const results = await this.db.getAllAsync<VetVisitRow>(
      'SELECT * FROM vet_visits WHERE petId = ? ORDER BY date DESC',
      [petId]
    );

    return results.map(this.mapVetVisitRow);
  }

  /**
   * Get vet visit by ID
   */
  async getVetVisitById(id: string): Promise<VetVisit | null> {
    const result = await this.db.getFirstAsync<VetVisitRow>(
      'SELECT * FROM vet_visits WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapVetVisitRow(result);
  }

  /**
   * Update a vet visit
   */
  async updateVetVisit(id: string, updates: Partial<Omit<VetVisit, 'id'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values: SQLiteValue[] = fields.map(field => {
      const value = updates[field as keyof typeof updates];
      return value ?? null;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE vet_visits SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Delete a vet visit
   */
  async deleteVetVisit(id: string): Promise<boolean> {
    const result = await this.db.runAsync(
      'DELETE FROM vet_visits WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Get upcoming vet visits
   */
  async getUpcomingVetVisits(): Promise<VetVisit[]> {
    const today = new Date().getTime();
    const results = await this.db.getAllAsync<VetVisitRow>(
      "SELECT * FROM vet_visits WHERE date >= ? ORDER BY date ASC",
      [today]
    );

    return results.map(this.mapVetVisitRow);
  }

  /**
   * Map a database row to a VetVisit object
   */
  private mapVetVisitRow(row: VetVisitRow): VetVisit {
    return {
      id: row.id,
      petId: row.petId,
      date: row.date,
      reason: row.reason,
      notes: row.notes ?? '',
      weight: row.weight ?? undefined,
      notificationIdentifier: row.notificationIdentifier ?? undefined,
      contactId: row.contactId ?? undefined
    };
  }
}