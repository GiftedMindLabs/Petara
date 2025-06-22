import { addDatabaseChangeListener } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Task } from "../database/types";
import { useRepositories } from "./useRepositories";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { taskRepository } = useRepositories();

  const loadTasks = useCallback(async () => {
    console.log("Loading tasks...");
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskRepository.getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [taskRepository]);

  useEffect(() => {
    // Initial fetch of the data
    loadTasks();

    //Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "tasks") {
        loadTasks();
      }
    });
    return () => listener.remove();
  }, [loadTasks]);

  const addTask = useCallback(
    async (task: Omit<Task, "id">) => {
      try {
        const newTask = await taskRepository.createTask(task);
        /*if (newTask) {
          const notificationIdentifier = await scheduleTaskNotification(newTask);
          await taskRepository.storeTaskNotificationIdentifier(newTask.id, notificationIdentifier);
        }*/
        return newTask;
      } catch (err) {
        console.error("Error adding task:", err);
        throw err;
      }
    },
    []
  );

  const scheduleTaskNotification = useCallback(
    async (task: Task) => {
      try {
        console.log("Scheduling task notification:", task.title);
        const success = await taskRepository.scheduleTaskNotification(task);
        return success;
      } catch (err) {
        console.error("Error scheduling task notification:", err);
        throw err;
      }
    },
    []
  );

  const getTaskById = useCallback(
    async (id: string) => {
      try {
        const task = await taskRepository.getTaskById(id);
        return task;
      } catch (err) {
        console.error("Error getting task by id:", err);
        throw err;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, "id">>) => {
      try {
        const success = await taskRepository.updateTask(id, updates);
        return success;
      } catch (err) {
        console.error("Error updating task:", err);
        throw err;
      }
    },
    []
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        const success = await taskRepository.deleteTask(taskId);
        // Delete task scheduled notification
        const task = await taskRepository.getTaskById(taskId);
        if (task?.notificationIdentifier) {
          await taskRepository.cancelTaskNotification(task.notificationIdentifier);
        }
        console.log("Task deleted successfully");
        return success;
      } catch (err) {
        console.error("Error deleting task:", err);
        throw err;
      }
    },
    []
  );

  const completeTask = useCallback(
    async (id: string) => {
      try {
        const success = await taskRepository.completeTask(id);
        return success;
      } catch (err) {
        console.error("Error completing task:", err);
        throw err;
      }
    },
    []
  );

  const clearAllTasks = useCallback(async () => {
    try {
      const success = await taskRepository.clearAllTasks();
      return success;
    } catch (err) {
      console.error("Error clearing tasks:", err);
      throw err;
    }
  }, []);

  const getTasksByTreatmentId = useCallback(
    async (treatmentId: string): Promise<Task[]> => {
      try {
        return await taskRepository.getTasksByTreatmentId(treatmentId);
      } catch (err) {
        console.error("Error getting tasks by treatment id:", err);
        throw err;
      }
    },
    []
  );

  const undoTaskCompletion = useCallback(
    async (id: string) => {
      try {
        const success = await taskRepository.undoTaskCompletion(id);
        return success;
      } catch (err) {
        console.error("Error undoing task completion:", err);
        throw err;
      }
    },
    []
  );

  return {
    tasks,
    isLoading,
    error,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
    clearAllTasks,
    getTasksByTreatmentId,
    undoTaskCompletion,
  };
}
