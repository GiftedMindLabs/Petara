import { SQLiteDatabase } from 'expo-sqlite';
import { Treatment } from '../types';

type TreatmentRow = {
  id: string;
  petId: string;
  name: string;
  type: string;
  startDate: number;
  endDate: number | null;
  frequency: string;
  dosage: string;
  status: 'ongoing' | 'scheduled' | 'completed';
  vetVisitId: string | null;
};

export class TreatmentRepository {
  private db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  private mapTreatmentRow(row: TreatmentRow): Treatment {
    return {
      id: row.id,
      petId: row.petId,
      name: row.name,
      type: row.type,
      startDate: row.startDate,
      endDate: row.endDate || undefined,
      frequency: row.frequency,
      dosage: row.dosage,
      status: row.status,
      vetVisitId: row.vetVisitId || undefined
    };
  }

  async addTreatment(treatment: Omit<Treatment, 'id'>): Promise<Treatment> {
    const id = Math.random().toString(36).substring(2, 15);
    const treatmentRow: TreatmentRow = {
      id,
      petId: treatment.petId,
      name: treatment.name,
      type: treatment.type,
      startDate: treatment.startDate,
      endDate: treatment.endDate || null,
      frequency: treatment.frequency,
      dosage: treatment.dosage,
      status: treatment.status,
      vetVisitId: treatment.vetVisitId || null
    };

    await this.db.runAsync(
      `INSERT INTO treatments (
        id, petId, name, type, startDate, endDate, frequency, dosage, status, vetVisitId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        treatmentRow.id,
        treatmentRow.petId,
        treatmentRow.name,
        treatmentRow.type,
        treatmentRow.startDate,
        treatmentRow.endDate,
        treatmentRow.frequency,
        treatmentRow.dosage,
        treatmentRow.status,
        treatmentRow.vetVisitId
      ]
    );

    return this.mapTreatmentRow(treatmentRow);
  }

  async updateTreatment(id: string, updates: Partial<Treatment>): Promise<Treatment> {
    const currentTreatment = await this.getTreatmentById(id);
    if (!currentTreatment) {
      throw new Error(`Treatment with id ${id} not found`);
    }

    const updatedTreatment: Treatment = {
      ...currentTreatment,
      ...updates
    };

    const treatmentRow: TreatmentRow = {
      id,
      petId: updatedTreatment.petId,
      name: updatedTreatment.name,
      type: updatedTreatment.type,
      startDate: updatedTreatment.startDate,
      endDate: updatedTreatment.endDate || null,
      frequency: updatedTreatment.frequency,
      dosage: updatedTreatment.dosage,
      status: updatedTreatment.status,
      vetVisitId: updatedTreatment.vetVisitId || null
    };

    await this.db.runAsync(
      `UPDATE treatments SET
        petId = ?,
        name = ?,
        type = ?,
        startDate = ?,
        endDate = ?,
        frequency = ?,
        dosage = ?,
        status = ?,
        vetVisitId = ?
      WHERE id = ?`,
      [
        treatmentRow.petId,
        treatmentRow.name,
        treatmentRow.type,
        treatmentRow.startDate,
        treatmentRow.endDate,
        treatmentRow.frequency,
        treatmentRow.dosage,
        treatmentRow.status,
        treatmentRow.vetVisitId,
        id
      ]
    );

    return this.mapTreatmentRow(treatmentRow);
  }

  async deleteTreatment(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM treatments WHERE id = ?', [id]);
  }

  async getTreatmentById(id: string): Promise<Treatment | null> {
    const result = await this.db.getFirstAsync<TreatmentRow>(
      'SELECT * FROM treatments WHERE id = ?',
      [id]
    );

    if (!result) {
      return null;
    }

    return this.mapTreatmentRow(result);
  }

  async getTreatmentsByPetId(petId: string): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      'SELECT * FROM treatments WHERE petId = ? ORDER BY startDate DESC',
      [petId]
    );

    return results.map(this.mapTreatmentRow);
  }

  async getAllTreatments(): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      'SELECT * FROM treatments ORDER BY startDate DESC'
    );

    return results.map(this.mapTreatmentRow);
  }

  async getOngoingTreatments(): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      "SELECT * FROM treatments WHERE status = 'ongoing' ORDER BY startDate DESC"
    );

    return results.map(this.mapTreatmentRow);
  }

  async getScheduledTreatments(): Promise<Treatment[]> {
    const results = await this.db.getAllAsync<TreatmentRow>(
      "SELECT * FROM treatments WHERE status = 'scheduled' ORDER BY startDate ASC"
    );

    return results.map(this.mapTreatmentRow);
  }
}