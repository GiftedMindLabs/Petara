import { useState } from "react";
import { Pet } from "../database/types";
import { useRepositories } from "./useRepositories";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { petRepository } = useRepositories();
  
  const loadPets = async () => {
    console.log("usePets loadPets called");

    try {
      setIsLoading(true);
      setError(null);
      const loadedPets = await getAllPets();
      console.log("usePets loadPets loaded pets:", loadedPets?.length || 0);
      setPets(loadedPets || []);
    } catch (err) {
      console.error("usePets loadPets error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load pets');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPets = async () => {
    try {
      if (!petRepository) {
        throw new Error("Pet repository not available");
      }
      return await petRepository.getAllPets();
    } catch (err) {
      console.error("Error getting all pets:", err);
      throw err;
    }
  };

  const refresh = async () => {
    console.log("usePets refresh called");
    try {
      if (petRepository) {
        const loadedPets = await petRepository.getAllPets();
        console.log("usePets refresh loaded pets:", loadedPets?.length || 0);
        setPets(loadedPets || []);
        setError(null);
        
      }
    } catch (err) {
      console.error("usePets refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh pets');
    }
  };

  const addPet = async (pet: Omit<Pet, "id">) => {
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
  };

  const getPetById = async (id: string) => {
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
  };

  const updatePet = async (id: string, updates: Partial<Omit<Pet, "id">>) => {
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
  };

  const deletePet = async (petId: string) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const success = await petRepository.deletePet(petId);
        return success;
      } catch (err) {
        console.error("Error deleting pet:", err);
        throw err;
      }
  };

  const getLivingPets = async () => {
    try {
      const livingPets = await petRepository!.getLivingPets();
      return livingPets;
    } catch (err) {
      console.error("Error getting living pets:", err);
      throw err;
    }
  };

  return {
    pets,
    isLoading,
    error,
    refresh,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    getLivingPets,
  };
}
