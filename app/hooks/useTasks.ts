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
    console.log("useTasks loadTasks called");
    if (!taskRepository || !isDataReady) {
      console.log("useTasks loadTasks - repository or data not ready");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await taskRepository.getAllTasks();
      console.log("useTasks loadTasks loaded tasks:", loadedTasks?.length || 0);
      setTasks(loadedTasks || []);
    } catch (err) {
      console.error("useTasks loadTasks error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [taskRepository, isDataReady]);

  // Manual refresh function
  const refreshTasks = useCallback(() => {
    console.log("refreshTasks called");
    if (isDataReady && taskRepository) {
      loadTasks();
    }
  }, [isDataReady, taskRepository, loadTasks]);

  useEffect(() => {
    console.log("useTasks useEffect triggered, isDataReady:", isDataReady, "taskRepository:", !!taskRepository);
    if (isDataReady && taskRepository) {
      loadTasks();
    }
  }, [isDataReady, taskRepository, loadTasks]);

  const addTask = useCallback(
    async (task: Omit<Task, "id">) => {
      try {
        console.log("addTask called with:", task.title);
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const newTask = await taskRepository.createTask(task);
        console.log("Task created, calling refreshTasks");
        // Refresh tasks after adding
        refreshTasks();
        return newTask;
      } catch (err) {
        console.error("Error adding task:", err);
        throw err;
      }
    },
    [taskRepository, refreshTasks]
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
        // Refresh tasks after updating
        refreshTasks();
        return success;
      } catch (err) {
        console.error("Error updating task:", err);
        throw err;
      }
    },
    [taskRepository, refreshTasks]
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
        // Refresh tasks after deleting
        refreshTasks();
        return success;
      } catch (err) {
        console.error("Error deleting task:", err);
        throw err;
      }
    },
    [taskRepository, refreshTasks]
  );

  const completeTask = useCallback(
    async (id: string) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const success = await taskRepository.completeTask(id);
        // Refresh tasks after completing
        refreshTasks();
        return success;
      } catch (err) {
        console.error("Error completing task:", err);
        throw err;
      }
    },
    [taskRepository, refreshTasks]
  );

  const clearAllTasks = useCallback(async () => {
    try {
      if (!taskRepository) {
        throw new Error("Task repository not available");
      }
      const success = await taskRepository.clearAllTasks();
      // Refresh tasks after clearing
      refreshTasks();
      return success;
    } catch (err) {
      console.error("Error clearing tasks:", err);
      throw err;
    }
  }, [taskRepository, refreshTasks]);

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
        // Refresh tasks after undoing completion
        refreshTasks();
        return success;
      } catch (err) {
        console.error("Error undoing task completion:", err);
        throw err;
      }
    },
    [taskRepository, refreshTasks]
  );

  const refresh = useCallback(async () => {
    console.log("useTasks refresh called");
    try {
      if (taskRepository) {
        const loadedTasks = await taskRepository.getAllTasks();
        console.log("useTasks refresh loaded tasks:", loadedTasks?.length || 0);
        setTasks(loadedTasks || []);
        setError(null);
        
      }
    } catch (err) {
      console.error("useTasks refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh tasks');
    }
  }, [taskRepository]);

  return {
    tasks,
    isLoading,
    error,
    refreshTasks,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
    clearAllTasks,
    getTasksByTreatmentId,
    undoTaskCompletion,
    refresh,
  };
}
