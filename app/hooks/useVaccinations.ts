import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Vaccination } from '../database/types';
import { useSelectedPet } from '../providers/SelectedPetProvider';
import { useRepositories } from './useRepositories';

export function useVaccinations() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { vaccinationRepository } = useRepositories();
  const { selectedPetId } = useSelectedPet()

  const loadVaccinations = useCallback(async () => {
    try {
      // Check if repository is available
      if (!vaccinationRepository) {
        console.log("Vaccination repository not available yet");
        return;
      }
      
      console.log("Loading vaccinations for pet:", selectedPetId);
      setIsLoading(true);
      if (selectedPetId === "all") {
        const data = await vaccinationRepository.getAllVaccinations();
        setVaccinations(data);
      } else {
        const data = await vaccinationRepository.getVaccinationsForPet(selectedPetId);
        setVaccinations(data);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading vaccinations:', err);
      setError('Failed to load vaccinations');
    } finally {
      setIsLoading(false);
    }
  }, [vaccinationRepository, selectedPetId]);

  useEffect(() => {
    // Only load vaccinations if repository is available
    if (vaccinationRepository) {
      loadVaccinations();
    }
    
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "vaccinations" && vaccinationRepository) {
        console.log("Vaccinations in local database have changed");
        loadVaccinations();
      }
    });
    return () => listener.remove();
  }, [loadVaccinations, vaccinationRepository]);

  const addVaccination = useCallback(async (vaccination: Omit<Vaccination, 'id'>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const newVaccination = await vaccinationRepository.createVaccination(vaccination);
      return newVaccination;
    } catch (err) {
      console.error('Error adding vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository]);

  const updateVaccination = useCallback(async (id: string, updates: Partial<Omit<Vaccination, 'id'>>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const success = await vaccinationRepository.updateVaccination(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository]);

  const deleteVaccination = useCallback(async (id: string) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const success = await vaccinationRepository.deleteVaccination(id);
      return success;
    } catch (err) {
      console.error('Error deleting vaccination:', err);
      throw err;
    }
  }, [vaccinationRepository]);

  const getAllVaccinations = useCallback(async (): Promise<Vaccination[]> => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.getAllVaccinations();
    } catch (err) {
      console.error('Error getting all vaccinations:', err);
      throw err;
    }
  }, [vaccinationRepository]);

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

  return {
    vaccinations,
    isLoading,
    error,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    getVaccinationById,
    getAllVaccinations
  };
} 