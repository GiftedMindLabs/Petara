import { SQLiteDatabase } from 'expo-sqlite';
import { Contact } from '../types';

type ContactRow = {
  id: string;
  name: string;
  type: 'veterinarian' | 'groomer' | 'sitter' | 'trainer' | 'other';
  phone: string;
  email: string;
  address: string;
  notes: string;
};

type SQLiteValue = string | number | null;

export class ContactRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Create a new contact
   */
  async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        contact.name,
        contact.type,
        contact.phone,
        contact.email,
        contact.address,
        contact.notes
      ];

      await this.db.runAsync(
        `INSERT INTO contacts (
          id, name, type, phone, email, address, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      return {
        id,
        ...contact
      };
    } catch (error) {
      console.error('Error in createContact:', error);
      throw error;
    }
  }

  /**
   * Get all contacts
   */
  async getAllContacts(): Promise<Contact[]> {
    const results = await this.db.getAllAsync<ContactRow>(
      'SELECT * FROM contacts ORDER BY name',
      []
    );

    return results.map(this.mapContactRow);
  }

  /**
   * Get contact by ID
   */
  async getContactById(id: string): Promise<Contact | null> {
    const result = await this.db.getFirstAsync<ContactRow>(
      'SELECT * FROM contacts WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapContactRow(result);
  }

  /**
   * Get contacts by type
   */
  async getContactsByType(type: string): Promise<Contact[]> {
    const results = await this.db.getAllAsync<ContactRow>(
      'SELECT * FROM contacts WHERE type = ? ORDER BY name',
      [type]
    );

    return results.map(this.mapContactRow);
  }

  /**
   * Update a contact
   */
  async updateContact(id: string, updates: Partial<Omit<Contact, 'id'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values: SQLiteValue[] = fields.map(field => {
      const value = updates[field as keyof typeof updates];
      return value ?? null;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE contacts SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Delete a contact
   */
  async deleteContact(id: string): Promise<boolean> {
    const result = await this.db.runAsync(
      'DELETE FROM contacts WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Map a database row to a Contact object
   */
  private mapContactRow(row: ContactRow): Contact {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      phone: row.phone,
      email: row.email,
      address: row.address,
      notes: row.notes
    };
  }
} 