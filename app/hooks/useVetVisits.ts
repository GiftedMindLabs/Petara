import { addDatabaseChangeListener } from "expo-sqlite";
import { useEffect, useState } from "react";
import { VetVisit } from "../database/types";
import { useRepositories } from "./useRepositories";

export function useVetVisits() {
  console.log("useVetVisits hook initialized");
  const { vetVisitRepository } = useRepositories();
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadVetVisits = async () => {
    console.log("useVetVisits loadVetVisits called");

    try {
      setIsLoading(true);
      setError(null);
      const loadedVetVisits = await getAllVetVisits();
      console.log("useVetVisits loadVetVisits loaded vetVisits:", loadedVetVisits?.length || 0);
      setVetVisits(loadedVetVisits || []);
    } catch (err) {
      console.error("useVetVisits loadVetVisits error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load vet visits');
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      // Initial fetch of the data
      loadVetVisits();
  
      //Local listener
      const listener = addDatabaseChangeListener((event) => {
        if (event.tableName === "vet_visits") {
          loadVetVisits();
        }
      });
      return () => listener.remove();
    }, []);

  const getAllVetVisits = async () => { 
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      return await vetVisitRepository.getAllVetVisits();
    } catch (err) {
      console.error("Error getting all vet visits:", err);
      throw err;
    }
  };

  const getVetVisitById = async (id: string): Promise<VetVisit | null> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      return await vetVisitRepository.getVetVisitById(id);
    } catch (err) {
      console.error('Error getting vet visit by id:', err);
      throw err;
    }
  };

  const updateVetVisit = async (id: string, updates: Partial<Omit<VetVisit, 'id'>>): Promise<boolean> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const currentVisit = await vetVisitRepository.getVetVisitById(id);
      if (!currentVisit) {
        throw new Error('Vet visit not found');
      }

      const success = await vetVisitRepository.updateVetVisit(id, updates);
      if (!success) {
        throw new Error('Failed to update vet visit');
      }
      
      return success;
    } catch (err) {
      console.error('Error updating vet visit:', err);
      throw err;
    }
  };

  const deleteVetVisit = async (vetVisitId: string): Promise<boolean> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const visit = await vetVisitRepository.getVetVisitById(vetVisitId);
      if (!visit) {
        throw new Error('Vet visit not found');
      }

      const success = await vetVisitRepository.deleteVetVisit(vetVisitId);
      if (!success) {
        throw new Error('Failed to delete vet visit');
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting vet visit:', err);
      throw err;
    }
  };

  const getVetVisitsByPetId = async (petId: string): Promise<VetVisit[]> => {
      try {
        if (!vetVisitRepository) {
          throw new Error("Vet visit repository not available");
        }
        return await vetVisitRepository.getVetVisitsForPet(petId);
      } catch (err) {
        console.error("Error getting vet visits by pet id:", err);
        throw err;
      }
  };

  return {
    vetVisits,
    isLoading,
    error,
    getVetVisitById,
    updateVetVisit,
    deleteVetVisit,
    getVetVisitsByPetId,
  };
} 