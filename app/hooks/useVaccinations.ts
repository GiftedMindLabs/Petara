import { useCallback, useEffect, useState } from "react";
import { Vaccination } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useVaccinations() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { vaccinationRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadVaccinations = useCallback(async () => {
    try {
      if (!vaccinationRepository) {
        return;
      }
      setIsLoading(true);
      setError(null);
      const data = await vaccinationRepository.getAllVaccinations();
      setVaccinations(data);
    } catch (err) {
      console.error("Error loading vaccinations:", err);
      setError("Failed to load vaccinations");
    } finally {
      setIsLoading(false);
    }
  }, [vaccinationRepository]);

  // Manual refresh function
  const refreshVaccinations = useCallback(() => {
    if (isDataReady && vaccinationRepository) {
      loadVaccinations();
    }
  }, [isDataReady, vaccinationRepository, loadVaccinations]);

  useEffect(() => {
    // Only load vaccinations if data is ready and repository is available
    if (isDataReady && vaccinationRepository) {
      loadVaccinations();
    }
  }, [loadVaccinations, vaccinationRepository, isDataReady]);

  const addVaccination = useCallback(async (vaccination: Omit<Vaccination, 'id'>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const newVaccination = await vaccinationRepository.createVaccination(vaccination);
      // Refresh vaccinations after adding
      refreshVaccinations();
      return newVaccination;
    } catch (err) {
      console.error('Error adding vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository, refreshVaccinations]);

  const updateVaccination = useCallback(async (id: string, updates: Partial<Omit<Vaccination, 'id'>>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const success = await vaccinationRepository.updateVaccination(id, updates);
      // Refresh vaccinations after updating
      refreshVaccinations();
      return success;
    } catch (err) {
      console.error('Error updating vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository, refreshVaccinations]);

  const deleteVaccination = useCallback(async (id: string) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const success = await vaccinationRepository.deleteVaccination(id);
      // Refresh vaccinations after deleting
      refreshVaccinations();
      return success;
    } catch (err) {
      console.error('Error deleting vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository, refreshVaccinations]);

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
    refreshVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    getVaccinationById,
    getVaccinationsByPetId
  };
} 