import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Expense } from '../database/types';
import { useDataReady } from './useDataReady';
import { useRepositories } from './useRepositories';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { expenseRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadExpenses = useCallback(async () => {
    try {
      if (!expenseRepository) {
        return;
      }
      setIsLoading(true);
      setError(null);
      const data = await expenseRepository.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [expenseRepository]);

  useEffect(() => {
    // Only load expenses if data is ready and repository is available
    if (isDataReady && expenseRepository) {
      loadExpenses();
    }

    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === 'expenses' && expenseRepository) {
        console.log('Expenses in local database have changed');
        loadExpenses();
      }
    });
    return () => listener.remove();
  }, [loadExpenses, expenseRepository, isDataReady]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      const newExpense = await expenseRepository.createExpense(expense);
      return newExpense;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  }, [expenseRepository]);

  const getExpenseById = useCallback(async (id: string): Promise<Expense | null> => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      return await expenseRepository.getExpenseById(id);
    } catch (err) {
      console.error('Error getting expense by id:', err);
      throw err;
    }
  }, [expenseRepository]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      const success = await expenseRepository.updateExpense(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  }, [expenseRepository]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      const success = await expenseRepository.deleteExpense(id);
      return success;
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  }, [expenseRepository]);

  const getExpensesByPetId = useCallback(async (petId: string): Promise<Expense[]> => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      return await expenseRepository.getExpensesForPet(petId);
    } catch (err) {
      console.error('Error getting expenses by pet id:', err);
      throw err;
    }
  }, [expenseRepository]);

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpensesByPetId,
  };
} 