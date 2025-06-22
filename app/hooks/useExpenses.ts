  import { useState } from "react";
import { Expense } from "../database/types";
import { useRepositories } from "./useRepositories";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { expenseRepository } = useRepositories();

  const loadExpenses = async () => {
    console.log("useExpenses loadExpenses called");
    try {
      setIsLoading(true);
      setError(null);
      const loadedExpenses = await getAllExpenses();
      console.log("useExpenses loadExpenses loaded expenses:", loadedExpenses?.length || 0);
      setExpenses(loadedExpenses || []);
    } catch (err) {
      console.error("useExpenses loadExpenses error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllExpenses = async () => {

    try {
      if (!expenseRepository) {
        throw new Error("Expense repository not available");
      }
      return await expenseRepository.getAllExpenses();
    } catch (err) {
      console.error("Error getting all expenses:", err);
      throw err;
    }
  };


  const addExpense = async (expense: Omit<Expense, 'id'>) => {
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
  };

  const getExpenseById = async (id: string): Promise<Expense | null> => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      return await expenseRepository.getExpenseById(id);
    } catch (err) {
      console.error('Error getting expense by id:', err);
      throw err;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
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
  };

  const deleteExpense = async (id: string) => {
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
  };

  const getExpensesByPetId = async (petId: string): Promise<Expense[]> => {
    try {
      if (!expenseRepository) {
        throw new Error('Expense repository not available');
      }
      return await expenseRepository.getExpensesForPet(petId);
    } catch (err) {
      console.error('Error getting expenses by pet id:', err);
      throw err;
    }
  };

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