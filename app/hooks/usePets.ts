import { useCallback, useEffect, useState } from "react";
import { Pet } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now()); // Force re-render
  const { petRepository } = useRepositories();
  const isDataReady = useDataReady();

  console.log("usePets hook re-rendering, pets count:", pets?.length || 0, "timestamp:", refreshTimestamp);

  const loadPets = useCallback(async () => {
    console.log("usePets loadPets called");
    if (!petRepository || !isDataReady) {
      console.log("usePets loadPets - repository or data not ready");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedPets = await petRepository.getAllPets();
      console.log("usePets loadPets loaded pets:", loadedPets?.length || 0);
      setPets(loadedPets || []);
      setRefreshTimestamp(Date.now()); // Force re-render
    } catch (err) {
      console.error("usePets loadPets error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load pets');
    } finally {
      setIsLoading(false);
    }
  }, [petRepository, isDataReady]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log("usePets refresh called");
    try {
      if (petRepository) {
        const loadedPets = await petRepository.getAllPets();
        console.log("usePets refresh loaded pets:", loadedPets?.length || 0);
        setPets(loadedPets || []);
        setError(null);
        setRefreshTimestamp(Date.now()); // Force re-render
      }
    } catch (err) {
      console.error("usePets refresh error:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh pets');
    }
  }, [petRepository]);

  useEffect(() => {
    console.log("usePets useEffect triggered, isDataReady:", isDataReady, "petRepository:", !!petRepository);
    if (isDataReady && petRepository) {
      loadPets();
    }
  }, [isDataReady, petRepository, loadPets, refreshTimestamp]);

  const addPet = useCallback(
    async (pet: Omit<Pet, "id">) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const newPet = await petRepository.createPet(pet);
        // Refresh pets after adding
        refresh();
        return newPet;
      } catch (err) {
        console.error("Error adding pet:", err);
        throw err;
      }
    },
    [petRepository, refresh]
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
        refresh();
        return success;
      } catch (err) {
        console.error("Error updating pet:", err);
        throw err;
      }
    },
    [petRepository, refresh]
  );

  const deletePet = useCallback(
    async (petId: string) => {
      try {
        if (!petRepository) {
          throw new Error("Pet repository not available");
        }
        const success = await petRepository.deletePet(petId);
        // Refresh pets after deleting
        refresh();
        return success;
      } catch (err) {
        console.error("Error deleting pet:", err);
        throw err;
      }
    },
    [petRepository, refresh]
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
    refresh,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    getLivingPets,
  };
}
