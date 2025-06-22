import { addDatabaseChangeListener } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Task } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { taskRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadTasks = useCallback(async () => {
    console.log("Loading tasks...");
    try {
      // Check if repository is available
      if (!taskRepository) {
        console.log("Task repository not available yet");
        return;
      }
      
      console.log("Task repository available, proceeding with load...");
      setIsLoading(true);
      setError(null);
      
      console.log("Calling getAllTasks...");
      const data = await taskRepository.getAllTasks();
      console.log("getAllTasks completed, setting tasks:", data.length);
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      console.error("Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        repository: taskRepository ? 'available' : 'null'
      });
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [taskRepository]);

  useEffect(() => {
    // Only load tasks if data is ready and repository is available
    if (isDataReady && taskRepository) {
      loadTasks();
    }

    // Database change listener - only add if repository is available
    if (taskRepository) {
      const listener = addDatabaseChangeListener((event: { tableName: string }) => {
        if (event.tableName === "tasks") {
          console.log("Tasks in local database have changed");
          loadTasks();
        }
      });
      return () => listener.remove();
    }
  }, [isDataReady, taskRepository, loadTasks]);

  const addTask = useCallback(
    async (task: Omit<Task, "id">) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
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
    [taskRepository]
  );

  const scheduleTaskNotification = useCallback(
    async (task: Task) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        console.log("Scheduling task notification:", task.title);
        const success = await taskRepository.scheduleTaskNotification(task);
        return success;
      } catch (err) {
        console.error("Error scheduling task notification:", err);
        throw err;
      }
    },
    [taskRepository]
  );

  const getTaskById = useCallback(
    async (id: string) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const task = await taskRepository.getTaskById(id);
        return task;
      } catch (err) {
        console.error("Error getting task by id:", err);
        throw err;
      }
    },
    [taskRepository]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, "id">>) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const success = await taskRepository.updateTask(id, updates);
        return success;
      } catch (err) {
        console.error("Error updating task:", err);
        throw err;
      }
    },
    [taskRepository]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
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
    [taskRepository]
  );

  const completeTask = useCallback(
    async (id: string) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const success = await taskRepository.completeTask(id);
        return success;
      } catch (err) {
        console.error("Error completing task:", err);
        throw err;
      }
    },
    [taskRepository]
  );

  const clearAllTasks = useCallback(async () => {
    try {
      if (!taskRepository) {
        throw new Error("Task repository not available");
      }
      const success = await taskRepository.clearAllTasks();
      return success;
    } catch (err) {
      console.error("Error clearing tasks:", err);
      throw err;
    }
  }, [taskRepository]);

  const getTasksByTreatmentId = useCallback(
    async (treatmentId: string): Promise<Task[]> => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        return await taskRepository.getTasksByTreatmentId(treatmentId);
      } catch (err) {
        console.error("Error getting tasks by treatment id:", err);
        throw err;
      }
    },
    [taskRepository]
  );

  const undoTaskCompletion = useCallback(
    async (id: string) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const success = await taskRepository.undoTaskCompletion(id);
        return success;
      } catch (err) {
        console.error("Error undoing task completion:", err);
        throw err;
      }
    },
    [taskRepository]
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
