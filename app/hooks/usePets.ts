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
    // Initial fetch of the data
    loadPets();

    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "pets") {
        console.log("Pets in local database have changed");
        loadPets();
      }
    });
    return () => listener.remove();
  }, []);

  const addPet = useCallback(
    async (pet: Omit<Pet, "id">) => {
      try {
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
        const success = await petRepository.updatePet(id, updates);
        return success;
      } catch (err) {
        console.error("Error updating pet:", err);
        throw err;
      }
    },
    [petRepository]
  );

  const deletePet = useCallback(
    async (id: string) => {
      try {
        const success = await petRepository.deletePet(id);
        return success;
      } catch (err) {
        console.error("Error deleting pet:", err);
        throw err;
      }
    },
    [petRepository]
  );

  const getPetById = useCallback(
    async (id: string) => {
      try {
        const pet = await petRepository.getPetById(id);
        return pet;
      } catch (err) {
        console.error("Error getting pet by id:", err);
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
  }, [petRepository]);

  return {
    pets,
    isLoading,
    error,
    getPetById,
    loadPets,
    addPet,
    updatePet,
    deletePet,
    getLivingPets,
  };
}
