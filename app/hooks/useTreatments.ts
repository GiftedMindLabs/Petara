import { addDatabaseChangeListener } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Treatment } from '../database/types';
import { useSelectedPet } from '../providers/SelectedPetProvider';
import { useRepositories } from './useRepositories';

export function useTreatments() {
  const { selectedPetId } = useSelectedPet()
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { treatmentRepository } = useRepositories();

  const loadTreatments = async () => {
    try {
      console.log("Loading treatments for pet:", selectedPetId);
      setIsLoading(true);
      setError(null);
      if (selectedPetId === "all") {
        const data = await treatmentRepository.getAllTreatments()
        setTreatments(data)
      } else {
        const data = await treatmentRepository.getTreatmentsByPetId(selectedPetId);
        setTreatments(data)
      }
    } catch (err) {
      console.error('Error loading treatments:', err);
      setError('Failed to load treatments');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOngoingTreatments = useCallback(async () => {
    try {
      console.log("Loading ongoing treatments");
      setIsLoading(true);
      setError(null);
      const data = await treatmentRepository.getOngoingTreatments();
      setTreatments(data);
    } catch (err) {
      console.error('Error loading ongoing treatments:', err);
      setError('Failed to load ongoing treatments');
    } finally {
      setIsLoading(false);
    }
  }, [treatmentRepository, selectedPetId]);

  useEffect(() => {
    loadTreatments()
    // Local listener
    const listener = addDatabaseChangeListener((event) => {
      if (event.tableName === "treatments") {
        console.log("Treatments in local database have changed");
        loadTreatments()
      }
    });
    return () => listener.remove();
  }, [selectedPetId]);

  const addTreatment = useCallback(async (treatment: Omit<Treatment, 'id'>) => {
    try {
      const newTreatment = await treatmentRepository.addTreatment(treatment);
      return newTreatment;
    } catch (err) {
      console.error('Error adding treatment:', err);
      throw err;
    }
  }, [treatmentRepository]);

  const updateTreatment = useCallback(async (id: string, updates: Partial<Omit<Treatment, 'id'>>) => {
    try {
      const success = await treatmentRepository.updateTreatment(id, updates);
      return success;
    } catch (err) {
      console.error('Error updating treatment:', err);
      throw err;
    }
  }, [treatmentRepository]);

  const deleteTreatment = useCallback(async (id: string) => {
    try {
      const success = await treatmentRepository.deleteTreatment(id);
      return success;
    } catch (err) {
      console.error('Error deleting treatment:', err);
      throw err;
    }
  }, [treatmentRepository]);

  const getTreatmentById = useCallback(async (id: string): Promise<Treatment | null> => {
    try {
      return await treatmentRepository.getTreatmentById(id);
    } catch (err) {
      console.error('Error getting treatment by id:', err);
      throw err;
    }
  }, [treatmentRepository]);

  return {
    treatments,
    isLoading,
    error,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    getTreatmentById
  };
} 