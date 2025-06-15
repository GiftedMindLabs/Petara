import * as Notifications from 'expo-notifications';
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

  async scheduleVetVisitNotification(visit: VetVisit): Promise<string> {
    try {
      // Schedule main notification for the visit
      const notificationTrigger = await getVetVisitNotificationInput(visit);
      const notificationId = await Notifications.scheduleNotificationAsync(notificationTrigger);

      // Schedule a reminder 24 hours before
      const visitDate = new Date(visit.date);
      const reminderDate = new Date(visit.date - 24 * 60 * 60 * 1000); // 24 hours before
      const timeStr = visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const reminderTrigger: Notifications.NotificationRequestInput = {
        content: {
          title: `Vet Visit Tomorrow at ${timeStr}`,
          body: `Reminder: ${visit.reason} ${visit.notes ? `\n${visit.notes}` : ''}`
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          repeats: false,
          seconds: Math.max(1, (reminderDate.getTime() - Date.now()) / 1000)
        } as Notifications.TimeIntervalTriggerInput
      };
      
      await Notifications.scheduleNotificationAsync(reminderTrigger);
      
      console.log("Vet visit notifications scheduled:", visit.reason);
      return notificationId;
    } catch (error) {
      console.error("Error scheduling vet visit notification:", error);
      throw error;
    }
  }

  async storeVetVisitNotificationIdentifier(visitId: string, notificationIdentifier: string): Promise<boolean> {
    const result = await this.db.runAsync(
      "UPDATE vet_visits SET notificationIdentifier = ? WHERE id = ?",
      [notificationIdentifier, visitId]
    );
    return result.changes > 0;
  }

  async cancelVetVisitNotification(notificationIdentifier: string): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationIdentifier);
      console.log("Vet visit notification canceled successfully");
      return true;
    } catch (error) {
      console.error("Error canceling vet visit notification:", error);
      return false;
    }
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

async function getVetVisitNotificationInput(visit: VetVisit): Promise<Notifications.NotificationRequestInput> {
  try {
    const visitDate = new Date(visit.date);
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      repeats: false,
      seconds: Math.max(1, (visitDate.getTime() - Date.now()) / 1000)
    };

    // Format time for the notification message
    const timeStr = visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const input: Notifications.NotificationRequestInput = {
      content: {
        title: `Vet Visit Today at ${timeStr}`,
        body: `Time for ${visit.reason} ${visit.notes ? `\n${visit.notes}` : ''}`
      },
      trigger: trigger
    };
    
    console.log("Vet visit notification input:", input);
    return input;
  } catch (error) {
    console.error("Error getting vet visit notification input:", error);
    throw error;
  }
} 