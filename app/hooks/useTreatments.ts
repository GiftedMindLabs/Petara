import { useCallback, useEffect, useState } from "react";
import { Treatment } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now()); // Force re-render
  const { treatmentRepository } = useRepositories();
  const isDataReady = useDataReady();

  console.log("useTreatments hook re-rendering, treatments count:", treatments?.length || 0, "timestamp:", refreshTimestamp);

  const loadTreatments = useCallback(async () => {
    console.log("useTreatments loadTreatments called");
    if (!treatmentRepository || !isDataReady) {
      console.log("useTreatments loadTreatments - repository or data not ready");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedTreatments = await treatmentRepository.getAllTreatments();
      console.log("useTreatments loadTreatments loaded treatments:", loadedTreatments?.length || 0);
      setTreatments(loadedTreatments || []);
      setRefreshTimestamp(Date.now()); // Force re-render
    } catch (err) {
      console.error("useTreatments loadTreatments error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load treatments');
    } finally {
      setIsLoading(false);
    }
  }, [treatmentRepository, isDataReady]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log("useTreatments refresh called");
    try {
      if (treatmentRepository) {
        const loadedTreatments = await treatmentRepository.getAllTreatments();
        console.log("useTreatments refresh loaded treatments:", loadedTreatments?.length || 0);
        setTreatments(loadedTreatments || []);
        setError(null);
        setRefreshTimestamp(Date.now()); // Force re-render
      }
    } catch (err) {
      console.error("useTreatments refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh treatments');
    }
  }, [treatmentRepository]);

  useEffect(() => {
    console.log("useTreatments useEffect triggered, isDataReady:", isDataReady, "treatmentRepository:", !!treatmentRepository);
    if (isDataReady && treatmentRepository) {
      loadTreatments();
    }
  }, [isDataReady, treatmentRepository, loadTreatments]);

  const addTreatment = useCallback(
    async (treatment: Omit<Treatment, "id">) => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        const newTreatment = await treatmentRepository.addTreatment(treatment);
        // Refresh treatments after adding
        refresh();
        return newTreatment;
      } catch (err) {
        console.error("Error adding treatment:", err);
        throw err;
      }
    },
    [treatmentRepository, refresh]
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
        // Refresh treatments after updating
        refresh();
        return success;
      } catch (err) {
        console.error("Error updating treatment:", err);
        throw err;
      }
    },
    [treatmentRepository, refresh]
  );

  const deleteTreatment = useCallback(
    async (treatmentId: string) => {
      try {
        if (!treatmentRepository) {
          throw new Error("Treatment repository not available");
        }
        const success = await treatmentRepository.deleteTreatment(treatmentId);
        // Refresh treatments after deleting
        refresh();
        return success;
      } catch (err) {
        console.error("Error deleting treatment:", err);
        throw err;
      }
    },
    [treatmentRepository, refresh]
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
    refresh,
    addTreatment,
    getTreatmentById,
    updateTreatment,
    deleteTreatment,
    getTreatmentsByPetId,
  };
} 