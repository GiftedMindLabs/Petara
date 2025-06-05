import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Task } from '../database/types';
import { useRepositories } from './useRepositories';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { taskRepository } = useRepositories();

  const loadTasks = useCallback(async () => {
    try {
      console.log("Loading tasks");
      setIsLoading(true);
      setError(null);
      const data = await taskRepository.getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
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
        console.log("Tasks in local database have changed");
        loadTasks();
      }
    });
    return () => listener.remove();
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await taskRepository.createTask(task);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  }, [taskRepository]);

  const getTaskById = useCallback(async (id: string) => {
    try {
      const task = await taskRepository.getTaskById(id);
      return task;
    } catch (err) {
      console.error('Error getting task by id:', err);
      throw err;
    }
  }, [taskRepository]);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    try {
      const success = await taskRepository.updateTask(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  }, [taskRepository]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const success = await taskRepository.deleteTask(id);
      return success;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }, [taskRepository]);

  const completeTask = useCallback(async (id: string) => {
    try {
      const success = await taskRepository.completeTask(id);
      return success;
    } catch (err) {
      console.error('Error completing task:', err);
      throw err;
    }
  }, [taskRepository]);

  const clearAllTasks = useCallback(async () => {
    try {
      const success = await taskRepository.clearAllTasks();
      return success;
    } catch (err) {
      console.error('Error clearing tasks:', err);
      throw err;
    }
  }, [taskRepository]);

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
    clearAllTasks
  };
} 