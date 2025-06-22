import { useCallback, useEffect, useState } from "react";
import { Vaccination } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useVaccinations() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now()); // Force re-render
  const { vaccinationRepository } = useRepositories();
  const isDataReady = useDataReady();

  console.log("useVaccinations hook re-rendering, vaccinations count:", vaccinations?.length || 0, "timestamp:", refreshTimestamp);

  const loadVaccinations = useCallback(async () => {
    console.log("useVaccinations loadVaccinations called");
    if (!vaccinationRepository || !isDataReady) {
      console.log("useVaccinations loadVaccinations - repository or data not ready");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedVaccinations = await vaccinationRepository.getAllVaccinations();
      console.log("useVaccinations loadVaccinations loaded vaccinations:", loadedVaccinations?.length || 0);
      setVaccinations(loadedVaccinations || []);
      setRefreshTimestamp(Date.now()); // Force re-render
    } catch (err) {
      console.error("useVaccinations loadVaccinations error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load vaccinations');
    } finally {
      setIsLoading(false);
    }
  }, [vaccinationRepository, isDataReady]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log("useVaccinations refresh called");
    try {
      if (vaccinationRepository) {
        const loadedVaccinations = await vaccinationRepository.getAllVaccinations();
        console.log("useVaccinations refresh loaded vaccinations:", loadedVaccinations?.length || 0);
        setVaccinations(loadedVaccinations || []);
        setError(null);
        setRefreshTimestamp(Date.now()); // Force re-render
      }
    } catch (err) {
      console.error("useVaccinations refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh vaccinations');
    }
  }, [vaccinationRepository]);

  useEffect(() => {
    console.log("useVaccinations useEffect triggered, isDataReady:", isDataReady, "vaccinationRepository:", !!vaccinationRepository);
    if (isDataReady && vaccinationRepository) {
      loadVaccinations();
    }
  }, [isDataReady, vaccinationRepository, loadVaccinations, refreshTimestamp]);

  const addVaccination = useCallback(async (vaccination: Omit<Vaccination, 'id'>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const newVaccination = await vaccinationRepository.createVaccination(vaccination);
      // Refresh vaccinations after adding
      refresh();
      return newVaccination;
    } catch (err) {
      console.error('Error adding vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository, refresh]);

  const updateVaccination = useCallback(async (id: string, updates: Partial<Omit<Vaccination, 'id'>>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const success = await vaccinationRepository.updateVaccination(id, updates);
      // Refresh vaccinations after updating
      refresh();
      return success;
    } catch (err) {
      console.error('Error updating vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository, refresh]);

  const deleteVaccination = useCallback(async (id: string) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const success = await vaccinationRepository.deleteVaccination(id);
      // Refresh vaccinations after deleting
      refresh();
      return success;
    } catch (err) {
      console.error('Error deleting vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository, refresh]);

  const getVaccinationById = useCallback(async (id: string): Promise<Vaccination | null> => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.getVaccinationById(id);
    } catch (err) {
      console.error('Error getting vaccination by id:', err);
      throw err;
    }
  }, [vaccinationRepository]);

  const getVaccinationsByPetId = useCallback(async (petId: string): Promise<Vaccination[]> => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.getVaccinationsForPet(petId);
    } catch (err) {
      console.error("Error getting vaccinations by pet id:", err);
      throw err;
    }
  }, [vaccinationRepository]);

  return {
    vaccinations,
    isLoading,
    error,
    refresh,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    getVaccinationById,
    getVaccinationsByPetId
  };
} 