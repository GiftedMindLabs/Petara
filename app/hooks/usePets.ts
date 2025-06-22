import { useCallback, useEffect, useState } from "react";
import { Pet } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { petRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadPets = useCallback(async () => {
    try {
      if (!petRepository) {
        return;
      }
      setIsLoading(true);
      setError(null);
      const data = await petRepository.getAllPets();
      setPets(data);
    } catch (err) {
      console.error("Error loading pets:", err);
      setError("Failed to load pets");
    } finally {
      setIsLoading(false);
    }
  }, [petRepository]);

  // Manual refresh function
  const refreshPets = useCallback(() => {
    if (isDataReady && petRepository) {
      loadPets();
    }
  }, [isDataReady, petRepository, loadPets]);

  useEffect(() => {
    // Only load pets if data is ready and repository is available
    if (isDataReady && petRepository) {
      loadPets();
    }
  }, [loadPets, petRepository, isDataReady]);

  const addPet = useCallback(
    async (pet: Omit<Pet, "id">) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const newPet = await petRepository.createPet(pet);
        // Refresh pets after adding
        refreshPets();
        return newPet;
      } catch (err) {
        console.error("Error adding pet:", err);
        throw err;
      }
    },
    [petRepository, refreshPets]
  );

  const getPetById = useCallback(
    async (id: string) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const pet = await petRepository.getPetById(id);
        return pet;
      } catch (err) {
        console.error("Error getting pet by id:", err);
        throw err;
      }
    },
    [petRepository]
  );

  const updatePet = useCallback(
    async (id: string, updates: Partial<Omit<Pet, "id">>) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const success = await petRepository.updatePet(id, updates);
        // Refresh pets after updating
        refreshPets();
        return success;
      } catch (err) {
        console.error("Error updating pet:", err);
        throw err;
      }
    },
    [petRepository, refreshPets]
  );

  const deletePet = useCallback(
    async (petId: string) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const success = await petRepository.deletePet(petId);
        // Refresh pets after deleting
        refreshPets();
        return success;
      } catch (err) {
        console.error("Error deleting pet:", err);
        throw err;
      }
    },
    [petRepository, refreshPets]
  );

  const getLivingPets = useCallback(async () => {
    try {
      const livingPets = await petRepository!.getLivingPets();
      return livingPets;
    } catch (err) {
      console.error("Error getting living pets:", err);
      throw err;
    }
  }, []);

  return {
    pets,
    isLoading,
    error,
    refreshPets,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    getLivingPets,
  };
}
