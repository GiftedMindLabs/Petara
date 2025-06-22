import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { VetVisit } from '../database/types';
import { useSelectedPet } from '../providers/SelectedPetProvider';
import { useRepositories } from './useRepositories';

export function useVetVisits() {
  const [visits, setVisits] = useState<VetVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { vetVisitRepository } = useRepositories();
  const { selectedPetId } = useSelectedPet();

  const loadVisits = useCallback(async () => {
    try {
      // Check if repository is available
      if (!vetVisitRepository) {
        console.log("Vet visit repository not available yet");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      let visitsData: VetVisit[];
      if (selectedPetId === 'all') {
        visitsData = await vetVisitRepository.getAllVetVisits();
      } else {
        visitsData = await vetVisitRepository.getVetVisitsForPet(selectedPetId);
      }
      setVisits(visitsData);
    } catch (err) {
      console.error('Error loading visits:', err);
      setError('Failed to load vet visits');
    } finally {
      setIsLoading(false);
    }
  }, [vetVisitRepository, selectedPetId]);

  useEffect(() => {
    // Only load visits if repository is available
    if (vetVisitRepository) {
      loadVisits();
    }
    
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "vet_visits" && vetVisitRepository) {
        console.log("Vet visits in local database have changed");
        loadVisits();
      }
    });
    return () => listener.remove();
  }, [loadVisits, vetVisitRepository]);

  const addVetVisit = async (visit: Omit<VetVisit, 'id'>): Promise<void> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const newVisit = await vetVisitRepository.createVetVisit(visit);

      // Schedule notification for the new visit
      const notificationId = await vetVisitRepository.scheduleVetVisitNotification(newVisit);
      await vetVisitRepository.storeVetVisitNotificationIdentifier(newVisit.id, notificationId);
    } catch (err) {
      console.error('Error adding vet visit:', err);
      throw err;
    }
  };

  const updateVetVisit = async (id: string, updates: Partial<Omit<VetVisit, 'id'>>): Promise<void> => {
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
    } catch (err) {
      console.error('Error updating vet visit:', err);
      throw err;
    }
  };

  const deleteVetVisit = async (id: string): Promise<void> => {
    try {
      if (!vetVisitRepository) {
        throw new Error("Vet visit repository not available");
      }
      const visit = await vetVisitRepository.getVetVisitById(id);
      if (!visit) {
        throw new Error('Vet visit not found');
      }

      // Cancel notification if it exists
      if (visit.notificationIdentifier) {
        await vetVisitRepository.cancelVetVisitNotification(visit.notificationIdentifier);
      }

      const success = await vetVisitRepository.deleteVetVisit(id);
      if (!success) {
        throw new Error('Failed to delete vet visit');
      }
    } catch (err) {
      console.error('Error deleting vet visit:', err);
      throw err;
    }
  };

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

  return {
    visits,
    isLoading,
    error,
    addVetVisit,
    updateVetVisit,
    deleteVetVisit,
    getVetVisitById
  };
} 