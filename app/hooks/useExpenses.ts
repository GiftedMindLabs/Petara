import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Expense } from '../database/types';
import { useSelectedPet } from '../providers/SelectedPetProvider';
import { useRepositories } from './useRepositories';

export function useExpenses() {
  const { selectedPetId } = useSelectedPet();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalReimbursed, setTotalReimbursed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { expenseRepository } = useRepositories();

  const loadExpenses = async () => {
    try {
      console.log("Loading expenses for pet:", selectedPetId);
      setIsLoading(true);
      setError(null);
      if (selectedPetId === "all") {
        const data = await expenseRepository.getAllExpenses();
        setExpenses(data);
        const total = await expenseRepository.getTotalExpenses();
        setTotalExpenses(total);
        const reimbursed = await expenseRepository.getTotalReimbursed();
        setTotalReimbursed(reimbursed);
      } else {
        const data = await expenseRepository.getExpensesForPet(selectedPetId);
        setExpenses(data);
      }
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExpensesByCategory = useCallback(async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await expenseRepository.getExpensesByCategory(category);
      setExpenses(data);
    } catch (err) {
      console.error('Error loading expenses by category:', err);
      setError('Failed to load expenses by category');
    } finally {
      setIsLoading(false);
    }
  }, [expenseRepository]);

  const getTotalExpenses = useCallback(async () => {
    try {
      return await expenseRepository.getTotalExpenses();
    } catch (err) {
      console.error('Error getting total expenses:', err);
      throw err;
    }
  }, [expenseRepository]);

  const getTotalReimbursed = useCallback(async () => {
    try {
      return await expenseRepository.getTotalReimbursed();
    } catch (err) {
      console.error('Error getting total reimbursed:', err);
      throw err;
    }
  }, [expenseRepository]);

  useEffect(() => {
    loadExpenses();
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "expenses") {
        console.log("Expenses in local database have changed");
        loadExpenses();
      }
    });
    return () => listener.remove();
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await expenseRepository.createExpense(expense);
      return newExpense;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  }, [expenseRepository]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    try {
      const success = await expenseRepository.updateExpense(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  }, [expenseRepository]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const success = await expenseRepository.deleteExpense(id);
      return success;
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  }, [expenseRepository]);

  const getExpenseById = useCallback(async (id: string): Promise<Expense | null> => {
    try {
      return await expenseRepository.getExpenseById(id);
    } catch (err) {
      console.error('Error getting expense by id:', err);
      throw err;
    }
  }, [expenseRepository]);

  return {
    expenses,
    totalExpenses,
    totalReimbursed,
    isLoading,
    error,
    getTotalExpenses,
    getTotalReimbursed,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById
  };
} 