import { SQLiteDatabase } from 'expo-sqlite';
import { Expense } from '../types';

type ExpenseRow = {
  id: string;
  petId: string;
  date: string;
  amount: number;
  category: 'veterinary' | 'food' | 'supplies' | 'grooming' | 'medications' | 'other';
  description: string;
  vendor: string;
  reimbursed: number;
};

type SQLiteValue = string | number | null;

export class ExpenseRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Create a new expense
   */
  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        expense.petId,
        expense.date,
        expense.amount,
        expense.category,
        expense.description,
        expense.vendor,
        expense.reimbursed
      ];

      await this.db.runAsync(
        `INSERT INTO expenses (
          id, petId, date, amount, category, description, vendor, reimbursed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      return {
        id,
        ...expense
      };
    } catch (error) {
      console.error('Error in createExpense:', error);
      throw error;
    }
  }

  /**
   * Get all expenses
   */
  async getAllExpenses(): Promise<Expense[]> {
    const results = await this.db.getAllAsync<ExpenseRow>(
      'SELECT * FROM expenses ORDER BY date DESC',
      []
    );

    return results.map(this.mapExpenseRow);
  }

  /**
   * Get all expenses for a pet
   */
  async getExpensesForPet(petId: string): Promise<Expense[]> {
    const results = await this.db.getAllAsync<ExpenseRow>(
      'SELECT * FROM expenses WHERE petId = ? ORDER BY date DESC',
      [petId]
    );

    return results.map(this.mapExpenseRow);
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(id: string): Promise<Expense | null> {
    const result = await this.db.getFirstAsync<ExpenseRow>(
      'SELECT * FROM expenses WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapExpenseRow(result);
  }

  /**
   * Update an expense
   */
  async updateExpense(id: string, updates: Partial<Omit<Expense, 'id'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values: SQLiteValue[] = fields.map(field => {
      const value = updates[field as keyof typeof updates];
      return value ?? null;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE expenses SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Delete an expense
   */
  async deleteExpense(id: string): Promise<boolean> {
    const result = await this.db.runAsync(
      'DELETE FROM expenses WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  /**
   * Get expenses by category
   */
  async getExpensesByCategory(category: string): Promise<Expense[]> {
    const results = await this.db.getAllAsync<ExpenseRow>(
      'SELECT * FROM expenses WHERE category = ? ORDER BY date DESC',
      [category]
    );

    return results.map(this.mapExpenseRow);
  }

  /**
   * Get total expenses
   */
  async getTotalExpenses(): Promise<number> {
    const result = await this.db.getFirstAsync<{ total: number }>(
      'SELECT SUM(amount) as total FROM expenses',
      []
    );

    return result?.total ?? 0;
  }

  /**
   * Get total reimbursed amount
   */
  async getTotalReimbursed(): Promise<number> {
    const result = await this.db.getFirstAsync<{ total: number }>(
      'SELECT SUM(reimbursed) as total FROM expenses',
      []
    );

    return result?.total ?? 0;
  }

  /**
   * Map a database row to an Expense object
   */
  private mapExpenseRow(row: ExpenseRow): Expense {
    return {
      id: row.id,
      petId: row.petId,
      date: row.date,
      amount: row.amount,
      category: row.category,
      description: row.description,
      vendor: row.vendor,
      reimbursed: row.reimbursed
    };
  }
} 