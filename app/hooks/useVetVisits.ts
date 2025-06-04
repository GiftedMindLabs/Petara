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
      setIsLoading(true);
      let visitsData: VetVisit[];
      if (selectedPetId === 'all') {
        visitsData = await vetVisitRepository.getUpcomingVetVisits();
      } else {
        visitsData = await vetVisitRepository.getVetVisitsForPet(selectedPetId);
      }
      setVisits(visitsData);
      setError(null);
    } catch (err) {
      console.error('Error loading visits:', err);
      setError('Failed to load vet visits');
    } finally {
      setIsLoading(false);
    }
  }, [vetVisitRepository, selectedPetId]);

  useEffect(() => {
    loadVisits()
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "vet_visits") {
        console.log("Vet visits in local database have changed");
        loadVisits()
      }
    });
    return () => listener.remove();
  }, [vetVisitRepository, selectedPetId]);

  const addVetVisit = async (visit: Omit<VetVisit, 'id'>): Promise<void> => {
    try {
      await vetVisitRepository.createVetVisit(visit);
    } catch (err) {
      console.error('Error adding vet visit:', err);
      throw err;
    }
  };

  const updateVetVisit = async (id: string, updates: Partial<Omit<VetVisit, 'id'>>): Promise<void> => {
    try {
      const success = await vetVisitRepository.updateVetVisit(id, updates);
      if (!success) {
        throw new Error('Failed to update vet visit');
      }
    } catch (err) {
      console.error('Error updating vet visit:', err);
      throw err;
    }
  };

  const deleteVetVisit = async (id: string): Promise<void> => {
    try {
      const success = await vetVisitRepository.deleteVetVisit(id);
      if (!success) {
        throw new Error('Failed to delete vet visit');
      }
    } catch (err) {
      console.error('Error deleting vet visit:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  return {
    visits,
    isLoading,
    error,
    loadVisits,
    addVetVisit,
    updateVetVisit,
    deleteVetVisit
  };
} 