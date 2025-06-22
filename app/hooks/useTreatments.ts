import { useState } from "react";
import { Treatment } from "../database/types";
import { useRepositories } from "./useRepositories";

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { treatmentRepository } = useRepositories();

  const loadTreatments = async () => {
    console.log("useTreatments loadTreatments called");
    try {
      setIsLoading(true);
      setError(null);
      const loadedTreatments = await getAllTreatments();
      console.log("useTreatments loadTreatments loaded treatments:", loadedTreatments?.length || 0);
      setTreatments(loadedTreatments || []);
    } catch (err) {
      console.error("useTreatments loadTreatments error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load treatments');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTreatments = async () => {
    console.log("useTreatments refresh called");
    try {
      if (!treatmentRepository) {
        throw new Error("Treatment repository not available");
      }
      return await treatmentRepository.getAllTreatments();
    } catch (err) {
      console.error("Error getting all treatments:", err);
      throw err;
    }
  };

  const addTreatment = async (treatment: Omit<Treatment, "id">) => {
    try {
      if (!treatmentRepository) {
        throw new Error("Treatment repository not available");
      }
      return await treatmentRepository.addTreatment(treatment);
    } catch (err) {
      console.error("Error adding treatment:", err);
      throw err;
    }
  };

  const getTreatmentById = async (id: string) => {
    try {
      if (!treatmentRepository) {
        throw new Error("Treatment repository not available");
      }
      return await treatmentRepository.getTreatmentById(id);
    } catch (err) {
      console.error("Error getting treatment by id:", err);
      throw err;
    }
  };

  const updateTreatment = async (id: string, updates: Partial<Omit<Treatment, "id">>) => {
    try {
      if (!treatmentRepository) {
        throw new Error("Treatment repository not available");
      }
      return await treatmentRepository.updateTreatment(id, updates);
    } catch (err) {
      console.error("Error updating treatment:", err);
      throw err;
    }
  };

  const deleteTreatment = async (treatmentId: string) => {
    try {
      if (!treatmentRepository) {
        throw new Error("Treatment repository not available");
      }
      const success = await treatmentRepository.deleteTreatment(treatmentId);
      return success;
    } catch (err) {
      console.error("Error deleting treatment:", err);
      throw err;
    }
  };

  const getTreatmentsByPetId = async (petId: string): Promise<Treatment[]> => {
    try {
      if (!treatmentRepository) {
        throw new Error("Treatment repository not available");
      }
      return await treatmentRepository.getTreatmentsByPetId(petId);
    } catch (err) {
      console.error("Error getting treatments by pet id:", err);
      throw err;
    }
  };

  return {
    treatments,
    isLoading,
    error,
    addTreatment,
    getTreatmentById,
    updateTreatment,
    deleteTreatment,
    getTreatmentsByPetId,
  };
} 