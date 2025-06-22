import { useCallback, useEffect, useState } from "react";
import { Expense } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now()); // Force re-render
  const { expenseRepository } = useRepositories();
  const isDataReady = useDataReady();

  console.log("useExpenses hook re-rendering, expenses count:", expenses?.length || 0, "timestamp:", refreshTimestamp);

  const loadExpenses = useCallback(async () => {
    console.log("useExpenses loadExpenses called");
    if (!expenseRepository || !isDataReady) {
      console.log("useExpenses loadExpenses - repository or data not ready");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedExpenses = await expenseRepository.getAllExpenses();
      console.log("useExpenses loadExpenses loaded expenses:", loadedExpenses?.length || 0);
      setExpenses(loadedExpenses || []);
      setRefreshTimestamp(Date.now()); // Force re-render
    } catch (err) {
      console.error("useExpenses loadExpenses error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [expenseRepository, isDataReady]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log("useExpenses refresh called");
    try {
      if (expenseRepository) {
        const loadedExpenses = await expenseRepository.getAllExpenses();
        console.log("useExpenses refresh loaded expenses:", loadedExpenses?.length || 0);
        setExpenses(loadedExpenses || []);
        setError(null);
        setRefreshTimestamp(Date.now()); // Force re-render
      }
    } catch (err) {
      console.error("useExpenses refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh expenses');
    }
  }, [expenseRepository]);

  useEffect(() => {
    console.log("useExpenses useEffect triggered, isDataReady:", isDataReady, "expenseRepository:", !!expenseRepository);
    if (isDataReady && expenseRepository) {
      loadExpenses();
    }
  }, [isDataReady, expenseRepository, loadExpenses]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      const newExpense = await expenseRepository.createExpense(expense);
      // Refresh expenses after adding
      refresh();
      return newExpense;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  }, [expenseRepository, refresh]);

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
      // Refresh expenses after updating
      refresh();
      return success;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  }, [expenseRepository, refresh]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      const success = await expenseRepository.deleteExpense(id);
      // Refresh expenses after deleting
      refresh();
      return success;
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  }, [expenseRepository, refresh]);

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
    refresh,
    addExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpensesByPetId,
  };
} 