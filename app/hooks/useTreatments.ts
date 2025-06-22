import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Treatment } from '../database/types';
import { useDataReady } from './useDataReady';
import { useRepositories } from './useRepositories';

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { treatmentRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadTreatments = useCallback(async () => {
    try {
      if (!treatmentRepository) {
        return;
      }
      setIsLoading(true);
      setError(null);
      const data = await treatmentRepository.getAllTreatments();
      setTreatments(data);
    } catch (err) {
      console.error("Error loading treatments:", err);
      setError("Failed to load treatments");
    } finally {
      setIsLoading(false);
    }
  }, [treatmentRepository]);

  useEffect(() => {
    // Only load treatments if data is ready and repository is available
    if (isDataReady && treatmentRepository) {
      loadTreatments();
    }

    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "treatments" && treatmentRepository) {
        loadTreatments();
      }
    });
    return () => listener.remove();
  }, [loadTreatments, treatmentRepository, isDataReady]);

  const addTreatment = useCallback(
    async (treatment: Omit<Treatment, "id">) => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        const newTreatment = await treatmentRepository.addTreatment(treatment);
        return newTreatment;
      } catch (err) {
        console.error("Error adding treatment:", err);
        throw err;
      }
    },
    [treatmentRepository]
  );

  const getTreatmentById = useCallback(
    async (id: string) => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        const treatment = await treatmentRepository.getTreatmentById(id);
        return treatment;
      } catch (err) {
        console.error("Error getting treatment by id:", err);
        throw err;
      }
    },
    [treatmentRepository]
  );

  const updateTreatment = useCallback(
    async (id: string, updates: Partial<Omit<Treatment, "id">>) => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        const success = await treatmentRepository.updateTreatment(id, updates);
        return success;
      } catch (err) {
        console.error("Error updating treatment:", err);
        throw err;
      }
    },
    [treatmentRepository]
  );

  const deleteTreatment = useCallback(
    async (treatmentId: string) => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        const success = await treatmentRepository.deleteTreatment(treatmentId);
        return success;
      } catch (err) {
        console.error("Error deleting treatment:", err);
        throw err;
      }
    },
    [treatmentRepository]
  );

  const getTreatmentsByPetId = useCallback(
    async (petId: string): Promise<Treatment[]> => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        return await treatmentRepository.getTreatmentsByPetId(petId);
      } catch (err) {
        console.error("Error getting treatments by pet id:", err);
        throw err;
      }
    },
    [treatmentRepository]
  );

  return {
    treatments,
    isLoading,
    error,
    addTreatment,
    getTreatmentById,
    updateTreatment,
    deleteTreatment,
    getTreatmentsByPetId,
  };
} 