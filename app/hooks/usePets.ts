import { addDatabaseChangeListener } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Pet } from "../database/types";
import { useRepositories } from "./useRepositories";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { petRepository } = useRepositories();

  const loadPets = useCallback(async () => {
    try {
      // Check if repository is available
      if (!petRepository) {
        console.log("Pet repository not available yet");
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

  useEffect(() => {
    // Only load pets if repository is available
    if (petRepository) {
      loadPets();
    }

    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "pets" && petRepository) {
        console.log("Pets in local database have changed");
        loadPets();
      }
    });
    return () => listener.remove();
  }, [loadPets, petRepository]);

  const addPet = useCallback(
    async (pet: Omit<Pet, "id">) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const newPet = await petRepository.createPet(pet);
        return newPet;
      } catch (err) {
        console.error("Error adding pet:", err);
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
        return success;
      } catch (err) {
        console.error("Error updating pet:", err);
        throw err;
      }
    },
    [petRepository]
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

  const deletePet = useCallback(
    async (id: string) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const success = await petRepository.deletePet(id);
        return success;
      } catch (err) {
        console.error("Error deleting pet:", err);
        throw err;
      }
    },
    [petRepository]
  );

  const getLivingPets = useCallback(async () => {
    try {
      const livingPets = await petRepository.getLivingPets();
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
    getPetById,
    addPet,
    updatePet,
    deletePet,
    getLivingPets,
  };
}
