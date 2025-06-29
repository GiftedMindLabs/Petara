import { addDatabaseChangeListener } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Task } from "../database/types";
import { useRepositories } from "./useRepositories";

export function useTasks() {
  console.log("useTasks hook initialized");
  const { taskRepository } = useRepositories();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    console.log("useTasks loadTasks called");
    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await getAllTasks();
      console.log("useTasks loadTasks loaded tasks:", loadedTasks?.length || 0);
      setTasks(loadedTasks || []);
    } catch (err) {
      console.error("useTasks loadTasks error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

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
  }, []);


  const getAllTasks = async () => {
    try {
      if (!taskRepository) {
        throw new Error("Task repository not available");
      }
      return await taskRepository.getAllTasks();
    } catch (err) {
      console.error("Error getting all tasks:", err);
      throw err;
    }
  };

  const addTask = async (task: Omit<Task, "id">) => {
      try {
        console.log("addTask called with:", task.title);
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const newTask = await taskRepository.createTask(task);
        console.log("Task created, calling refreshTasks");
        return newTask;
      } catch (err) {
        console.error("Error adding task:", err);
        throw err;
      }
  };

  const scheduleTaskNotification = async (task: Task) => {
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
  };

  const getTaskById = async (id: string) => {
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
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, "id">>) => {
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
  };

  const deleteTask = async (taskId: string) => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        const success = await taskRepository.deleteTask(taskId);
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
  };

  const completeTask = async (id: string) => {
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
  };

  const clearAllTasks = async () => {
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
  };

  const getTasksByTreatmentId = async (treatmentId: string): Promise<Task[]> => {
      try {
        if (!taskRepository) {
          throw new Error("Task repository not available");
        }
        return await taskRepository.getTasksByTreatmentId(treatmentId);
      } catch (err) {
        console.error("Error getting tasks by treatment id:", err);
        throw err;
      }
  };

  const undoTaskCompletion = async (id: string) => {
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
  };

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
