import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { VaccinationRepository } from "../database/repositories/vaccinationRepository";
import { Vaccination } from "../database/types";

export function useVaccinations() {
  console.log("useVaccinations hook initialized");
  const db = useSQLiteContext();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const vaccinationRepository = new VaccinationRepository(db);

  const loadVaccinations = async () => {
    console.log("useVaccinations loadVaccinations called");
    try {
      setIsLoading(true);
      setError(null);
      const loadedVaccinations = await getAllVaccinations();
      console.log("useVaccinations loadVaccinations loaded vaccinations:", loadedVaccinations?.length || 0);
      setVaccinations(loadedVaccinations || []);
    } catch (err) {
      console.error("useVaccinations loadVaccinations error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load vaccinations');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllVaccinations = async () => {
    console.log("useVaccinations getAllVaccinations called");
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.getAllVaccinations();
    } catch (err) {
      console.error("Error getting all vaccinations:", err);
      throw err;
    }
  };

  const addVaccination = async (vaccination: Omit<Vaccination, 'id'>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.createVaccination(vaccination);
    } catch (err) {
      console.error('Error adding vaccination:', err);
      throw err;
    }
  };

  const updateVaccination = async (id: string, updates: Partial<Omit<Vaccination, 'id'>>) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.updateVaccination(id, updates);
    } catch (err) {
      console.error('Error updating vaccination:', err);
      throw err;
    }
    };

  const deleteVaccination = async (id: string) => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      return await vaccinationRepository.deleteVaccination(id);
    } catch (err) {
      console.error('Error deleting vaccination:', err);
      throw err;
    }
  };

  const getVaccinationById = async (id: string): Promise<Vaccination | null> => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
      const vaccination = await vaccinationRepository.getVaccinationById(id);
      return vaccination;
    } catch (err) {
      console.error('Error getting vaccination by id:', err);
      throw err;
    }
  };

  const getVaccinationsByPetId = async (petId: string): Promise<Vaccination[]> => {
    try {
      if (!vaccinationRepository) {
        throw new Error("Vaccination repository not available");
      }
        
      const vaccinations = await vaccinationRepository.getVaccinationsForPet(petId);
      return vaccinations;
    } catch (err) {
      console.error("Error getting vaccinations by pet id:", err);
      throw err;
    }
  };

  return {
    vaccinations,
    isLoading,
    error,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    getVaccinationById,
    getVaccinationsByPetId
  };
} 