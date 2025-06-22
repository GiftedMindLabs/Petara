import { useCallback, useEffect, useState } from "react";
import { VetVisit } from "../database/types";
import { useDataReady } from "./useDataReady";
import { useRepositories } from "./useRepositories";

export function useVetVisits() {
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { vetVisitRepository } = useRepositories();
  const isDataReady = useDataReady();

  const loadVetVisits = useCallback(async () => {
    try {
      if (!vetVisitRepository) {
        return;
      }
      setIsLoading(true);
      setError(null);
      const data = await vetVisitRepository.getAllVetVisits();
      setVetVisits(data);
    } catch (err) {
      console.error("Error loading vet visits:", err);
      setError("Failed to load vet visits");
    } finally {
      setIsLoading(false);
    }
  }, [vetVisitRepository]);

  // Manual refresh function
  const refreshVetVisits = useCallback(() => {
    if (isDataReady && vetVisitRepository) {
      loadVetVisits();
    }
  }, [isDataReady, vetVisitRepository, loadVetVisits]);

  useEffect(() => {
    // Only load vet visits if data is ready and repository is available
    if (isDataReady && vetVisitRepository) {
      loadVetVisits();
    }
  }, [loadVetVisits, vetVisitRepository, isDataReady]);

  const addVetVisit = useCallback(async (vetVisit: Omit<VetVisit, 'id'>): Promise<VetVisit> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const newVetVisit = await vetVisitRepository.createVetVisit(vetVisit);

      // Schedule notification for the new visit
      const notificationId = await vetVisitRepository.scheduleVetVisitNotification(newVetVisit);
      await vetVisitRepository.storeVetVisitNotificationIdentifier(newVetVisit.id, notificationId);
      
      // Refresh vet visits after adding
      refreshVetVisits();
      return newVetVisit;
    } catch (err) {
      console.error('Error adding vet visit:', err);
      throw err;
    }
  }, [vetVisitRepository, refreshVetVisits]);

  const getVetVisitById = useCallback(async (id: string): Promise<VetVisit | null> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      return await vetVisitRepository.getVetVisitById(id);
    } catch (err) {
      console.error('Error getting vet visit by id:', err);
      throw err;
    }
  }, [vetVisitRepository]);

  const updateVetVisit = useCallback(async (id: string, updates: Partial<Omit<VetVisit, 'id'>>): Promise<boolean> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const currentVisit = await vetVisitRepository.getVetVisitById(id);
      if (!currentVisit) {
        throw new Error('Vet visit not found');
      }

      // Cancel existing notification if it exists
      /*if (currentVisit.notificationIdentifier) {
        await vetVisitRepository.cancelVetVisitNotification(currentVisit.notificationIdentifier);
      }*/

      const success = await vetVisitRepository.updateVetVisit(id, updates);
      if (!success) {
        throw new Error('Failed to update vet visit');
      }

      // Schedule new notification if date is updated or it's a future visit
      /*onst updatedVisit = await vetVisitRepository.getVetVisitById(id);
      if (updatedVisit && (updates.date || updatedVisit.date > Date.now())) {
        const notificationId = await vetVisitRepository.scheduleVetVisitNotification(updatedVisit);
        await vetVisitRepository.storeVetVisitNotificationIdentifier(id, notificationId);
      }*/
      
      // Refresh vet visits after updating
      refreshVetVisits();
      return success;
    } catch (err) {
      console.error('Error updating vet visit:', err);
      throw err;
    }
  }, [vetVisitRepository, refreshVetVisits]);

  const deleteVetVisit = useCallback(async (vetVisitId: string): Promise<boolean> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const visit = await vetVisitRepository.getVetVisitById(vetVisitId);
      if (!visit) {
        throw new Error('Vet visit not found');
      }

      // Cancel notification if it exists
      if (visit.notificationIdentifier) {
        await vetVisitRepository.cancelVetVisitNotification(visit.notificationIdentifier);
      }

      const success = await vetVisitRepository.deleteVetVisit(vetVisitId);
      if (!success) {
        throw new Error('Failed to delete vet visit');
      }
      
      // Refresh vet visits after deleting
      refreshVetVisits();
      return success;
    } catch (err) {
      console.error('Error deleting vet visit:', err);
      throw err;
    }
  }, [vetVisitRepository, refreshVetVisits]);

  const getVetVisitsByPetId = useCallback(
    async (petId: string): Promise<VetVisit[]> => {
      try {
        if (!vetVisitRepository) {
          throw new Error("Vet visit repository not available");
        }
        return await vetVisitRepository.getVetVisitsForPet(petId);
      } catch (err) {
        console.error("Error getting vet visits by pet id:", err);
        throw err;
      }
    },
    [vetVisitRepository]
  );

  return {
    vetVisits,
    isLoading,
    error,
    refreshVetVisits,
    addVetVisit,
    getVetVisitById,
    updateVetVisit,
    deleteVetVisit,
    getVetVisitsByPetId,
  };
} 