import * as Notifications from "expo-notifications";
import { SQLiteDatabase } from "expo-sqlite";
import { Task } from "../types";

type TaskRow = {
  id: string;
  petId: string;
  title: string;
  type: "feeding" | "medication" | "walk" | "grooming" | "other";
  dueDate: number;
  isComplete: number;
  notes: string | null;
  recurring: number;
  recurrencePattern: "daily" | "weekly" | "monthly" | "yearly" | null;
  recurrenceInterval: number | null;
  recurrenceWeekDays: string | null;
  recurrenceMonthDay: number | null;
  recurrenceEndDate: number | null;
  recurrenceCount: number | null;
  lastCompletedDate: number | null;
  nextDueDate: number | null;
  linkedTreatmentId: string | null;
  linkedVaccinationId: string | null;
  linkedVetVisitId: string | null;
};

type SQLiteValue = string | number | null;

type TaskInput = Omit<Task, "id">;
type TaskUpdate = Partial<TaskInput>;

export class TaskRepository {
  constructor(public db: SQLiteDatabase) {}
  /**
   * Create a new task
   */
  async createTask(task: TaskInput): Promise<Task> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const params: SQLiteValue[] = [
        id,
        task.petId,
        task.title,
        task.type,
        task.dueDate,
        task.isComplete ? 1 : 0,
        task.notes ?? null,
        task.recurring ? 1 : 0,
        task.recurrencePattern ?? null,
        task.recurrenceInterval ?? null,
        task.recurrenceWeekDays
          ? JSON.stringify(task.recurrenceWeekDays)
          : null,
        task.recurrenceMonthDay ?? null,
        task.recurrenceEndDate ?? null,
        task.recurrenceCount ?? null,
        task.lastCompletedDate ?? null,
        task.nextDueDate || task.dueDate,
        task.linkedTreatmentId ?? null,
        task.linkedVaccinationId ?? null,
        task.linkedVetVisitId ?? null,
      ];

      await this.db.runAsync(
        `INSERT INTO tasks (
          id, petId, title, type, dueDate, isComplete, notes, recurring,
          recurrencePattern, recurrenceInterval, recurrenceWeekDays,
          recurrenceMonthDay, recurrenceEndDate, recurrenceCount,
          lastCompletedDate, nextDueDate, linkedTreatmentId,
          linkedVaccinationId, linkedVetVisitId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      const newTask: Task = {
        id,
        petId: task.petId,
        title: task.title,
        type: task.type,
        dueDate: task.dueDate,
        isComplete: task.isComplete,
        notes: task.notes,
        recurring: task.recurring,
        recurrencePattern: task.recurrencePattern,
        recurrenceInterval: task.recurrenceInterval,
        recurrenceWeekDays: task.recurrenceWeekDays,
        recurrenceMonthDay: task.recurrenceMonthDay,
        recurrenceEndDate: task.recurrenceEndDate,
        recurrenceCount: task.recurrenceCount,
        lastCompletedDate: task.lastCompletedDate,
        nextDueDate: task.nextDueDate || task.dueDate,
        linkedTreatmentId: task.linkedTreatmentId,
        linkedVaccinationId: task.linkedVaccinationId,
        linkedVetVisitId: task.linkedVetVisitId,
      };

      return newTask;
    } catch (error) {
      console.error("Error in createTask:", error);
      throw error;
    }
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    const results = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks",
      []
    );

    return results.map((row) => this.mapTaskRow(row));
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    const result = await this.db.getFirstAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (!result) return null;

    return this.mapTaskRow(result);
  }

  /**
   * Update a task
   */
  async updateTask(id: string, updates: TaskUpdate): Promise<boolean> {
    const fields = Object.keys(updates) as Array<keyof TaskUpdate>;
    if (fields.length === 0) return false;

    const setClause = fields
      .map((field) => {
        if (field === "isComplete" || field === "recurring") {
          return `${field} = ?`;
        }
        if (field === "recurrenceWeekDays") {
          return `${field} = ?`;
        }
        return `${field} = ?`;
      })
      .join(", ");

    const values: SQLiteValue[] = fields.map((field) => {
      const value = updates[field];
      if (field === "isComplete" || field === "recurring") {
        return (value as boolean) ? 1 : 0;
      }
      if (field === "recurrenceWeekDays" && value) {
        return JSON.stringify(value);
      }
      if (value === undefined) {
        return null;
      }
      return value as SQLiteValue;
    });

    values.push(id);

    const result = await this.db.runAsync(
      `UPDATE tasks SET ${setClause} WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  /**
   * Mark a task as complete and handle recurrence
   */
  async completeTask(id: string): Promise<boolean> {
    // First, get the task
    const task = await this.getTaskById(id);
    if (!task) return false;

    const now = new Date();
    const completionDate = now.toISOString();

    // Execute the update
    const result = await this.db.runAsync(
      `UPDATE tasks 
       SET isComplete = 1, 
           lastCompletedDate = ?
       WHERE id = ?`,
      [completionDate, id]
    );

    return result.changes > 0;
  }

  /**
   * Calculate the next occurrence of a recurring task
   */
  private calculateNextOccurrence(task: Task, fromDate: Date): Date | null {
    if (!task.recurring || !task.recurrencePattern) {
      return null;
    }

    const interval = task.recurrenceInterval || 1;
    const currentDate = new Date(fromDate);

    switch (task.recurrencePattern) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + interval);
        break;

      case "weekly":
        if (task.recurrenceWeekDays && task.recurrenceWeekDays.length > 0) {
          // Find the next weekday that matches
          let found = false;
          const maxIterations = 7; // Prevent infinite loop
          let iterations = 0;

          while (!found && iterations < maxIterations) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (task.recurrenceWeekDays.includes(currentDate.getDay())) {
              found = true;
            }
            iterations++;
          }

          if (!found) {
            currentDate.setDate(currentDate.getDate() + 7 * (interval - 1));
          }
        } else {
          currentDate.setDate(currentDate.getDate() + 7 * interval);
        }
        break;

      case "monthly":
        if (task.recurrenceMonthDay) {
          // Set to the specified day of the next month
          currentDate.setMonth(currentDate.getMonth() + interval);
          currentDate.setDate(
            Math.min(task.recurrenceMonthDay, this.getDaysInMonth(currentDate))
          );
        } else {
          currentDate.setMonth(currentDate.getMonth() + interval);
        }
        break;

      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;

      default:
        return null;
    }

    return currentDate;
  }

  /**
   * Get the number of days in a month
   */
  private getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * Get tasks for a pet
   */
  async getTasksForPet(petId: string): Promise<Task[]> {
    const results = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE petId = ? ORDER BY dueDate ASC",
      [petId]
    );

    return results.map((row) => this.mapTaskRow(row));
  }

  /**
   * Get tasks for today
   */
  async getTodaysTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split("T")[0];
    const results = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE date(dueDate) = date(?) AND isComplete = 0 ORDER BY dueDate ASC",
      [today]
    );

    return results.map((row) => this.mapTaskRow(row));
  }

  /**
   * Get upcoming tasks
   */
  async getUpcomingTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split("T")[0];
    const results = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE date(dueDate) > date(?) AND isComplete = 0 ORDER BY dueDate ASC",
      [today]
    );

    return results.map((row) => this.mapTaskRow(row));
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split("T")[0];
    const results = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE date(dueDate) < date(?) AND isComplete = 0 ORDER BY dueDate ASC",
      [today]
    );

    return results.map((row) => this.mapTaskRow(row));
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<boolean> {
    const result = await this.db.runAsync("DELETE FROM tasks WHERE id = ?", [
      id,
    ]);

    return result.changes > 0;
  }

  /**
   * Clear all tasks from the database
   */
  async clearAllTasks(): Promise<boolean> {
    try {
      await this.db.runAsync("DELETE FROM tasks", []);
      return true;
    } catch (error) {
      console.error("Error clearing tasks:", error);
      return false;
    }
  }

  /**
   * Map a database row to a Task object
   */
  private mapTaskRow(row: TaskRow): Task {
    const task: Task = {
      id: row.id,
      petId: row.petId,
      title: row.title,
      type: row.type,
      dueDate: row.dueDate,
      isComplete: Boolean(row.isComplete),
      notes: row.notes ?? undefined,
      recurring: Boolean(row.recurring),
      recurrencePattern: row.recurrencePattern ?? undefined,
      recurrenceInterval: row.recurrenceInterval ?? undefined,
      recurrenceWeekDays: row.recurrenceWeekDays
        ? JSON.parse(row.recurrenceWeekDays)
        : undefined,
      recurrenceMonthDay: row.recurrenceMonthDay ?? undefined,
      recurrenceEndDate: row.recurrenceEndDate ?? undefined,
      recurrenceCount: row.recurrenceCount ?? undefined,
      lastCompletedDate: row.lastCompletedDate ?? undefined,
      nextDueDate: row.nextDueDate ?? undefined,
      linkedTreatmentId: row.linkedTreatmentId ?? undefined,
      linkedVaccinationId: row.linkedVaccinationId ?? undefined,
      linkedVetVisitId: row.linkedVetVisitId ?? undefined,
    };

    return task;
  }

  /**
   * Get tasks by treatment ID
   */
  async getTasksByTreatmentId(treatmentId: string): Promise<Task[]> {
    const results = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE linkedTreatmentId = ? ORDER BY dueDate ASC",
      [treatmentId]
    );

    return results.map((row) => this.mapTaskRow(row));
  }

  /**
   * Undo task completion
   */
  async undoTaskCompletion(id: string): Promise<boolean> {
    // First, get the task
    const task = await this.getTaskById(id);
    if (!task) return false;

    // Execute the update
    const result = await this.db.runAsync(
      `UPDATE tasks 
       SET isComplete = 0, 
           lastCompletedDate = NULL
       WHERE id = ?`,
      [id]
    );

    return result.changes > 0;
  }

  async scheduleTaskNotification(task: Task): Promise<boolean> {
    try {
      if (task.recurring){
        const nextOccurrence =
        this.calculateNextOccurrence(task, new Date())
      if (!nextOccurrence) return false;

      let reccurenceTriggerType: Notifications.SchedulableTriggerInputTypes;
      switch (task.recurrencePattern) {
        case "daily":
          reccurenceTriggerType = Notifications.SchedulableTriggerInputTypes.DAILY;
          break;
        case "weekly":
          reccurenceTriggerType = Notifications.SchedulableTriggerInputTypes.WEEKLY;
          break;
        case "monthly":
          reccurenceTriggerType = Notifications.SchedulableTriggerInputTypes.MONTHLY;
          break;
        case "yearly":
          reccurenceTriggerType = Notifications.SchedulableTriggerInputTypes.YEARLY;
          break;
        default:
          return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: task.title,
          body: task.notes ?? "",
        },
        trigger: {
          type: reccurenceTriggerType,
          hour: 4,
          repeats: true,
        },
      });
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: task.title,
            body: task.notes ?? "",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: ((new Date(task.dueDate)).getTime() - Date.now()) / 1000,
          },
        });
      }
      console.log("Task notification scheduled:", task.title);
      return true;
    } catch (error) {
      console.error("Error scheduling task notification:", error);
      return false;
    }
  }
}
